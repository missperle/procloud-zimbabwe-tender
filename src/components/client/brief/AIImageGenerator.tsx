
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Images } from "lucide-react";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getApp } from "firebase/app";
import { useToast } from "@/hooks/use-toast";

interface AIImageGeneratorProps {
  onSelectImage: (url: string) => void;
  selectedImageUrl: string;
}

const AIImageGenerator = ({ onSelectImage, selectedImageUrl }: AIImageGeneratorProps) => {
  const [aiPrompt, setAiPrompt] = useState("");
  const [generatingImages, setGeneratingImages] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const { toast } = useToast();
  
  const handleGenerateImages = async () => {
    if (!aiPrompt.trim() || aiPrompt.length < 5) {
      toast({
        title: "Invalid prompt",
        description: "Please enter a more detailed prompt (at least 5 characters)",
        variant: "destructive",
      });
      return;
    }

    setGeneratingImages(true);
    setGeneratedImages([]);

    try {
      const functions = getFunctions(getApp("proverb-digital-client"));
      const generateImages = httpsCallable(functions, 'generateImages');
      
      const result = await generateImages({ prompt: aiPrompt });
      const data = result.data as { images: string[] };
      
      setGeneratedImages(data.images);
      toast({
        title: "Images generated successfully",
        description: "Click on an image to attach it to your brief",
      });
    } catch (error) {
      console.error("Error generating images:", error);
      toast({
        title: "Image generation failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setGeneratingImages(false);
    }
  };

  return (
    <div className="col-span-4">
      <div className="border-t pt-4 mt-2">
        <h4 className="font-medium mb-2 flex items-center gap-2">
          <Images className="h-5 w-5" />
          Illustrate Your Idea
        </h4>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              id="ai-prompt"
              placeholder="Describe your vision..."
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              className="flex-grow"
            />
            <Button 
              type="button" 
              onClick={handleGenerateImages}
              disabled={generatingImages}
              variant="outline"
            >
              {generatingImages ? "Generating..." : "Generate Images"}
            </Button>
          </div>
          
          <div id="ai-gallery" className="w-full">
            {generatingImages && (
              <div className="text-center py-8 text-muted-foreground">
                Generating images...
              </div>
            )}
            
            {!generatingImages && generatedImages.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {generatedImages.map((url, index) => (
                  <div 
                    key={index} 
                    className={`relative cursor-pointer border-2 rounded-md overflow-hidden ${
                      selectedImageUrl === url ? 'border-procloud-green' : 'border-transparent'
                    }`}
                    onClick={() => onSelectImage(url)}
                  >
                    <img 
                      src={url} 
                      alt={`Generated image ${index + 1}`} 
                      className="w-full h-auto object-cover rounded-sm"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIImageGenerator;
