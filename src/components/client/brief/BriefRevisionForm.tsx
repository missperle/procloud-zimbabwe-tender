
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BriefFormData } from "../BriefCreationForm";
import BriefFormFields from "./BriefFormFields";
import { Separator } from "@/components/ui/separator";
import { useBriefs } from "@/hooks/useBriefs";

interface BriefRevisionFormProps {
  briefId: string;
  initialData: BriefFormData;
  feedback: {
    message: string;
    createdAt: Date;
    fromAdmin: string;
  }[];
  onSubmit: (data: BriefFormData) => void;
  onCancel: () => void;
}

const BriefRevisionForm: React.FC<BriefRevisionFormProps> = ({
  briefId,
  initialData,
  feedback,
  onSubmit,
  onCancel
}) => {
  const { register, handleSubmit, watch, setValue } = useForm<BriefFormData>({
    defaultValues: initialData
  });
  const { loading: submittingBrief } = useBriefs();
  
  const handleFormSubmit = async (data: BriefFormData) => {
    onSubmit(data);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Cancel changes
        </Button>
        
        <h2 className="text-xl font-semibold">Revise Brief</h2>
      </div>
      
      <Alert className="bg-orange-50 border-orange-200">
        <Info className="h-5 w-5 text-orange-600" />
        <AlertDescription className="text-orange-600">
          Proverb Digital has requested changes to your brief. Please review the feedback below and make the necessary revisions.
        </AlertDescription>
      </Alert>
      
      {/* Feedback section */}
      <div className="bg-orange-50 p-4 rounded-md border border-orange-200">
        <h3 className="font-medium mb-2 text-orange-800">Feedback from Proverb Digital:</h3>
        <div className="space-y-3">
          {feedback.map((item, index) => (
            <div key={index} className="bg-white p-3 rounded-md border border-orange-100">
              <div className="flex justify-between mb-1">
                <span className="font-medium">{item.fromAdmin}</span>
                <span className="text-xs text-gray-500">
                  {new Date(item.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="text-sm">{item.message}</p>
            </div>
          ))}
        </div>
      </div>
      
      <Separator />
      
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="grid gap-4 py-4">
          <BriefFormFields register={register} watch={watch} setValue={setValue} />
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={submittingBrief}>
            {submittingBrief ? "Submitting..." : "Submit Revised Brief"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BriefRevisionForm;
