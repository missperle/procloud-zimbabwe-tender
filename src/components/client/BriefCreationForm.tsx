
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { Images, Calendar, Loader2, Info } from "lucide-react";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getApp } from "firebase/app";
import { useToast } from "@/hooks/use-toast";
import { useBriefs } from "@/hooks/useBriefs";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Form type for new brief
export type BriefFormData = {
  title: string;
  original_description: string;
  budget: string;
  deadline: string;
  category: string;
  attachment_url?: string;
};

interface BriefCreationFormProps {
  onSubmit: (data: BriefFormData) => void;
  onClose: () => void;
}

const BriefCreationForm = ({ onSubmit, onClose }: BriefCreationFormProps) => {
  const [aiPrompt, setAiPrompt] = useState("");
  const [generatingImages, setGeneratingImages] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [estimating, setEstimating] = useState(false);
  const [budgetEstimate, setBudgetEstimate] = useState("");
  const [timelineEstimate, setTimelineEstimate] = useState("");
  const { toast } = useToast();
  const { submitBrief, loading: submittingBrief } = useBriefs();
  
  const { register, handleSubmit, reset, setValue, watch } = useForm<BriefFormData>();

  const title = watch("title");
  const description = watch("original_description");

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

  const handleSelectImage = (url: string) => {
    setSelectedImageUrl(url);
    setValue("attachment_url", url);
    toast({
      title: "Image selected",
      description: "The image has been attached to your brief",
    });
  };

  const handleEstimate = async () => {
    if (!title || !description) {
      toast({
        title: "Missing information",
        description: "Please provide both title and description for an estimate",
        variant: "destructive",
      });
      return;
    }

    setEstimating(true);
    setBudgetEstimate("");
    setTimelineEstimate("");

    try {
      const functions = getFunctions(getApp("proverb-digital-client"));
      const suggestBudgetTimeline = httpsCallable(functions, 'suggestBudgetTimeline');
      
      const result = await suggestBudgetTimeline({ title, description });
      const data = result.data as { budget: string; timeline: string };
      
      setBudgetEstimate(data.budget);
      setTimelineEstimate(data.timeline);
      
      // Automatically update the budget field with the suggestion
      setValue("budget", data.budget);
      
      toast({
        title: "Estimate generated",
        description: "Budget and timeline estimates have been added to your brief",
      });
    } catch (error) {
      console.error("Error generating estimates:", error);
      toast({
        title: "Estimation failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setEstimating(false);
    }
  };

  const handleFormSubmit = async (data: BriefFormData) => {
    const result = await submitBrief(data);
    if (result) {
      onSubmit(data);
      setAiPrompt("");
      setGeneratedImages([]);
      setSelectedImageUrl("");
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Alert className="mb-4 bg-blue-50 border-blue-200">
        <Info className="h-5 w-5 text-blue-600" />
        <AlertDescription className="text-blue-600">
          Your brief will be reviewed by Proverb Digital before being published to creators. 
          We'll protect your identity and may suggest edits to make your brief more effective.
        </AlertDescription>
      </Alert>
      
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="title" className="text-right">
            Title
          </Label>
          <Input
            id="title"
            className="col-span-3"
            {...register("title", { required: true })}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="original_description" className="text-right">
            Description
          </Label>
          <Textarea
            id="original_description"
            className="col-span-3 min-h-[80px]"
            {...register("original_description", { required: true })}
          />
        </div>
        
        {/* Budget Estimation Section */}
        <div className="col-span-4">
          <div className="border-t pt-4 mb-2 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <h4 className="font-medium">Get Estimates</h4>
            </div>
            <Button 
              type="button" 
              onClick={handleEstimate} 
              disabled={estimating || !title || !description}
              variant="outline" 
              size="sm"
            >
              {estimating ? "Estimating..." : "Suggest Budget & Timeline"}
            </Button>
          </div>
          
          {(budgetEstimate || timelineEstimate) && (
            <div className="bg-muted p-3 rounded-md mb-4 text-sm space-y-1">
              {budgetEstimate && (
                <div className="flex justify-between">
                  <span className="font-medium">Suggested Budget:</span>
                  <span>${budgetEstimate}</span>
                </div>
              )}
              {timelineEstimate && (
                <div className="flex justify-between">
                  <span className="font-medium">Estimated Timeline:</span>
                  <span>{timelineEstimate}</span>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="budget" className="text-right">
            Budget
          </Label>
          <Input
            id="budget"
            placeholder="$1000"
            className="col-span-3"
            {...register("budget", { required: true })}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="deadline" className="text-right">
            Deadline
          </Label>
          <Input
            id="deadline"
            type="date"
            className="col-span-3"
            {...register("deadline", { required: true })}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="category" className="text-right">
            Category
          </Label>
          <select
            id="category"
            className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            {...register("category", { required: true })}
          >
            <option value="design">Design</option>
            <option value="development">Development</option>
            <option value="marketing">Marketing</option>
            <option value="writing">Writing & Translation</option>
            <option value="video">Video & Animation</option>
          </select>
        </div>

        {/* AI Image Generation Section */}
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
                        onClick={() => handleSelectImage(url)}
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
              
              <input 
                type="hidden" 
                id="attachment_url" 
                {...register("attachment_url")} 
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="attachments" className="text-right">
            Attachments
          </Label>
          <Input
            id="attachments"
            type="file"
            multiple
            className="col-span-3"
          />
        </div>
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={submittingBrief}>
          {submittingBrief ? "Submitting..." : "Submit Brief for Review"}
        </Button>
      </div>
    </form>
  );
};

export default BriefCreationForm;
