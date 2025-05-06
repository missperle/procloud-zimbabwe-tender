
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { OnboardingFormData, Step, DEFAULT_ONBOARDING_STEPS, DEFAULT_FORM_DATA } from '@/types/onboarding';
import { 
  loadOnboardingStep, 
  updateOnboardingStep, 
  completeOnboarding, 
  saveClientData 
} from './onboarding/onboardingDbOperations';
import { validateStep } from './onboarding/onboardingValidation';

export type { OnboardingFormData, Step } from '@/types/onboarding';

export function useOnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingFormData>(DEFAULT_FORM_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { currentUser, refreshUserStatus } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const steps: Step[] = DEFAULT_ONBOARDING_STEPS;

  // Load the current onboarding step from database when component mounts
  useEffect(() => {
    const fetchOnboardingStep = async () => {
      const step = await loadOnboardingStep(currentUser?.id);
      setCurrentStep(step);
    };
    
    fetchOnboardingStep();
  }, [currentUser]);

  const updateFormData = (stepData: Partial<OnboardingFormData>) => {
    setFormData(prevData => ({ ...prevData, ...stepData }));
  };

  const handleNext = async () => {
    setError(null);
    
    // Validate current step
    if (!validateStep(currentStep, formData)) {
      return;
    }

    // For subscription step, save all data before proceeding
    if (currentStep === 4) {
      setIsLoading(true);
      const success = await saveClientData(currentUser?.id, formData);
      setIsLoading(false);
      if (!success) return;
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
        const success = await completeOnboarding(currentUser.id);
        
        if (success) {
          // Refresh user status to update the user context
          await refreshUserStatus();
          
          navigate('/client-dashboard');
          toast({
            title: "Onboarding Completed!",
            description: "Welcome to proCloud. Your account is ready to use.",
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
