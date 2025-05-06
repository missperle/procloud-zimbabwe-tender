
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import UploadModal from './upload/UploadModal';
import '@/styles/feed.css'; // Fixed import path using alias
import { useAuth } from '@/contexts/AuthContext';
import { categories } from '@/components/layout/CategoryNav';
import { useFeed, FeedItem } from './feed/useFeed';
import FeedGrid from './feed/FeedGrid';
import { supabase } from '@/integrations/supabase/client';

const Feed = ({ activeCategory }: { activeCategory: string }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const { currentUser } = useAuth();
  const { 
    filteredItems, 
    likedItems, 
    loading, 
    handleLike, 
    loadMoreItems,
    getRandomSize,
    addItemToFeed
  } = useFeed(activeCategory);

  // Handle form submission
  const handleSubmit = async (formData: FormData) => {
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "Please login to create posts.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setModalOpen(false);
      
      // Extract form values
      const file = formData.get('file') as File;
      const caption = formData.get('caption') as string;
      const categoriesJSON = formData.get('categories') as string;
      const fileUrl = formData.get('fileUrl') as string;
      const selectedCategories = JSON.parse(categoriesJSON);
      
      // Create a new item
      const newItem: FeedItem = {
        id: Date.now(),
        type: file.type.startsWith('video/') ? 'video' as const : 'image' as const,
        src: fileUrl, // Use the uploaded file URL from Supabase
        username: currentUser?.email?.split('@')[0] || 'anonymous_user',
        avatar: 'https://randomuser.me/api/portraits/women/10.jpg', // Placeholder
        likes: 0,
        categories: selectedCategories === 'All' ? categories : selectedCategories,
        size: getRandomSize() // Assign a random size to the new item
      };
      
      // Add the new item to the feed
      addItemToFeed(newItem);
      
      // Show success toast
      toast({
        title: "Post created",
        description: "Your post has been created successfully!",
      });
    } catch (error) {
      console.error('Error handling form submission:', error);
      toast({
        title: "Error",
        description: "Failed to create your post. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="feed-container">
        <div id="feed" className="masonry">
          <FeedGrid 
            items={filteredItems}
            likedItems={likedItems}
            loading={loading}
            onLike={handleLike}
            onLoadMore={loadMoreItems}
          />
        </div>
        
        <button 
          id="upload-btn"
          onClick={() => {
            if (!currentUser) {
              toast({
                title: "Authentication required",
                description: "Please login to create posts.",
                variant: "destructive",
              });
              return;
            }
            setModalOpen(true);
          }}
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
