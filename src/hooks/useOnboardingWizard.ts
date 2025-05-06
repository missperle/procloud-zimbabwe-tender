
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface OnboardingFormData {
  companyName: string;
  tradingName: string;
  registrationNumber: string;
  taxId: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  contact: {
    name: string;
    email: string;
    phone: string;
  };
  documents: any[];
  selectedPlan: any;
}

export interface Step {
  id: number;
  name: string;
}

export function useOnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingFormData>({
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

  const updateFormData = (stepData: Partial<OnboardingFormData>) => {
    setFormData(prevData => ({ ...prevData, ...stepData }));
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

  return {
    currentStep,
    formData,
    isLoading,
    error,
    steps,
    updateFormData,
    handleNext,
    handlePrevious,
    handleComplete,
  };
}
