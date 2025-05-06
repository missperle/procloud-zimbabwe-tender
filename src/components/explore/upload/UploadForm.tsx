
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import CategorySelector from './CategorySelector';

type UploadFormProps = {
  preview: string | null;
  caption: string;
  setCaption: (caption: string) => void;
  selectedCategories: string[];
  handleCategoryChange: (category: string) => void;
  handleSubmit: () => void;
  isUploading: boolean;
  onResetPreview: () => void;
  isFileTypeVideo: boolean;
  categories: string[];
};

const UploadForm = ({
  preview,
  caption,
  setCaption,
  selectedCategories,
  handleCategoryChange,
  handleSubmit,
  isUploading,
  onResetPreview,
  isFileTypeVideo,
  categories
}: UploadFormProps) => {
  if (!preview) return null;
  
  return (
    <div className="p-4">
      <MediaPreview 
        preview={preview} 
        isFileTypeVideo={isFileTypeVideo} 
        onReset={onResetPreview} 
      />
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Caption</label>
        <Textarea 
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Write a caption..."
          className="w-full"
          disabled={isUploading}
        />
      </div>
      
      <CategorySelector 
        categories={categories}
        selectedCategories={selectedCategories}
        handleCategoryChange={handleCategoryChange}
        isUploading={isUploading}
      />
      
      <div className="flex justify-end">
        <Button 
          onClick={handleSubmit}
          className="bg-accent hover:bg-accent/90 text-white"
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : "Post"}
        </Button>
      </div>
    </div>
  );
};

interface MediaPreviewProps {
  preview: string | null;
  isFileTypeVideo: boolean;
  onReset: () => void;
}

const MediaPreview = ({ preview, isFileTypeVideo, onReset }: MediaPreviewProps) => {
  if (!preview) return null;
  
  return (
    <div className="aspect-square bg-gray-100 rounded-md overflow-hidden mb-4 relative">
      {isFileTypeVideo ? (
        <video 
          src={preview} 
          className="w-full h-full object-cover" 
          autoPlay 
          loop 
          muted 
          controls
        />
      ) : (
        <img 
          src={preview} 
          alt="Preview" 
          className="w-full h-full object-cover" 
        />
      )}
      <button 
        className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full"
        onClick={onReset}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  );
};

export default UploadForm;
