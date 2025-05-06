
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';

// Define AI features that can be accessed with different subscription tiers
export type AIFeature = 
  | 'ai_brief_builder' 
  | 'ai_image_generation'
  | 'ai_freelancer_matching'
  | 'ai_budget_suggestions'
  | 'ai_proposal_drafting'
  | 'ai_chat_support'
  | 'ai_proposal_sentiment';

interface SubscriptionContextType {
  userRole: string | null;
  isLoading: boolean;
  refreshUserRole: () => Promise<void>;
  hasFeatureAccess: (feature: AIFeature) => boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  userRole: null,
  isLoading: true,
  refreshUserRole: async () => {},
  hasFeatureAccess: () => false
});

export const useSubscription = () => useContext(SubscriptionContext);

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const { currentUser } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserRole = async () => {
    if (!currentUser) {
      setUserRole(null);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', currentUser.id)
        .single();

      if (error) {
        console.error("Error fetching user role:", error);
        setUserRole(null);
      } else {
        console.log("Fetched user role:", data?.role);
        setUserRole(data?.role || null);
      }
    } catch (error) {
      console.error("Error in role fetch operation:", error);
      setUserRole(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh user role on demand
  const refreshUserRole = async () => {
    setIsLoading(true);
    await fetchUserRole();
  };

  // Function to check if a user has access to a specific AI feature based on their role
  const hasFeatureAccess = (feature: AIFeature): boolean => {
    // If still loading or no user role, default to no access
    if (isLoading || !userRole) return false;
    
    // Define feature access by tier
    const featureAccess = {
      // Free tier features (available to all clients)
      free: ['ai_brief_builder'].includes(feature),
      
      // Basic tier features
      basic: [
        'ai_brief_builder', 
        'ai_image_generation', 
        'ai_freelancer_matching',
        'ai_budget_suggestions'
      ].includes(feature),
      
      // Pro tier features (all features available)
      pro: true
    };

    // Map user role to their subscription tier
    // For now we're using a simple mapping based on the role
    // In a real implementation, you would fetch the actual subscription tier from the database
    const subscriptionTier = userRole === 'admin' ? 'pro' : 'basic';
    
    // Return whether the user has access to the requested feature
    return featureAccess[subscriptionTier] === true || 
           (Array.isArray(featureAccess[subscriptionTier]) && featureAccess[subscriptionTier]);
  };

  // Listen for auth changes and update role
  useEffect(() => {
    fetchUserRole();
  }, [currentUser]);

  return (
    <SubscriptionContext.Provider value={{ userRole, isLoading, refreshUserRole, hasFeatureAccess }}>
      {children}
    </SubscriptionContext.Provider>
  );
};
