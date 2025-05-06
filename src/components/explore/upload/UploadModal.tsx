
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import UploadDropzone from './UploadDropzone';
import UploadForm from './UploadForm';
import { useStorage } from './useStorage';

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
  const [isFileTypeVideo, setIsFileTypeVideo] = useState(false);
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const { uploadToStorage, isUploading, setIsUploading } = useStorage();

  const handleFileSelection = (file: File) => {
    setSelectedFile(file);
    
    // Check if file is video
    const isVideo = file.type.startsWith('video/');
    setIsFileTypeVideo(isVideo);
    
    // Create and set preview URL
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
  };

  // Reset preview and selected file
  const resetPreview = () => {
    setSelectedFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setIsFileTypeVideo(false);
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
      const fileUrl = currentUser ? await uploadToStorage(selectedFile, currentUser.id) : null;
      if (!fileUrl) {
        setIsUploading(false);
        return;
      }
      
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
      resetPreview();
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
          <UploadDropzone onFileSelect={handleFileSelection} />
        ) : (
          <UploadForm
            preview={preview}
            caption={caption}
            setCaption={setCaption}
            selectedCategories={selectedCategories}
            handleCategoryChange={handleCategoryChange}
            handleSubmit={handleSubmit}
            isUploading={isUploading}
            onResetPreview={resetPreview}
            isFileTypeVideo={isFileTypeVideo}
            categories={categories}
          />
        )}
      </div>
    </div>
  );
};

export default UploadModal;
