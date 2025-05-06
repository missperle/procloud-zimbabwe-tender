
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onComplete?: () => void;
  isLoading?: boolean;
  nextLabel?: string;
  completeLabel?: string;
  showBackButton?: boolean;
}

const StepNavigation = ({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onComplete,
  isLoading = false,
  nextLabel = "Next",
  completeLabel = "Complete",
  showBackButton = true,
}: StepNavigationProps) => {
  const isLastStep = currentStep >= totalSteps;

  return (
    <div className="flex justify-between mt-8">
      {currentStep > 1 && showBackButton ? (
        <Button 
          variant="outline" 
          onClick={onPrevious}
          className="flex items-center gap-2"
          disabled={isLoading}
        >
          <ArrowLeft size={16} />
          Previous
        </Button>
      ) : (
        <div />
      )}
      
      {isLastStep ? (
        <Button 
          onClick={onComplete}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
          disabled={isLoading}
        >
          {isLoading ? "Completing..." : completeLabel}
          {!isLoading && <Check size={16} />}
        </Button>
      ) : (
        <Button 
          onClick={onNext}
          className="flex items-center gap-2"
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : nextLabel}
          {!isLoading && <ArrowRight size={16} />}
        </Button>
      )}
    </div>
  );
};

export default StepNavigation;
