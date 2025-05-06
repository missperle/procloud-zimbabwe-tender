
import { useState, useCallback, useEffect } from 'react';

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

export interface FeedItem {
  id: number;
  type: 'image' | 'video';
  src: string;
  username: string;
  avatar: string;
  likes: number;
  categories: string[];
  size: 'small' | 'medium' | 'large';
}

export const useFeed = (activeCategory: string) => {
  // State
  const [feedItems, setFeedItems] = useState<FeedItem[]>(SAMPLE_FEED_ITEMS);
  const [filteredItems, setFilteredItems] = useState<FeedItem[]>(SAMPLE_FEED_ITEMS);
  const [loading, setLoading] = useState(false);
  const [likedItems, setLikedItems] = useState<Record<number, boolean>>({});
  const [page, setPage] = useState(1);
  
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

  // Generate a random size for new items
  const getRandomSize = (): 'small' | 'medium' | 'large' => {
    const sizes: ('small' | 'medium' | 'large')[] = ['small', 'medium', 'large'];
    const randomIndex = Math.floor(Math.random() * sizes.length);
    return sizes[randomIndex];
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

  // Add new item to feed
  const addItemToFeed = (newItem: FeedItem) => {
    setFeedItems(prev => [newItem, ...prev]);
  };

  return {
    filteredItems,
    likedItems,
    loading,
    handleLike,
    loadMoreItems,
    getRandomSize,
    addItemToFeed
  };
};
