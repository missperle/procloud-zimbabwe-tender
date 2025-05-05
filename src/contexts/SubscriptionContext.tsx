
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

// Define the AIFeature type
export type AIFeature = 
  | 'ai_brief_builder' 
  | 'ai_image_generation'
  | 'ai_freelancer_matching'
  | 'ai_budget_suggestions'
  | 'ai_proposal_drafting'
  | 'ai_chat_support'
  | 'ai_sentiment_scoring';

// Define the user role type
export type UserRole = 'freelancer' | 'client';

interface SubscriptionContextType {
  subscription: any | null;
  isLoading: boolean;
  error: any | null;
  fetchSubscription: () => Promise<void>;
  hasFeatureAccess: (feature: AIFeature) => boolean;
  userRole: UserRole | null;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return context;
};

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [subscription, setSubscription] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const { currentUser } = useAuth();

  const fetchSubscription = async () => {
    setIsLoading(true);
    setError(null);
  
    if (!currentUser) {
      console.log("No user logged in");
      setIsLoading(false);
      return;
    }
  
    try {
      console.log("Fetching subscription for user:", currentUser.id);
      
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('userid', currentUser.id)
        .single();
  
      if (error) {
        console.error("Error fetching subscription:", error);
        setError(error);
      } else {
        console.log("Subscription data:", data);
        setSubscription(data);
      }
      
      // Fetch user role
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', currentUser.id)
        .single();
        
      if (userError) {
        console.error("Error fetching user role:", userError);
      } else if (userData) {
        console.log("User role:", userData.role);
        setUserRole(userData.role as UserRole);
      }
    } catch (err) {
      console.error("Error during subscription fetch:", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchSubscription();
    } else {
      setSubscription(null);
      setUserRole(null);
    }
  }, [currentUser]);

  // Implementation of hasFeatureAccess
  const hasFeatureAccess = (feature: AIFeature): boolean => {
    if (!subscription) {
      return false;
    }

    // Map features to subscription tiers
    const featureTiers: Record<AIFeature, string[]> = {
      ai_brief_builder: ['basic', 'pro'],
      ai_image_generation: ['basic', 'pro'],
      ai_freelancer_matching: ['basic', 'pro'],
      ai_budget_suggestions: ['basic', 'pro'],
      ai_proposal_drafting: ['pro'],
      ai_chat_support: ['pro'],
      ai_sentiment_scoring: ['pro']
    };

    // Check if the user's subscription tier has access to the feature
    return featureTiers[feature].includes(subscription.tier);
  };

  const value: SubscriptionContextType = {
    subscription,
    isLoading,
    error,
    fetchSubscription,
    hasFeatureAccess,
    userRole
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};
