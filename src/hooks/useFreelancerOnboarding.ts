
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UseFormReturn } from "react-hook-form";
import { StepOneFormValues } from "@/components/freelancers/onboarding/BasicInfoForm";
import { StepTwoFormValues } from "@/components/freelancers/onboarding/DetailsForm";

export interface Step {
  id: number;
  name: string;
}

export function useFreelancerOnboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const steps: Step[] = [
    { id: 1, name: 'Basic Info' },
    { id: 2, name: 'Details' }
  ];

  const handleStepOneSubmit = (data: StepOneFormValues) => {
    setCurrentStep(2);
  };

  const handleStepTwoSubmit = async (
    stepOneForm: UseFormReturn<StepOneFormValues>,
    data: StepTwoFormValues
  ) => {
    if (!currentUser) return;
    
    setIsLoading(true);
    
    try {
      // Update freelancer profile
      const { error } = await supabase
        .from('freelancer_profiles')
        .upsert({
          id: currentUser.id,
          title: stepOneForm.getValues().title,
          bio: stepOneForm.getValues().bio,
          hourly_rate: parseFloat(stepOneForm.getValues().hourlyRate),
          location: data.location,
          years_experience: parseInt(data.yearsExperience),
        });
        
      if (error) throw error;
      
      // Update onboarding status
      const { error: updateError } = await supabase
        .from('users')
        .update({ onboarding_completed: true })
        .eq('id', currentUser.id);
        
      if (updateError) throw updateError;
      
      toast({
        title: "Profile Updated",
        description: "Your freelancer profile has been created successfully.",
      });
      
      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "There was a problem updating your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = (stepOneForm: UseFormReturn<StepOneFormValues>) => {
    stepOneForm.handleSubmit(handleStepOneSubmit)();
  };

  const handlePrevious = () => {
    setCurrentStep(1);
  };

  const handleComplete = (
    stepOneForm: UseFormReturn<StepOneFormValues>,
    stepTwoForm: UseFormReturn<StepTwoFormValues>
  ) => {
    stepTwoForm.handleSubmit((data) => handleStepTwoSubmit(stepOneForm, data))();
  };

  return {
    currentStep,
    isLoading,
    steps,
    handleNext,
    handlePrevious,
    handleComplete,
    handleStepOneSubmit,
    handleStepTwoSubmit
  };
}
