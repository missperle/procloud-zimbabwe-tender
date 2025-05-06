
import React, { useRef } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

type UploadDropzoneProps = {
  onFileSelect: (file: File) => void;
};

const UploadDropzone = ({ onFileSelect }: UploadDropzoneProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
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
  );
};

export default UploadDropzone;
