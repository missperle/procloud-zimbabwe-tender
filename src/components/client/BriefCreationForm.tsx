
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Info } from "lucide-react";
import { useBriefs } from "@/hooks/useBriefs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import BriefFormFields from "./brief/BriefFormFields";
import BudgetEstimator from "./brief/BudgetEstimator";
import AIImageGenerator from "./brief/AIImageGenerator";

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
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const { submitBrief, loading: submittingBrief } = useBriefs();
  
  const { register, handleSubmit, reset, setValue, watch } = useForm<BriefFormData>();

  const title = watch("title");
  const description = watch("original_description");

  const handleSelectImage = (url: string) => {
    setSelectedImageUrl(url);
    setValue("attachment_url", url);
  };

  const handleEstimateGenerated = (budget: string, timeline: string) => {
    // Update the budget field with the suggestion
    setValue("budget", budget);
  };

  const handleFormSubmit = async (data: BriefFormData) => {
    const result = await submitBrief(data);
    if (result) {
      onSubmit(data);
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
        <BriefFormFields register={register} watch={watch} />
        
        <BudgetEstimator 
          title={title} 
          description={description} 
          onEstimateGenerated={handleEstimateGenerated} 
        />
        
        <AIImageGenerator 
          onSelectImage={handleSelectImage}
          selectedImageUrl={selectedImageUrl}
        />
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
