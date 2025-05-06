
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import StepProgress from './StepProgress';
import StepNavigation from './StepNavigation';
import BasicInfoStep from './steps/BasicInfoStep';
import CompanyDetailsStep from './steps/CompanyDetailsStep';
import DocumentUploadStep from './steps/DocumentUploadStep';
import SubscriptionStep from './steps/SubscriptionStep';
import FinalStep from './steps/FinalStep';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Step } from './StepProgress';
import { useIsMobile } from '@/hooks/use-mobile';

const OnboardingWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<any>({
    companyName: '',
    tradingName: '',
    registrationNumber: '',
    taxId: '',
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: ''
    },
    contact: {
      name: '',
      email: '',
      phone: ''
    },
    documents: [],
    selectedPlan: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentUser, refreshUserStatus } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const steps: Step[] = [
    { id: 1, name: 'Company Info' },
    { id: 2, name: 'Contact Details' },
    { id: 3, name: 'Documents' },
    { id: 4, name: 'Subscription' },
    { id: 5, name: 'Finish' }
  ];
  
  // Load the current onboarding step from database when component mounts
  useEffect(() => {
    const loadOnboardingStep = async () => {
      if (!currentUser) return;
      
      try {
        const { data, error } = await supabase
          .from('users')
          .select('onboarding_step')
          .eq('id', currentUser.id)
          .single();
          
        if (!error && data && data.onboarding_step) {
          setCurrentStep(data.onboarding_step);
        }
      } catch (error) {
        console.error('Error loading onboarding step:', error);
      }
    };
    
    loadOnboardingStep();
  }, [currentUser]);

  const updateFormData = (stepData: any) => {
    setFormData({ ...formData, ...stepData });
  };

  const handleNext = async () => {
    setError(null);
    
    if (currentStep === 1) {
      // Validate basic info
      if (!formData.companyName) {
        toast({
          title: "Required Field Missing",
          description: "Please enter your company name",
          variant: "destructive",
        });
        return;
      }
    } else if (currentStep === 4) {
      // Save all data to the database before proceeding
      await saveClientData();
    }

    if (currentStep < steps.length) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      // Update onboarding step in database
      if (currentUser) {
        try {
          await supabase
            .from('users')
            .update({ onboarding_step: nextStep })
            .eq('id', currentUser.id);
        } catch (error) {
          console.error('Error updating onboarding step:', error);
        }
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (currentUser) {
        await supabase
          .from('users')
          .update({ 
            onboarding_completed: true,
            onboarding_step: 5
          })
          .eq('id', currentUser.id);
          
        // Refresh user status to update the user context
        await refreshUserStatus();
        
        navigate('/client-dashboard');
        toast({
          title: "Onboarding Completed!",
          description: "Welcome to proCloud. Your account is ready to use.",
        });
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
      setError("Something went wrong. Please try again.");
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveClientData = async () => {
    if (!currentUser) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Update user profile with company details
      const { error } = await supabase
        .from('users')
        .update({
          company_name: formData.companyName,
          trading_name: formData.tradingName,
          company_registration_number: formData.registrationNumber,
          tax_id: formData.taxId,
          company_address: formData.address,
        })
        .eq('id', currentUser.id);

      if (error) throw error;

      // If subscription plan is selected, create or update subscription
      if (formData.selectedPlan) {
        const { error: subError } = await supabase
          .from('subscriptions')
          .upsert({
            userid: currentUser.id,
            plan_id: formData.selectedPlan.id,
            status: 'pending',
            plan: formData.selectedPlan.name,
            paymentmethod: 'card'
          }, { onConflict: 'userid' });

        if (subError) throw subError;
      }

      toast({
        title: "Information Saved",
        description: "Your company details have been saved successfully."
      });
    } catch (error) {
      console.error('Error saving client data:', error);
      setError("Failed to save your information. Please try again.");
      toast({
        title: "Error",
        description: "There was a problem saving your information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoStep formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <CompanyDetailsStep formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <DocumentUploadStep formData={formData} updateFormData={updateFormData} userId={currentUser?.id} />;
      case 4:
        return <SubscriptionStep formData={formData} updateFormData={updateFormData} />;
      case 5:
        return <FinalStep />;
      default:
        return <BasicInfoStep formData={formData} updateFormData={updateFormData} />;
    }
  };

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
        <h2 className="text-2xl font-bold mb-6">Step {currentStep}: {steps.find(s => s.id === currentStep)?.name}</h2>
        
        <div className="mb-8">
          {renderCurrentStep()}
        </div>
        
        <StepNavigation 
          currentStep={currentStep}
          totalSteps={steps.length - 1} // Subtract 1 because the last step is the "Finish" step
          onPrevious={handlePrevious}
          onNext={handleNext}
          onComplete={handleComplete}
          isLoading={isLoading}
        />
      </Card>
    </div>
  );
};

export default OnboardingWizard;
