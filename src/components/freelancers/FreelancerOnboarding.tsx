
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFreelancerOnboarding } from "@/hooks/useFreelancerOnboarding";
import FreelancerOnboardingLayout from "./onboarding/FreelancerOnboardingLayout";
import FreelancerOnboardingStepRenderer from "./onboarding/FreelancerOnboardingStepRenderer";
import { StepOneFormValues, stepOneSchema } from "./onboarding/BasicInfoForm";
import { StepTwoFormValues, stepTwoSchema } from "./onboarding/DetailsForm";

const FreelancerOnboarding = () => {
  const {
    currentStep,
    isLoading,
    steps,
    handleNext,
    handlePrevious,
    handleComplete,
    handleStepOneSubmit,
    handleStepTwoSubmit
  } = useFreelancerOnboarding();

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

  return (
    <FreelancerOnboardingLayout
      title="Set Up Your Freelancer Profile"
      description="Complete your profile to start receiving job opportunities"
      currentStep={currentStep}
      steps={steps}
      isLoading={isLoading}
      onPrevious={handlePrevious}
      onNext={() => handleNext(stepOneForm)}
      onComplete={() => handleComplete(stepOneForm, stepTwoForm)}
    >
      <FreelancerOnboardingStepRenderer
        currentStep={currentStep}
        stepOneForm={stepOneForm}
        stepTwoForm={stepTwoForm}
        onStepOneSubmit={handleStepOneSubmit}
        onStepTwoSubmit={(data) => handleStepTwoSubmit(stepOneForm, data)}
        onBack={handlePrevious}
        isLoading={isLoading}
      />
    </FreelancerOnboardingLayout>
  );
};

export default FreelancerOnboarding;
