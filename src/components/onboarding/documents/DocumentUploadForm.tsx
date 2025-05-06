
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';
import { DocumentType } from './DocumentItem';

interface DocumentUploadFormProps {
  selectedType: DocumentType;
  setSelectedType: (type: DocumentType) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploading: boolean;
}

const DocumentUploadForm = ({ 
  selectedType, 
  setSelectedType, 
  onFileChange, 
  uploading 
}: DocumentUploadFormProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
      <div className="flex-1">
        <Label htmlFor="documentType">Document Type</Label>
        <select
          id="documentType"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 mt-1"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as DocumentType)}
        >
          <option value="registration">Business Registration Document</option>
          <option value="tax">Tax Certificate</option>
          <option value="id">ID Document</option>
          <option value="other">Other Document</option>
        </select>
      </div>
      
      <div className="flex-1">
        <Label htmlFor="file">Select File</Label>
        <div className="relative mt-1">
          <Input
            id="file"
            type="file"
            onChange={onFileChange}
            disabled={uploading}
            className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
          />
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2 h-10"
            disabled={uploading}
          >
            <Upload size={16} />
            {uploading ? 'Uploading...' : 'Choose File'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DocumentUploadForm;
