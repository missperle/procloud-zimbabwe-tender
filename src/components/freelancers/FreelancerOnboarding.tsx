
import { useFreelancerOnboarding } from "@/hooks/useFreelancerOnboarding";
import FreelancerOnboardingLayout from "./onboarding/FreelancerOnboardingLayout";
import FreelancerOnboardingStepRenderer from "./onboarding/FreelancerOnboardingStepRenderer";

const FreelancerOnboarding = () => {
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
  } = useFreelancerOnboarding();

  return (
    <FreelancerOnboardingLayout
      title="Set Up Your Freelancer Profile"
      description="Complete your profile to start receiving job opportunities"
      currentStep={currentStep}
      steps={steps}
      error={error}
      isLoading={isLoading}
      onPrevious={handlePrevious}
      onNext={handleNext}
      onComplete={handleComplete}
    >
      <FreelancerOnboardingStepRenderer
        currentStep={currentStep}
        formData={formData}
        updateFormData={updateFormData}
        isLoading={isLoading}
      />
    </FreelancerOnboardingLayout>
  );
};

export default FreelancerOnboarding;
