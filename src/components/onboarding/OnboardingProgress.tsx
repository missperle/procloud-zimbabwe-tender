
import { Check } from 'lucide-react';

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
}

const OnboardingProgress = ({ currentStep, totalSteps }: OnboardingProgressProps) => {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const step = index + 1;
          const isCompleted = step < currentStep;
          const isActive = step === currentStep;
          
          return (
            <div key={step} className="flex flex-col items-center">
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
                {step === 1 ? 'Company Info' : 
                 step === 2 ? 'Contact Details' :
                 step === 3 ? 'Documents' :
                 step === 4 ? 'Subscription' : 'Finish'}
              </span>
            </div>
          );
        })}
      </div>
      
      <div className="relative flex items-center justify-between mt-2 mb-6">
        {Array.from({ length: totalSteps - 1 }).map((_, index) => {
          const isCompleted = index + 1 < currentStep;
          return (
            <div 
              key={index} 
              className={`flex-1 h-1 ${isCompleted ? 'bg-green-500' : 'bg-gray-200'} transition-all duration-300`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default OnboardingProgress;
