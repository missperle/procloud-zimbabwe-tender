
import { useState } from 'react';
import { File, Trash2, Check, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type DocumentType = 'registration' | 'tax' | 'id' | 'other';

export interface UploadedDocument {
  id: string;
  name: string;
  type: DocumentType;
  path: string;
  size: number;
  status: 'uploading' | 'success' | 'error';
}

interface DocumentItemProps {
  document: UploadedDocument;
  onRemove: (doc: UploadedDocument) => void;
}

const DocumentItem = ({ document, onRemove }: DocumentItemProps) => {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      await onRemove(document);
    } catch (error) {
      console.error('Error removing document:', error);
    } finally {
      setIsRemoving(false);
    }
  };

  // Function to format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} bytes`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Get document type label
  const getDocTypeLabel = (type: DocumentType): string => {
    switch (type) {
      case 'registration':
        return 'Business Registration';
      case 'tax':
        return 'Tax Certificate';
      case 'id':
        return 'ID Document';
      case 'other':
        return 'Other Document';
    }
  };

  // Get status icon
  const StatusIcon = () => {
    switch (document.status) {
      case 'uploading':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case 'success':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'error':
        return <X className="h-4 w-4 text-red-500" />;
    }
  };

  return (
    <div className="flex items-center justify-between border rounded-md p-4 bg-white">
      <div className="flex items-center">
        <div className="p-2 bg-blue-50 rounded-md">
          <File className="h-6 w-6 text-blue-500" />
        </div>
        <div className="ml-4">
          <h4 className="text-sm font-medium text-gray-900">{document.name}</h4>
          <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
            <span>{formatFileSize(document.size)}</span>
            <span>{getDocTypeLabel(document.type)}</span>
            <span className="flex items-center">
              <StatusIcon />
              <span className="ml-1">
                {document.status === 'uploading'
                  ? 'Uploading...'
                  : document.status === 'success'
                  ? 'Uploaded'
                  : 'Upload failed'}
              </span>
            </span>
          </div>
        </div>
      </div>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleRemove}
        disabled={isRemoving || document.status === 'uploading'}
        className="text-gray-400 hover:text-red-500"
      >
        {isRemoving ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Trash2 className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};

export default DocumentItem;
