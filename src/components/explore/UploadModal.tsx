
import React, { useState, useRef } from 'react';
import { X, Upload, Image, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isFileTypeVideo, setIsFileTypeVideo] = useState(false);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Check if file is video
      setIsFileTypeVideo(file.type.startsWith('video/'));
      
      // Create and set preview URL
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      
      // Clean up previous object URL to avoid memory leaks
      return () => URL.revokeObjectURL(objectUrl);
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

  // Handle form submission
  const handleSubmit = () => {
    if (!selectedFile) return;
    
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('caption', caption);
    formData.append('categories', JSON.stringify(selectedCategories));
    
    onSubmit(formData);
    
    // Reset form
    setSelectedFile(null);
    setPreview(null);
    setCaption('');
    setSelectedCategories(['All']);
    onClose();
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
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <div 
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`px-3 py-1 rounded-full text-sm cursor-pointer transition-colors ${
                      selectedCategories.includes(category)
                        ? 'bg-accent text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
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
              >
                Post
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadModal;
