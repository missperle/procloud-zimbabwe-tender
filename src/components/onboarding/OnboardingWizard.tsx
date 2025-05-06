
import { useOnboardingWizard } from '@/hooks/useOnboardingWizard';
import OnboardingWizardLayout from './OnboardingWizardLayout';
import OnboardingStepRenderer from './OnboardingStepRenderer';

const OnboardingWizard = () => {
  const {
    currentStep,
    formData,
    isLoading,
    error,
    steps,
    updateFormData,
    handleNext,
    handlePrevious,
    handleComplete,
  } = useOnboardingWizard();

  return (
    <OnboardingWizardLayout
      currentStep={currentStep}
      steps={steps}
      error={error}
      isLoading={isLoading}
      onPrevious={handlePrevious}
      onNext={handleNext}
      onComplete={handleComplete}
    >
      <OnboardingStepRenderer
        currentStep={currentStep}
        formData={formData}
        updateFormData={updateFormData}
      />
    </OnboardingWizardLayout>
  );
};

export default OnboardingWizard;
