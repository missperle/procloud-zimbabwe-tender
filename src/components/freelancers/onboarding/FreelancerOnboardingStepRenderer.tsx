
import { ReactNode } from "react";
import { FreelancerOnboardingFormData } from "@/hooks/useFreelancerOnboarding";
import BasicProfileStep from "./steps/BasicProfileStep";
import SkillsServiceStep from "./steps/SkillsServiceStep";
import PortfolioStep from "./steps/PortfolioStep";
import RatesAvailabilityStep from "./steps/RatesAvailabilityStep";
import IdentityPaymentStep from "./steps/IdentityPaymentStep";
import TermsAgreementsStep from "./steps/TermsAgreementsStep";
import OptionalSettingsStep from "./steps/OptionalSettingsStep";

interface FreelancerOnboardingStepRendererProps {
  currentStep: number;
  formData: FreelancerOnboardingFormData;
  updateFormData: (data: Partial<FreelancerOnboardingFormData>) => void;
  isLoading: boolean;
}

const FreelancerOnboardingStepRenderer = ({
  currentStep,
  formData,
  updateFormData,
  isLoading
}: FreelancerOnboardingStepRendererProps): ReactNode => {
  switch (currentStep) {
    case 1:
      return <BasicProfileStep formData={formData} updateFormData={updateFormData} />;
    case 2:
      return <SkillsServiceStep formData={formData} updateFormData={updateFormData} />;
    case 3:
      return <PortfolioStep formData={formData} updateFormData={updateFormData} />;
    case 4:
      return <RatesAvailabilityStep formData={formData} updateFormData={updateFormData} />;
    case 5:
      return <IdentityPaymentStep formData={formData} updateFormData={updateFormData} />;
    case 6:
      return <TermsAgreementsStep formData={formData} updateFormData={updateFormData} />;
    case 7:
      return <OptionalSettingsStep formData={formData} updateFormData={updateFormData} />;
    default:
      return <BasicProfileStep formData={formData} updateFormData={updateFormData} />;
  }
};

export default FreelancerOnboardingStepRenderer;
