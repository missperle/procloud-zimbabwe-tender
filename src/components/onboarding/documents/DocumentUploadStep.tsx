
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import DocumentUploadForm from '../documents/DocumentUploadForm';
import DocumentsList from '../documents/DocumentsList';
import DocumentRequirements from '../documents/DocumentRequirements';
import { DocumentType, UploadedDocument } from '../documents/DocumentItem';

interface DocumentUploadStepProps {
  formData: any;
  updateFormData: (data: any) => void;
  userId: string | undefined;
}

const DocumentUploadStep = ({ formData, updateFormData, userId }: DocumentUploadStepProps) => {
  const [documents, setDocuments] = useState<UploadedDocument[]>(formData.documents || []);
  const [uploading, setUploading] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState<DocumentType>('registration');
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !userId) {
      toast({
        title: "Error",
        description: "No file selected or user not logged in",
        variant: "destructive",
      });
      return;
    }

    const file = e.target.files[0];
    const fileId = crypto.randomUUID();
    const fileName = file.name;
    const fileSize = file.size;
    
    // Add file to local state with 'uploading' status
    const newDoc: UploadedDocument = {
      id: fileId,
      name: fileName,
      type: selectedType,
      path: '',
      size: fileSize,
      status: 'uploading'
    };
    
    const updatedDocuments = [...documents, newDoc];
    setDocuments(updatedDocuments);
    updateFormData({ documents: updatedDocuments });
    
    setUploading(true);
    
    try {
      // Upload file to Supabase Storage
      const filePath = `${userId}/${selectedType}/${fileId}-${fileName}`;
      const { error: uploadError } = await supabase.storage
        .from('client_documents')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // Add record to user_documents table
      const { error: dbError } = await supabase
        .from('user_documents')
        .insert({
          user_id: userId,
          file_name: fileName,
          file_path: filePath,
          document_type: selectedType,
          file_size: fileSize,
          status: 'pending'
        });
        
      if (dbError) throw dbError;
      
      // Update local state with successful upload
      const updatedDocs = documents.map(doc => 
        doc.id === fileId 
          ? { ...doc, status: 'success' as const, path: filePath } 
          : doc
      );
      
      setDocuments(updatedDocs);
      updateFormData({ documents: updatedDocs });
      
      toast({
        title: "File Uploaded",
        description: "Your document has been uploaded and will be reviewed.",
      });
    } catch (error) {
      console.error('Error uploading document:', error);
      
      // Update local state with error status
      const updatedDocs = documents.map(doc => 
        doc.id === fileId 
          ? { ...doc, status: 'error' as const } 
          : doc
      );
      
      setDocuments(updatedDocs);
      updateFormData({ documents: updatedDocs });
      
      toast({
        title: "Upload Failed",
        description: "There was a problem uploading your document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      e.target.value = ''; // Reset file input
    }
  };
  
  const removeDocument = async (doc: UploadedDocument) => {
    if (!userId || !doc.path) return;
    
    try {
      // Delete from Supabase Storage
      if (doc.status === 'success') {
        const { error: deleteError } = await supabase.storage
          .from('client_documents')
          .remove([doc.path]);
          
        if (deleteError) throw deleteError;
        
        // Delete from user_documents table
        const { error: dbError } = await supabase
          .from('user_documents')
          .delete()
          .eq('file_path', doc.path);
          
        if (dbError) throw dbError;
      }
      
      // Update local state
      const updatedDocuments = documents.filter(d => d.id !== doc.id);
      setDocuments(updatedDocuments);
      updateFormData({ documents: updatedDocuments });
      
      toast({
        title: "Document Removed",
        description: "The document has been removed successfully.",
      });
    } catch (error) {
      console.error('Error removing document:', error);
      toast({
        title: "Error",
        description: "Failed to remove the document. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Document Verification</h3>
        <p className="text-gray-500 mb-4">
          Upload the required documents to verify your business. All documents will be securely stored and reviewed by our team.
        </p>
      </div>
      
      <DocumentUploadForm
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        onFileChange={handleFileChange}
        uploading={uploading}
      />
      
      <div className="space-y-4 mt-6">
        <h4 className="font-medium">Uploaded Documents</h4>
        
        <DocumentsList 
          documents={documents} 
          onRemoveDocument={removeDocument} 
        />
      </div>
      
      <DocumentRequirements />
    </div>
  );
};

export default DocumentUploadStep;
