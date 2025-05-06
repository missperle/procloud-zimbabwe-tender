
import { supabase } from '@/integrations/supabase/client';
import { OnboardingFormData } from '@/types/onboarding';
import { toast } from '@/hooks/use-toast';

// Function to load the current onboarding step from the database
export const loadOnboardingStep = async (userId: string | undefined) => {
  if (!userId) return 1; // Default to step 1 if no user ID
  
  try {
    const { data, error } = await supabase
      .from('users')
      .select('onboarding_step')
      .eq('id', userId)
      .single();
      
    if (!error && data && data.onboarding_step) {
      return data.onboarding_step;
    }
    return 1; // Default to step 1 if no data
  } catch (error) {
    console.error('Error loading onboarding step:', error);
    return 1; // Default to step 1 if there's an error
  }
};

// Function to update the onboarding step in the database
export const updateOnboardingStep = async (userId: string | undefined, step: number) => {
  if (!userId) return;
  
  try {
    await supabase
      .from('users')
      .update({ onboarding_step: step })
      .eq('id', userId);
  } catch (error) {
    console.error('Error updating onboarding step:', error);
  }
};

// Function to complete onboarding
export const completeOnboarding = async (userId: string | undefined) => {
  if (!userId) return false;
  
  try {
    const { error } = await supabase
      .from('users')
      .update({ 
        onboarding_completed: true,
        onboarding_step: 5
      })
      .eq('id', userId);
      
    return !error;
  } catch (error) {
    console.error('Error completing onboarding:', error);
    return false;
  }
};

// Function to save client data
export const saveClientData = async (userId: string | undefined, formData: OnboardingFormData) => {
  if (!userId) return false;
  
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
      .eq('id', userId);

    if (error) throw error;

    // If subscription plan is selected, create or update subscription
    if (formData.selectedPlan) {
      const { error: subError } = await supabase
        .from('subscriptions')
        .upsert({
          userid: userId,
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
    
    return true;
  } catch (error) {
    console.error('Error saving client data:', error);
    toast({
      title: "Error",
      description: "There was a problem saving your information. Please try again.",
      variant: "destructive",
    });
    
    return false;
  }
};
