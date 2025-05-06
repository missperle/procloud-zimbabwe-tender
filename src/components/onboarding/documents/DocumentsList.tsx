
import { File } from 'lucide-react';
import DocumentItem, { UploadedDocument } from './DocumentItem';

interface DocumentsListProps {
  documents: UploadedDocument[];
  onRemoveDocument: (doc: UploadedDocument) => void;
}

const DocumentsList = ({ documents, onRemoveDocument }: DocumentsListProps) => {
  if (documents.length === 0) {
    return (
      <div className="text-center py-8 border-2 border-dashed rounded-md">
        <File className="mx-auto h-10 w-10 text-gray-400" />
        <p className="mt-2 text-sm text-gray-500">No documents uploaded yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {documents.map((doc) => (
        <DocumentItem 
          key={doc.id} 
          document={doc} 
          onRemove={onRemoveDocument} 
        />
      ))}
    </div>
  );
};

export default DocumentsList;
