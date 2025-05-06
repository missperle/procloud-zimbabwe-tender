
import { useRef, useEffect } from 'react';
import FeedItem, { FeedItemProps } from './FeedItem';

interface FeedGridProps {
  items: Omit<FeedItemProps, 'onLike' | 'isLiked'>[];
  likedItems: Record<number, boolean>;
  loading: boolean;
  onLike: (id: number) => void;
  onLoadMore: () => void;
}

const FeedGrid = ({ items, likedItems, loading, onLike, onLoadMore }: FeedGridProps) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    if (loadMoreRef.current && !observerRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !loading) {
            onLoadMore();
          }
        },
        { threshold: 0.1 }
      );
      
      observerRef.current.observe(loadMoreRef.current);
    }
    
    return () => {
      observerRef.current?.disconnect();
    };
  }, [loading, onLoadMore]);

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
  }, [items]);

  if (items.length === 0) {
    return (
      <div className="empty-state">
        <p>No posts found in this category.</p>
      </div>
    );
  }

  return (
    <>
      {items.map(item => (
        <FeedItem
          key={item.id}
          {...item}
          isLiked={!!likedItems[item.id]}
          onLike={onLike}
        />
      ))}
      
      {/* Loading indicator and observer target */}
      <div ref={loadMoreRef} className="loading-container">
        {loading && <div className="loading-spinner" />}
      </div>
    </>
  );
};

export default FeedGrid;
