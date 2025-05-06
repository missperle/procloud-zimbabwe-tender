
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";

export const useStorage = () => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const uploadToStorage = async (file: File, userId: string): Promise<string | null> => {
    if (!userId) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to upload files.",
        variant: "destructive"
      });
      return null;
    }
    
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/${uuidv4()}.${fileExt}`;
      
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

  return {
    uploadToStorage,
    isUploading,
    setIsUploading
  };
};
