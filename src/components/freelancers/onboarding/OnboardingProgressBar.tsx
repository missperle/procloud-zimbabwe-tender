
import { StepIndicator } from "@/components/onboarding/StepIndicator";
import { StepConnector } from "@/components/onboarding/StepConnector";

interface OnboardingProgressBarProps {
  currentStep: number;
}

const OnboardingProgressBar = ({ currentStep }: OnboardingProgressBarProps) => {
  const steps = [
    { id: 1, name: "Basic Info" },
    { id: 2, name: "Details" }
  ];

  return (
    <div className="flex flex-col mb-8">
      <div className="flex justify-between items-center">
        {steps.map(step => (
          <StepIndicator 
            key={step.id}
            step={step.id}
            currentStep={currentStep}
            label={step.name}
          />
        ))}
      </div>
      
      <div className="flex items-center justify-center mt-2">
        <StepConnector isCompleted={currentStep > 1} />
      </div>
    </div>
  );
};

export default OnboardingProgressBar;
