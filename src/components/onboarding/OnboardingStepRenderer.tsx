
import { ReactNode } from 'react';
import BasicInfoStep from './steps/BasicInfoStep';
import CompanyDetailsStep from './steps/CompanyDetailsStep';
import DocumentUploadStep from './steps/DocumentUploadStep';
import SubscriptionStep from './steps/SubscriptionStep';
import FinalStep from './steps/FinalStep';
import { useAuth } from '@/contexts/AuthContext';
import { OnboardingFormData } from '@/hooks/useOnboardingWizard';

interface OnboardingStepRendererProps {
  currentStep: number;
  formData: OnboardingFormData;
  updateFormData: (data: any) => void;
}

const OnboardingStepRenderer = ({ 
  currentStep, 
  formData, 
  updateFormData 
}: OnboardingStepRendererProps): ReactNode => {
  const { currentUser } = useAuth();

  switch (currentStep) {
    case 1:
      return <BasicInfoStep formData={formData} updateFormData={updateFormData} />;
    case 2:
      return <CompanyDetailsStep formData={formData} updateFormData={updateFormData} />;
    case 3:
      return <DocumentUploadStep formData={formData} updateFormData={updateFormData} userId={currentUser?.id} />;
    case 4:
      return <SubscriptionStep formData={formData} updateFormData={updateFormData} />;
    case 5:
      return <FinalStep />;
    default:
      return <BasicInfoStep formData={formData} updateFormData={updateFormData} />;
  }
};

export default OnboardingStepRenderer;
