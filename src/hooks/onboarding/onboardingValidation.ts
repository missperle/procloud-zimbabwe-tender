
import { OnboardingFormData } from '@/types/onboarding';
import { toast } from '@/hooks/use-toast';

export const validateStep = (step: number, formData: OnboardingFormData): boolean => {
  switch (step) {
    case 1:
      // Validate basic info
      if (!formData.companyName) {
        toast({
          title: "Required Field Missing",
          description: "Please enter your company name",
          variant: "destructive",
        });
        return false;
      }
      return true;
      
    // Add validation for other steps as needed
    default:
      return true;
  }
};
