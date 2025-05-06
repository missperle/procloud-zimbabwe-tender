
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Check, File, X } from 'lucide-react';

export interface UploadedDocument {
  id: string;
  name: string;
  type: DocumentType;
  path: string;
  size: number;
  status: 'uploading' | 'success' | 'error' | 'pending';
}

export type DocumentType = 'registration' | 'tax' | 'id' | 'other';

interface DocumentItemProps {
  document: UploadedDocument;
  onRemove: (doc: UploadedDocument) => void;
}

export const getDocumentTypeLabel = (type: DocumentType) => {
  switch (type) {
    case 'registration': return 'Business Registration';
    case 'tax': return 'Tax Certificate';
    case 'id': return 'ID Document';
    case 'other': return 'Other Document';
  }
};

export const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' bytes';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  else return (bytes / 1048576).toFixed(1) + ' MB';
};

const DocumentItem = ({ document, onRemove }: DocumentItemProps) => {
  return (
    <Card className="p-4 relative">
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <div className="flex items-center">
            <File className="h-5 w-5 mr-2 text-procloud-green" />
            <span className="font-medium">{document.name}</span>
          </div>
          <div className="text-sm text-gray-500 mt-1">
            <span className="mr-4">{getDocumentTypeLabel(document.type)}</span>
            <span>{formatFileSize(document.size)}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {document.status === 'success' && (
            <span className="flex items-center text-green-600 text-sm">
              <Check size={16} className="mr-1" />
              Uploaded
            </span>
          )}
          
          {document.status === 'error' && (
            <span className="flex items-center text-red-600 text-sm">
              <AlertCircle size={16} className="mr-1" />
              Failed
            </span>
          )}
          
          {document.status === 'uploading' && (
            <div className="h-5 w-5 border-t-2 border-b-2 border-procloud-green rounded-full animate-spin"></div>
          )}
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onRemove(document)}
            disabled={document.status === 'uploading'}
            className="h-8 w-8 p-0"
          >
            <X size={16} />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default DocumentItem;
