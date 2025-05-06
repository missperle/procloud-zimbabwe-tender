import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Upload, File, X, Check, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface DocumentUploadStepProps {
  formData: any;
  updateFormData: (data: any) => void;
  userId: string | undefined;
}

type DocumentType = 'registration' | 'tax' | 'id' | 'other';

interface UploadedDocument {
  id: string;
  name: string;
  type: DocumentType;
  path: string;
  size: number;
  status: 'uploading' | 'success' | 'error' | 'pending';
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
      const { error: uploadError, data } = await supabase.storage
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

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };
  
  const getDocumentTypeLabel = (type: DocumentType) => {
    switch (type) {
      case 'registration': return 'Business Registration';
      case 'tax': return 'Tax Certificate';
      case 'id': return 'ID Document';
      case 'other': return 'Other Document';
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
              onChange={handleFileChange}
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
      
      <div className="space-y-4 mt-6">
        <h4 className="font-medium">Uploaded Documents</h4>
        
        {documents.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed rounded-md">
            <File className="mx-auto h-10 w-10 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">No documents uploaded yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {documents.map((doc) => (
              <Card key={doc.id} className="p-4 relative">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <File className="h-5 w-5 mr-2 text-procloud-green" />
                      <span className="font-medium">{doc.name}</span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      <span className="mr-4">{getDocumentTypeLabel(doc.type)}</span>
                      <span>{formatFileSize(doc.size)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {doc.status === 'success' && (
                      <span className="flex items-center text-green-600 text-sm">
                        <Check size={16} className="mr-1" />
                        Uploaded
                      </span>
                    )}
                    
                    {doc.status === 'error' && (
                      <span className="flex items-center text-red-600 text-sm">
                        <AlertCircle size={16} className="mr-1" />
                        Failed
                      </span>
                    )}
                    
                    {doc.status === 'uploading' && (
                      <div className="h-5 w-5 border-t-2 border-b-2 border-procloud-green rounded-full animate-spin"></div>
                    )}
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeDocument(doc)}
                      disabled={doc.status === 'uploading'}
                      className="h-8 w-8 p-0"
                    >
                      <X size={16} />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-blue-500" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Document Requirements</h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Business registration documents must be valid and up-to-date</li>
                <li>Tax certificates should be from the current fiscal year</li>
                <li>ID documents must be government-issued and not expired</li>
                <li>All documents should be in PDF, JPG, or PNG format</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentUploadStep;
