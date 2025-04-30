
import { useState, useRef, useEffect, useCallback } from 'react';
import { Heart, MoreHorizontal, Plus } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { toast } from "@/components/ui/use-toast";
import UploadModal from './UploadModal';
import '../../styles/feed.css';

// Category list
const CATEGORIES = [
  "All", "Design", "Illustration", "Branding", "Photography", 
  "Web Development", "Mobile Apps", "Animation", "UI/UX", "3D"
];

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

interface FeedItem {
  id: number;
  type: 'image' | 'video';
  src: string;
  username: string;
  avatar: string;
  likes: number;
  categories: string[];
  size: 'small' | 'medium' | 'large';
}

const Feed = () => {
  // State
  const [feedItems, setFeedItems] = useState<FeedItem[]>(SAMPLE_FEED_ITEMS);
  const [filteredItems, setFilteredItems] = useState<FeedItem[]>(SAMPLE_FEED_ITEMS);
  const [loading, setLoading] = useState(false);
  const [likedItems, setLikedItems] = useState<Record<number, boolean>>({});
  const [activeCategory, setActiveCategory] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  
  // Refs
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

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

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  // Handle liking a post
  const handleLike = (id: number) => {
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
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            video.play().catch(error => console.log('Video play failed:', error));
          } else {
            video.pause();
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
        id: item.id + feedItems.length,
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
      type: file.type.startsWith('video/') ? 'video' as const : 'image' as const,
      src: URL.createObjectURL(file),
      username: 'current_user', // In a real app, this would be the current user
      avatar: 'https://randomuser.me/api/portraits/women/10.jpg', // Placeholder
      likes: 0,
      categories: selectedCategories === 'All' ? CATEGORIES : selectedCategories,
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

  return (
    <>
      <div className="feed-container">
        <div id="feed" className="masonry">
          {filteredItems.length > 0 ? (
            filteredItems.map(item => (
              <div 
                className={`card size-${item.size}`}
                key={item.id}
                data-categories={item.categories.join(',')}
              >
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
                
                <div className="overlay top">
                  <button className="menu-btn">
                    <MoreHorizontal size={24} />
                  </button>
                </div>
                
                <div className="overlay bottom">
                  <div className="user-info">
                    <Avatar className="avatar">
                      <AvatarImage src={item.avatar} alt={item.username} />
                      <AvatarFallback>{item.username[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="username">{item.username}</span>
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
        categories={CATEGORIES}
      />
    </>
  );
};

export default Feed;
