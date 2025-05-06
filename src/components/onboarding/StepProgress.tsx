
import { StepIndicator } from "./StepIndicator";
import { StepConnector } from "./StepConnector";

export interface Step {
  id: number;
  name: string;
}

interface StepProgressProps {
  steps: Step[];
  currentStep: number;
}

const StepProgress = ({ steps, currentStep }: StepProgressProps) => {
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center">
        {steps.map((step) => (
          <StepIndicator 
            key={step.id}
            step={step.id}
            currentStep={currentStep}
            label={step.name}
          />
        ))}
      </div>
      
      <div className="relative flex items-center justify-between mt-2 mb-6">
        {steps.slice(0, -1).map((_, index) => (
          <StepConnector 
            key={index} 
            isCompleted={index + 1 < currentStep}
          />
        ))}
      </div>
    </div>
  );
};

export default StepProgress;
