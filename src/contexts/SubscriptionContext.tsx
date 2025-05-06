
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
  userSubscription: any | null;
  refreshSubscription: () => Promise<void>;
  tokenBalance: number;
  refreshTokenBalance: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  userRole: null,
  isLoading: true,
  refreshUserRole: async () => {},
  hasFeatureAccess: () => false,
  userSubscription: null,
  refreshSubscription: async () => {},
  tokenBalance: 0,
  refreshTokenBalance: async () => {}
});

export const useSubscription = () => useContext(SubscriptionContext);

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const { currentUser } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userSubscription, setUserSubscription] = useState<any | null>(null);
  const [tokenBalance, setTokenBalance] = useState<number>(0);

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

  // Fetch user's subscription details
  const fetchUserSubscription = async () => {
    if (!currentUser) {
      setUserSubscription(null);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*, plan_id')
        .eq('userid', currentUser.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
        console.error("Error fetching subscription:", error);
      } else if (data) {
        setUserSubscription(data);
      }
    } catch (error) {
      console.error("Error in subscription fetch operation:", error);
    }
  };

  // Fetch user's token balance
  const fetchTokenBalance = async () => {
    if (!currentUser) {
      setTokenBalance(0);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('tokens')
        .select('balance')
        .eq('user_id', currentUser.id)
        .single();

      if (error) {
        console.error("Error fetching token balance:", error);
      } else if (data) {
        setTokenBalance(data.balance);
      }
    } catch (error) {
      console.error("Error in token balance fetch operation:", error);
    }
  };

  // Refresh user role on demand
  const refreshUserRole = async () => {
    setIsLoading(true);
    await fetchUserRole();
  };

  // Refresh user subscription on demand
  const refreshSubscription = async () => {
    await fetchUserSubscription();
  };

  // Refresh token balance on demand
  const refreshTokenBalance = async () => {
    await fetchTokenBalance();
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
    fetchUserSubscription();
    fetchTokenBalance();
  }, [currentUser]);

  return (
    <SubscriptionContext.Provider value={{ 
      userRole, 
      isLoading, 
      refreshUserRole, 
      hasFeatureAccess,
      userSubscription,
      refreshSubscription,
      tokenBalance,
      refreshTokenBalance
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
};
