
import { Check } from "lucide-react";

interface OnboardingProgressBarProps {
  currentStep: number;
}

const OnboardingProgressBar = ({ currentStep }: OnboardingProgressBarProps) => {
  return (
    <div className="flex justify-between mb-8">
      <div className="flex flex-col items-center">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
          currentStep >= 1 ? "bg-procloud-green border-procloud-green text-white" : "border-gray-300"
        }`}>
          {currentStep > 1 ? <Check className="h-5 w-5" /> : "1"}
        </div>
        <span className="text-xs mt-1">Basic Info</span>
      </div>
      
      <div className="flex-1 flex items-center justify-center">
        <div className={`h-0.5 w-full ${currentStep > 1 ? "bg-procloud-green" : "bg-gray-200"}`}></div>
      </div>
      
      <div className="flex flex-col items-center">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
          currentStep >= 2 ? "bg-procloud-green border-procloud-green text-white" : "border-gray-300"
        }`}>
          {currentStep > 2 ? <Check className="h-5 w-5" /> : "2"}
        </div>
        <span className="text-xs mt-1">Details</span>
      </div>
    </div>
  );
};

export default OnboardingProgressBar;
