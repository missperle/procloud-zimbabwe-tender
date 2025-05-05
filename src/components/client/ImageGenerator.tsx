
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getApp } from "firebase/app";
import { useFeatureAccess } from "@/hooks/useFeatureAccess";

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const { toast } = useToast();
  const { checkAccess } = useFeatureAccess();
  
  const handleGenerateImages = async () => {
    if (!checkAccess('ai_image_generation')) {
      return; // The checkAccess function will handle redirection and toast
    }
    
    if (prompt.length < 5) {
      toast({
        title: "Invalid prompt",
        description: "Please enter a more detailed prompt (at least 5 characters)",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const functions = getFunctions(getApp("proverb-digital-client"));
      const generateImages = httpsCallable(functions, 'generateImages');
      
      const result = await generateImages({ prompt });
      const data = result.data as { images: string[] };
      
      setImages(data.images);
      toast({
        title: "Images generated successfully",
        description: "Your AI-generated images are ready to view",
      });
    } catch (error) {
      console.error("Error generating images:", error);
      toast({
        title: "Image generation failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">AI Image Generator</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Generate Images with AI</CardTitle>
          <CardDescription>
            Enter a detailed prompt to create AI-generated images
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Input
              placeholder="Describe what you want to generate..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="mb-4"
            />
            <Button 
              onClick={handleGenerateImages} 
              disabled={isLoading}
            >
              {isLoading ? "Generating..." : "Generate Images"}
            </Button>
          </div>
          
          {images.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Generated Images</h3>
              <div className="grid grid-cols-2 gap-4">
                {images.map((url, index) => (
                  <div key={index} className="relative aspect-square rounded-md overflow-hidden border">
                    <img 
                      src={url} 
                      alt={`Generated image ${index + 1}`} 
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ImageGenerator;
