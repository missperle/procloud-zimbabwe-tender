
import React, { useState, useRef } from 'react';
import { X, Upload, Image, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from 'lucide-react';

type UploadModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
  categories: string[];
};

const UploadModal = ({ isOpen, onClose, onSubmit, categories }: UploadModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['All']);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isFileTypeVideo, setIsFileTypeVideo] = useState(false);
  const { toast } = useToast();
  const { currentUser } = useAuth();

  // Handle file selection - Fix the cleanup function
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Check if file is video
      const isVideo = file.type.startsWith('video/');
      setIsFileTypeVideo(isVideo);
      
      // Create and set preview URL
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    }
  };

  // Handle drag and drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      
      // Check if file is video
      setIsFileTypeVideo(file.type.startsWith('video/'));
      
      // Create and set preview URL
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    }
  };

  // Prevent default behavior during drag events
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Upload file to Supabase storage
  const uploadToStorage = async (file: File): Promise<string | null> => {
    if (!currentUser) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to upload files.",
        variant: "destructive"
      });
      return null;
    }
    
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${currentUser.id}/${uuidv4()}.${fileExt}`;
      
      const { error } = await supabase.storage
        .from('explore_posts')
        .upload(filePath, file);
        
      if (error) throw error;
      
      // Get public URL
      const { data } = supabase.storage
        .from('explore_posts')
        .getPublicUrl(filePath);
        
      return data.publicUrl;
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Upload Failed",
        description: "There was a problem uploading your file.",
        variant: "destructive"
      });
      return null;
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select an image or video to upload.",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Upload file to Supabase storage
      const fileUrl = await uploadToStorage(selectedFile);
      if (!fileUrl) return;
      
      // Create FormData object
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('caption', caption);
      formData.append('categories', JSON.stringify(selectedCategories));
      formData.append('fileUrl', fileUrl);
      formData.append('fileType', isFileTypeVideo ? 'video' : 'image');
      
      // Submit the form
      onSubmit(formData);
      
      // Reset form
      setSelectedFile(null);
      setPreview(null);
      setCaption('');
      setSelectedCategories(['All']);
      setIsUploading(false);
      onClose();
      
      toast({
        title: "Upload Successful",
        description: "Your post has been created successfully!",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Upload Failed",
        description: "There was a problem creating your post.",
        variant: "destructive"
      });
      setIsUploading(false);
    }
  };

  // Handle category selection
  const handleCategoryChange = (category: string) => {
    if (category === 'All') {
      setSelectedCategories(['All']);
      return;
    }
    
    setSelectedCategories(prev => {
      // If All was previously selected, remove it
      const newSelection = prev.includes('All') ? [] : [...prev];
      
      // Toggle the selected category
      if (newSelection.includes(category)) {
        const filtered = newSelection.filter(c => c !== category);
        // If nothing is selected after filtering, default to 'All'
        return filtered.length === 0 ? ['All'] : filtered;
      } else {
        return [...newSelection, category];
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold">Create New Post</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        
        {!preview ? (
          <div 
            className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-gray-300 rounded-md m-4 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <Upload size={48} className="text-gray-400 mb-4" />
            <p className="text-gray-500 mb-2">Drag photos and videos here</p>
            <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
              Select from computer
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*,video/*"
              className="hidden"
            />
          </div>
        ) : (
          <div className="p-4">
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
                onClick={() => {
                  setSelectedFile(null);
                  setPreview(null);
                  setIsFileTypeVideo(false);
                  // Revoke object URL to avoid memory leaks
                  if (preview) URL.revokeObjectURL(preview);
                }}
              >
                <X size={16} />
              </button>
            </div>
            
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
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <div 
                    key={category}
                    onClick={() => !isUploading && handleCategoryChange(category)}
                    className={`px-3 py-1 rounded-full text-sm cursor-pointer transition-colors ${
                      selectedCategories.includes(category)
                        ? 'bg-accent text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {category}
                  </div>
                ))}
              </div>
            </div>
            
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
        )}
      </div>
    </div>
  );
};

export default UploadModal;
