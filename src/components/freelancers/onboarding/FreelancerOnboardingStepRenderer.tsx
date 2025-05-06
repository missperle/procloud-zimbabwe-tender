
import { ReactNode } from "react";
import { UseFormReturn } from "react-hook-form";
import BasicInfoForm, { StepOneFormValues } from "./BasicInfoForm";
import DetailsForm, { StepTwoFormValues } from "./DetailsForm";

interface FreelancerOnboardingStepRendererProps {
  currentStep: number;
  stepOneForm: UseFormReturn<StepOneFormValues>;
  stepTwoForm: UseFormReturn<StepTwoFormValues>;
  onStepOneSubmit: (data: StepOneFormValues) => void;
  onStepTwoSubmit: (data: StepTwoFormValues) => void;
  onBack: () => void;
  isLoading: boolean;
}

const FreelancerOnboardingStepRenderer = ({
  currentStep,
  stepOneForm,
  stepTwoForm,
  onStepOneSubmit,
  onStepTwoSubmit,
  onBack,
  isLoading
}: FreelancerOnboardingStepRendererProps): ReactNode => {
  switch (currentStep) {
    case 1:
      return (
        <BasicInfoForm 
          form={stepOneForm} 
          onSubmit={onStepOneSubmit} 
        />
      );
    case 2:
      return (
        <DetailsForm 
          form={stepTwoForm} 
          onSubmit={onStepTwoSubmit}
          onBack={onBack}
          isLoading={isLoading}
        />
      );
    default:
      return (
        <BasicInfoForm 
          form={stepOneForm} 
          onSubmit={onStepOneSubmit} 
        />
      );
  }
};

export default FreelancerOnboardingStepRenderer;
