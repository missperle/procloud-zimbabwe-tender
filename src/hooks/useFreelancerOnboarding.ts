
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { 
  FreelancerOnboardingFormData, 
  Step, 
  DEFAULT_FREELANCER_ONBOARDING_STEPS,
  DEFAULT_FREELANCER_FORM_DATA
} from "@/types/freelancerOnboarding";
import { 
  loadOnboardingStep,
  updateOnboardingStep,
  saveFreelancerData,
  completeFreelancerOnboarding
} from "./freelancer/onboardingDbOperations";
import { validateStep } from "./freelancer/onboardingValidation";

export type { FreelancerOnboardingFormData, Step } from "@/types/freelancerOnboarding";

export function useFreelancerOnboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FreelancerOnboardingFormData>(DEFAULT_FREELANCER_FORM_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { currentUser, refreshUserStatus } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const steps: Step[] = DEFAULT_FREELANCER_ONBOARDING_STEPS;

  // Load the current onboarding step from database when component mounts
  useEffect(() => {
    const fetchOnboardingStep = async () => {
      if (currentUser?.id) {
        const step = await loadOnboardingStep(currentUser.id);
        setCurrentStep(step);
      }
    };
    
    fetchOnboardingStep();
  }, [currentUser]);

  const updateFormData = (stepData: Partial<FreelancerOnboardingFormData>) => {
    setFormData(prevData => ({ ...prevData, ...stepData }));
  };

  const handleNext = async () => {
    setError(null);
    
    // Validate current step
    if (!validateStep(currentStep, formData)) {
      return;
    }

    // Save data on specific steps
    if (currentStep === 3 || currentStep === 5) {
      setIsLoading(true);
      const success = await saveFreelancerData(currentUser?.id, formData);
      setIsLoading(false);
      
      if (!success) {
        setError("Failed to save data. Please try again.");
        return;
      }
    }

    if (currentStep < steps.length) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      // Update onboarding step in database
      if (currentUser) {
        await updateOnboardingStep(currentUser.id, nextStep);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (currentUser) {
        // Final data save
        await saveFreelancerData(currentUser.id, formData);
        
        const success = await completeFreelancerOnboarding(currentUser.id);
        
        if (success) {
          // Refresh user status to update the user context
          await refreshUserStatus();
          
          navigate('/dashboard');
          toast({
            title: "Onboarding Completed!",
            description: "Your freelancer profile is now live.",
          });
        } else {
          throw new Error("Failed to complete onboarding");
        }
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
      setError("Something went wrong. Please try again.");
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    currentStep,
    formData,
    isLoading,
    error,
    steps,
    updateFormData,
    handleNext,
    handlePrevious,
    handleComplete,
  };
}
