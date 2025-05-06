
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import OnboardingProgressBar from "./onboarding/OnboardingProgressBar";
import BasicInfoForm, { StepOneFormValues, stepOneSchema } from "./onboarding/BasicInfoForm";
import DetailsForm, { StepTwoFormValues, stepTwoSchema } from "./onboarding/DetailsForm";
import StepNavigation from "@/components/onboarding/StepNavigation";

const FreelancerOnboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const stepOneForm = useForm<StepOneFormValues>({
    resolver: zodResolver(stepOneSchema),
    defaultValues: {
      title: "",
      bio: "",
      hourlyRate: "",
    },
  });

  const stepTwoForm = useForm<StepTwoFormValues>({
    resolver: zodResolver(stepTwoSchema),
    defaultValues: {
      location: "",
      yearsExperience: "",
    },
  });

  const handleStepOneSubmit = (data: StepOneFormValues) => {
    setCurrentStep(2);
  };

  const handleStepTwoSubmit = async (data: StepTwoFormValues) => {
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

  const handleNext = () => {
    stepOneForm.handleSubmit(handleStepOneSubmit)();
  };

  const handlePrevious = () => {
    setCurrentStep(1);
  };

  const handleComplete = () => {
    stepTwoForm.handleSubmit(handleStepTwoSubmit)();
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Set Up Your Freelancer Profile</CardTitle>
        <CardDescription>
          Complete your profile to start receiving job opportunities
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <OnboardingProgressBar currentStep={currentStep} />
        
        {currentStep === 1 && (
          <BasicInfoForm 
            form={stepOneForm} 
            onSubmit={handleStepOneSubmit} 
          />
        )}
        
        {currentStep === 2 && (
          <DetailsForm 
            form={stepTwoForm} 
            onSubmit={handleStepTwoSubmit}
            onBack={() => setCurrentStep(1)}
            isLoading={isLoading}
          />
        )}
        
        <StepNavigation 
          currentStep={currentStep}
          totalSteps={2}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onComplete={handleComplete}
          isLoading={isLoading}
          showBackButton={false}
        />
      </CardContent>
    </Card>
  );
};

export default FreelancerOnboarding;
