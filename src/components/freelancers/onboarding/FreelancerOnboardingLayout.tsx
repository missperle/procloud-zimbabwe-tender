
import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import OnboardingProgressBar from "./OnboardingProgressBar";
import { Step } from "@/hooks/useFreelancerOnboarding";
import StepNavigation from "@/components/onboarding/StepNavigation";

interface FreelancerOnboardingLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
  currentStep: number;
  steps: Step[];
  error: string | null;
  isLoading: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onComplete: () => void;
}

const FreelancerOnboardingLayout = ({
  children,
  title,
  description,
  currentStep,
  steps,
  error,
  isLoading,
  onPrevious,
  onNext,
  onComplete
}: FreelancerOnboardingLayoutProps) => {
  const totalSteps = steps.length;
  const isLastStep = currentStep === totalSteps;
  const currentStepData = steps.find(step => step.id === currentStep);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      
      <CardContent>
        <OnboardingProgressBar currentStep={currentStep} totalSteps={totalSteps} />
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">
            Step {currentStep}: {currentStepData?.name}
          </h3>
          <p className="text-gray-500 mb-6">{currentStepData?.description}</p>
          
          {children}
        </div>
        
        <StepNavigation 
          currentStep={currentStep}
          totalSteps={totalSteps}
          onPrevious={onPrevious}
          onNext={onNext}
          onComplete={onComplete}
          isLoading={isLoading}
          showBackButton={currentStep > 1}
        />
      </CardContent>
    </Card>
  );
};

export default FreelancerOnboardingLayout;
