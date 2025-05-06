
import { useState } from 'react';
import { Heart, MoreHorizontal } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export interface FeedItemProps {
  id: number;
  type: 'image' | 'video';
  src: string;
  username: string;
  avatar: string;
  likes: number;
  categories: string[];
  size: 'small' | 'medium' | 'large';
  isLiked: boolean;
  onLike: (id: number) => void;
}

const FeedItem = ({ 
  id, 
  type, 
  src, 
  username, 
  avatar, 
  likes, 
  size, 
  isLiked, 
  onLike 
}: FeedItemProps) => {
  return (
    <div 
      className={`card size-${size}`}
      key={id}
    >
      {type === 'video' ? (
        <video 
          src={src}
          loop
          muted
          playsInline
          className="feed-media"
        />
      ) : (
        <img 
          src={src}
          alt={`Post by ${username}`}
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
            <AvatarImage src={avatar} alt={username} />
            <AvatarFallback>{username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="username">{username}</span>
        </div>
        
        <button 
          className={`like-btn ${isLiked ? 'liked' : ''}`}
          onClick={() => onLike(id)}
        >
          <Heart 
            size={20} 
            fill={isLiked ? 'var(--accent)' : 'none'} 
            color={isLiked ? 'var(--accent)' : 'currentColor'}
          />
          <span className="like-count">{likes}</span>
        </button>
      </div>
    </div>
  );
};

export default FeedItem;
