
import { useState, useRef, useEffect } from 'react';
import { Heart, MoreHorizontal, Plus } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import '../../styles/feed.css';

// Sample data for the feed
const SAMPLE_FEED_ITEMS = [
  {
    id: 1,
    type: 'image',
    src: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
    username: 'techexplorer',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    likes: 423
  },
  {
    id: 2,
    type: 'video',
    src: 'https://assets.mixkit.co/videos/preview/mixkit-woman-running-above-the-camera-on-a-running-machine-32807-large.mp4',
    username: 'fitness_pro',
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    likes: 1287
  },
  {
    id: 3,
    type: 'image',
    src: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
    username: 'coding_genius',
    avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
    likes: 876
  },
  {
    id: 4,
    type: 'video',
    src: 'https://assets.mixkit.co/videos/preview/mixkit-clouds-moving-in-the-sky-field-1467-large.mp4',
    username: 'nature_love',
    avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
    likes: 654
  },
  {
    id: 5,
    type: 'image',
    src: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81',
    username: 'digital_nomad',
    avatar: 'https://randomuser.me/api/portraits/women/5.jpg',
    likes: 542
  },
  {
    id: 6,
    type: 'video',
    src: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-with-shopping-bags-35534-large.mp4',
    username: 'shopaholic',
    avatar: 'https://randomuser.me/api/portraits/men/6.jpg',
    likes: 321
  },
  {
    id: 7,
    type: 'image',
    src: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901',
    username: 'cat_lover',
    avatar: 'https://randomuser.me/api/portraits/women/7.jpg',
    likes: 987
  }
];

interface FeedItem {
  id: number;
  type: 'image' | 'video';
  src: string;
  username: string;
  avatar: string;
  likes: number;
}

const Feed = () => {
  const [feedItems, setFeedItems] = useState<FeedItem[]>(SAMPLE_FEED_ITEMS);
  const [loading, setLoading] = useState(false);
  const [likedItems, setLikedItems] = useState<Record<number, boolean>>({});
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

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
  }, [feedItems]);

  // Infinite scroll implementation
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !loading) {
          loadMoreItems();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [loading]);

  const loadMoreItems = () => {
    setLoading(true);
    
    // Simulate loading delay
    setTimeout(() => {
      // Clone and modify some of the existing items for simplicity
      const newItems = SAMPLE_FEED_ITEMS.map(item => ({
        ...item,
        id: item.id + feedItems.length,
        likes: Math.floor(Math.random() * 1000)
      }));
      
      setFeedItems(prev => [...prev, ...newItems]);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="feed-container">
      <div id="feed">
        {feedItems.map(item => (
          <div className="card" key={item.id}>
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
        ))}
        
        {/* Loading indicator and observer target */}
        <div ref={loadMoreRef} className="loading-container">
          {loading && <div className="loading-spinner" />}
        </div>
      </div>
      
      <button id="upload-btn">
        <Plus size={24} />
      </button>
    </div>
  );
};

export default Feed;
