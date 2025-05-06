
import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import StepProgress from './StepProgress';
import StepNavigation from './StepNavigation';
import { Step } from '@/hooks/useOnboardingWizard';

interface OnboardingWizardLayoutProps {
  children: ReactNode;
  currentStep: number;
  steps: Step[];
  error: string | null;
  isLoading: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onComplete: () => void;
}

const OnboardingWizardLayout = ({
  children,
  currentStep,
  steps,
  error,
  isLoading,
  onPrevious,
  onNext,
  onComplete
}: OnboardingWizardLayoutProps) => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <StepProgress steps={steps} currentStep={currentStep} />
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Card className="mt-8 p-6">
        <h2 className="text-2xl font-bold mb-6">
          Step {currentStep}: {steps.find(s => s.id === currentStep)?.name}
        </h2>
        
        <div className="mb-8">
          {children}
        </div>
        
        <StepNavigation 
          currentStep={currentStep}
          totalSteps={steps.length - 1} // Subtract 1 because the last step is the "Finish" step
          onPrevious={onPrevious}
          onNext={onNext}
          onComplete={onComplete}
          isLoading={isLoading}
        />
      </Card>
    </div>
  );
};

export default OnboardingWizardLayout;
