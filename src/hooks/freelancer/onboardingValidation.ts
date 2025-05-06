
import { FreelancerOnboardingFormData } from "@/types/freelancerOnboarding";
import { toast } from "@/hooks/use-toast";

export const validateStep = (step: number, formData: FreelancerOnboardingFormData): boolean => {
  switch (step) {
    case 1: // Basic Profile
      if (!formData.title || !formData.bio) {
        toast({
          title: "Required Fields Missing",
          description: "Please provide a professional title and bio.",
          variant: "destructive",
        });
        return false;
      }
      return true;
      
    case 2: // Skills & Services
      if (formData.skills.length === 0) {
        toast({
          title: "Required Fields Missing",
          description: "Please select at least one skill.",
          variant: "destructive",
        });
        return false;
      }
      return true;
    
    case 3: // Portfolio
      if (formData.portfolioItems.length === 0) {
        toast({
          title: "Required Fields Missing",
          description: "Please add at least one portfolio item.",
          variant: "destructive",
        });
        return false;
      }
      return true;
      
    case 4: // Rates & Availability
      if (formData.hourlyRate <= 0) {
        toast({
          title: "Required Fields Missing",
          description: "Please set your hourly rate.",
          variant: "destructive",
        });
        return false;
      }
      return true;
      
    case 5: // Identity & Payment
      // Payment method is required, but identity documents might be optional
      if (!formData.paymentMethod) {
        toast({
          title: "Required Fields Missing",
          description: "Please set up a payment method.",
          variant: "destructive",
        });
        return false;
      }
      return true;
      
    case 6: // Terms & Agreements
      if (!formData.termsAccepted || !formData.privacyPolicyAccepted) {
        toast({
          title: "Required Fields Missing",
          description: "You must accept the Terms of Service and Privacy Policy to continue.",
          variant: "destructive",
        });
        return false;
      }
      return true;
      
    case 7: // Optional Settings
      // This step is optional, so always return true
      return true;
      
    default:
      return true;
  }
};
