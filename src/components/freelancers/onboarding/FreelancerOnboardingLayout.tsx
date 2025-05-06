
import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import OnboardingProgressBar from "./OnboardingProgressBar";
import { Step } from "@/hooks/useFreelancerOnboarding";
import StepNavigation from "@/components/onboarding/StepNavigation";

interface FreelancerOnboardingLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
  currentStep: number;
  steps: Step[];
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
  isLoading,
  onPrevious,
  onNext,
  onComplete
}: FreelancerOnboardingLayoutProps) => {
  const totalSteps = steps.length;
  const isLastStep = currentStep === totalSteps;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      
      <CardContent>
        <OnboardingProgressBar currentStep={currentStep} />
        
        <div className="mb-6">
          {children}
        </div>
        
        {/* Navigation buttons moved to parent to avoid duplication in each step */}
        <StepNavigation 
          currentStep={currentStep}
          totalSteps={totalSteps}
          onPrevious={onPrevious}
          onNext={onNext}
          onComplete={onComplete}
          isLoading={isLoading}
          showBackButton={false}
        />
      </CardContent>
    </Card>
  );
};

export default FreelancerOnboardingLayout;
