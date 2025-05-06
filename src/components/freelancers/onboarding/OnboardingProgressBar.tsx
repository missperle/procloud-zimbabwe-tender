
import { Step } from "@/hooks/useFreelancerOnboarding";
import { Progress } from "@/components/ui/progress";

interface OnboardingProgressBarProps {
  currentStep: number;
  totalSteps?: number;
}

const OnboardingProgressBar = ({ 
  currentStep,
  totalSteps = 7 
}: OnboardingProgressBarProps) => {
  // Calculate progress percentage
  const progress = (currentStep / totalSteps) * 100;
  
  return (
    <div className="mb-8">
      <Progress value={progress} className="h-2" />
      <div className="mt-2 text-sm text-gray-500 text-right">
        Step {currentStep} of {totalSteps}
      </div>
    </div>
  );
};

export default OnboardingProgressBar;
