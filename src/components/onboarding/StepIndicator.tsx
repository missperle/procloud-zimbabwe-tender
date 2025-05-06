
import { Check } from "lucide-react";

interface StepIndicatorProps {
  step: number;
  currentStep: number;
  label: string;
}

export const StepIndicator = ({ step, currentStep, label }: StepIndicatorProps) => {
  const isCompleted = step < currentStep;
  const isActive = step === currentStep;
  
  return (
    <div className="flex flex-col items-center">
      <div className={`
        flex items-center justify-center w-10 h-10 rounded-full
        ${isCompleted ? 'bg-green-500 text-white' : isActive ? 'bg-procloud-green text-white' : 'bg-gray-200 text-gray-500'}
        transition-all duration-300
      `}>
        {isCompleted ? (
          <Check className="w-5 h-5" />
        ) : (
          <span>{step}</span>
        )}
      </div>
      
      <span className={`text-xs mt-2 ${isActive ? 'font-medium text-procloud-green' : 'text-gray-500'}`}>
        {label}
      </span>
    </div>
  );
};
