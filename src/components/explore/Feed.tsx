
import { useState, useRef, useEffect, useCallback } from 'react';
import { Heart, MoreHorizontal, Plus } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { toast } from "@/components/ui/use-toast";
import UploadModal from './UploadModal';
import '../../styles/feed.css';
import { useAuth } from '@/contexts/AuthContext';
import { categories } from '@/components/layout/CategoryNav';
import { getFirestore, collection, query, where, orderBy, getDocs, doc, getDoc } from 'firebase/firestore';
import { getApp } from 'firebase/app';

// Define types for feed items
interface FeedItem {
  id: number | string;
  type: 'image' | 'video' | 'brief';
  src?: string;
  username: string;
  pseudonym?: string;
  avatar?: string;
  likes: number;
  categories: string[];
  size: 'small' | 'medium' | 'large';
  // Brief-specific fields
  reviewText?: string;
  originalText?: string;
  status?: string;
}

// Sample data for the feed with categories and assigned sizes
const SAMPLE_FEED_ITEMS = [
  {
    id: 1,
    type: 'image' as const,
    src: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
    username: 'techexplorer',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    likes: 423,
    categories: ['Design', 'UI/UX'],
    size: 'medium' as const
  },
  {
    id: 2,
    type: 'video' as const,
    src: 'https://assets.mixkit.co/videos/preview/mixkit-woman-running-above-the-camera-on-a-running-machine-32807-large.mp4',
    username: 'fitness_pro',
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    likes: 1287,
    categories: ['Photography'],
    size: 'large' as const
  },
  {
    id: 3,
    type: 'image' as const,
    src: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
    username: 'coding_genius',
    avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
    likes: 876,
    categories: ['Web Development'],
    size: 'small' as const
  },
  {
    id: 4,
    type: 'video' as const,
    src: 'https://assets.mixkit.co/videos/preview/mixkit-clouds-moving-in-the-sky-field-1467-large.mp4',
    username: 'nature_love',
    avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
    likes: 654,
    categories: ['Photography'],
    size: 'medium' as const
  },
  {
    id: 5,
    type: 'image' as const,
    src: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81',
    username: 'digital_nomad',
    avatar: 'https://randomuser.me/api/portraits/women/5.jpg',
    likes: 542,
    categories: ['Mobile Apps', '3D'],
    size: 'small' as const
  },
  {
    id: 6,
    type: 'video' as const,
    src: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-with-shopping-bags-35534-large.mp4',
    username: 'shopaholic',
    avatar: 'https://randomuser.me/api/portraits/men/6.jpg',
    likes: 321,
    categories: ['Branding'],
    size: 'large' as const
  },
  {
    id: 7,
    type: 'image' as const,
    src: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901',
    username: 'cat_lover',
    avatar: 'https://randomuser.me/api/portraits/women/7.jpg',
    likes: 987,
    categories: ['Animation', 'Illustration'],
    size: 'medium' as const
  },
  {
    id: 8,
    type: 'image' as const,
    src: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5',
    username: 'matrix_fan',
    avatar: 'https://randomuser.me/api/portraits/men/8.jpg',
    likes: 432,
    categories: ['Design', 'Web Development'],
    size: 'small' as const
  }
];

const Feed = ({ activeCategory }: { activeCategory: string }) => {
  // State
  const [feedItems, setFeedItems] = useState<FeedItem[]>(SAMPLE_FEED_ITEMS);
  const [filteredItems, setFilteredItems] = useState<FeedItem[]>(SAMPLE_FEED_ITEMS);
  const [loading, setLoading] = useState(true);
  const [likedItems, setLikedItems] = useState<Record<string | number, boolean>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const { currentUser } = useAuth();
  
  // Refs
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Fetch published briefs from Firestore
  useEffect(() => {
    const fetchPublishedBriefs = async () => {
      try {
        const db = getFirestore(getApp("proverb-digital-client"));
        const briefsRef = collection(db, "briefs");
        
        // Query for published briefs
        const briefsQuery = query(
          briefsRef,
          where("status", "==", "published"),
          orderBy("publishedAt", "desc")
        );
        
        const briefsSnapshot = await getDocs(briefsQuery);
        const briefsData: FeedItem[] = [];
        
        for (const doc of briefsSnapshot.docs) {
          const brief = doc.data();
          
          // If the brief has a creatorId, fetch their pseudonym
          let pseudonym = "Anonymous";
          if (brief.clientId) {
            try {
              const userDoc = await getDoc(doc.ref.firestore.doc(`users/${brief.clientId}`));
              if (userDoc.exists()) {
                const userData = userDoc.data();
                pseudonym = userData.pseudonym || "Anonymous";
              }
            } catch (error) {
              console.error("Error fetching user pseudonym:", error);
            }
          }
          
          // Get a random size for the brief card
          const sizes: ('small' | 'medium' | 'large')[] = ['small', 'medium', 'large'];
          const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
          
          briefsData.push({
            id: doc.id,
            type: 'brief',
            username: pseudonym,
            pseudonym: pseudonym,
            reviewText: brief.reviewText,
            originalText: brief.originalText,
            status: brief.status,
            likes: 0,
            categories: brief.categories || [],
            size: randomSize,
            avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${pseudonym}`
          });
        }
        
        // Combine sample media with real briefs
        const combinedItems = [...briefsData, ...SAMPLE_FEED_ITEMS];
        setFeedItems(combinedItems);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching published briefs:", error);
        setLoading(false);
      }
    };
    
    fetchPublishedBriefs();
  }, []);

  // Filter items when activeCategory changes
  useEffect(() => {
    if (activeCategory === "All") {
      setFilteredItems(feedItems);
    } else {
      setFilteredItems(
        feedItems.filter(item => item.categories.includes(activeCategory))
      );
    }
  }, [activeCategory, feedItems]);

  // Handle liking a post
  const handleLike = (id: number | string) => {
    setLikedItems(prev => {
      const isLiked = !prev[id];
      
      // Update the likes count in the feedItems
      setFeedItems(items => 
        items.map(item => 
          item.id === id 
            ? { ...item, likes: item.likes + (isLiked ? 1 : -1) } 
            : item
        )
      );
      
      return { ...prev, [id]: isLiked };
    });
  };

  // Handle video play/pause when in viewport
  useEffect(() => {
    const videoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.target instanceof HTMLVideoElement) {
            const video = entry.target;
            if (entry.isIntersecting) {
              video.play().catch(error => console.log('Video play failed:', error));
            } else {
              video.pause();
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    const videos = document.querySelectorAll('.card video');
    videos.forEach(video => videoObserver.observe(video));

    return () => {
      videos.forEach(video => videoObserver.unobserve(video));
      videoObserver.disconnect();
    };
  }, [filteredItems]);

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    if (loadMoreRef.current && !observerRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !loading) {
            loadMoreItems();
          }
        },
        { threshold: 0.1 }
      );
      
      observerRef.current.observe(loadMoreRef.current);
    }
    
    return () => {
      observerRef.current?.disconnect();
    };
  }, [loading]);

  // Generate a random size for new items
  const getRandomSize = (): 'small' | 'medium' | 'large' => {
    const sizes: ('small' | 'medium' | 'large')[] = ['small', 'medium', 'large'];
    const randomIndex = Math.floor(Math.random() * sizes.length);
    return sizes[randomIndex];
  };

  // Load more items for infinite scroll
  const loadMoreItems = useCallback(() => {
    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      // Clone and modify some of the existing items for simplicity
      const newItems: FeedItem[] = SAMPLE_FEED_ITEMS.map(item => ({
        ...item,
        id: `${item.id}-${feedItems.length}`,
        likes: Math.floor(Math.random() * 1000),
        size: getRandomSize() // Assign random sizes to new items
      }));
      
      setFeedItems(prev => [...prev, ...newItems]);
      setPage(prevPage => prevPage + 1);
      setLoading(false);
    }, 1500);
  }, [feedItems.length]);

  // Handle form submission
  const handleSubmit = (formData: FormData) => {
    // In a real app, this would be an API call
    console.log('Form data submitted:', formData);
    
    // Extract form values
    const file = formData.get('file') as File;
    const caption = formData.get('caption') as string;
    const categoriesJSON = formData.get('categories') as string;
    const selectedCategories = JSON.parse(categoriesJSON);
    
    // Create a new item
    const newItem: FeedItem = {
      id: Date.now(),
      type: file.type.startsWith('video/') ? 'video' : 'image',
      src: URL.createObjectURL(file),
      username: currentUser?.email?.split('@')[0] || 'anonymous_user',
      avatar: 'https://randomuser.me/api/portraits/women/10.jpg', // Placeholder
      likes: 0,
      categories: selectedCategories === 'All' ? categories : selectedCategories,
      size: getRandomSize() // Assign a random size to the new item
    };
    
    // Add the new item to the feed
    setFeedItems(prev => [newItem, ...prev]);
    
    // Show success toast
    toast({
      title: "Post created",
      description: "Your post has been created successfully!",
    });
  };

  // Render brief cards differently from media cards
  const renderFeedItem = (item: FeedItem) => {
    if (item.type === 'brief') {
      return (
        <div className="card-content p-4">
          <h3 className="text-lg font-semibold mb-2">Job Opportunity</h3>
          <p className="text-sm mb-3">{item.reviewText}</p>
          <div className="text-xs text-gray-500">Categories: {item.categories.join(', ')}</div>
        </div>
      );
    } else {
      return (
        <>
          {item.type === 'video' ? (
            <video 
              src={item.src}
              loop
              muted
              playsInline
              className="feed-media"
            />
          ) : (
            <img 
              src={item.src}
              alt={`Post by ${item.username}`}
              className="feed-media"
            />
          )}
        </>
      );
    }
  };

  return (
    <>
      <div className="feed-container">
        {loading && filteredItems.length === 0 ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div id="feed" className="masonry">
            {filteredItems.length > 0 ? (
              filteredItems.map(item => (
                <div 
                  className={`card size-${item.size}`}
                  key={item.id}
                  data-categories={item.categories.join(',')}
                >
                  {renderFeedItem(item)}
                  
                  <div className="overlay top">
                    <button className="menu-btn">
                      <MoreHorizontal size={24} />
                    </button>
                  </div>
                  
                  <div className="overlay bottom">
                    <div className="user-info">
                      <Avatar className="avatar">
                        <AvatarImage src={item.avatar} alt={item.pseudonym || item.username} />
                        <AvatarFallback>
                          {(item.pseudonym || item.username)[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="username">{item.pseudonym || item.username}</span>
                    </div>
                    
                    <button 
                      className={`like-btn ${likedItems[item.id] ? 'liked' : ''}`}
                      onClick={() => handleLike(item.id)}
                    >
                      <Heart 
                        size={20} 
                        fill={likedItems[item.id] ? 'var(--accent)' : 'none'} 
                        color={likedItems[item.id] ? 'var(--accent)' : 'currentColor'}
                      />
                      <span className="like-count">{item.likes}</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>No posts found in this category.</p>
              </div>
            )}
            
            {/* Loading indicator and observer target */}
            <div ref={loadMoreRef} className="loading-container">
              {loading && <div className="loading-spinner" />}
            </div>
          </div>
        )}
        
        <button 
          id="upload-btn"
          onClick={() => setModalOpen(true)}
          aria-label="Create new post"
        >
          <Plus size={24} />
        </button>
      </div>
      
      <UploadModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        categories={categories}
      />
    </>
  );
};

export default Feed;
