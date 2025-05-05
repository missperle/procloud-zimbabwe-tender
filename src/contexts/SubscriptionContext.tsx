
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from './SupabaseAuthContext';
import { SubscriptionPlan, SubscriptionStatus, PaymentMethod } from '@/hooks/useSubscriptionGuard';

export type AIFeature = 'image-generation' | 'brief-builder' | 'proposal-assistance' | 'analytics' | 'job-matching';

export interface Subscription {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  startDate: Date;
  nextBillingDate: Date | null;
  paymentMethod: PaymentMethod;
}

interface SubscriptionContextProps {
  subscription: Subscription | null;
  isLoading: boolean;
  refreshSubscription: () => Promise<void>;
  hasFeatureAccess: (feature: AIFeature) => boolean;
}

const SubscriptionContext = createContext<SubscriptionContextProps | undefined>(undefined);

export const SubscriptionProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const { currentUser } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSubscription = async () => {
    if (!currentUser) {
      setSubscription(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      // Query subscriptions table for the current user
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('userid', currentUser.id)
        .order('startdate', { ascending: false })
        .limit(1)
        .single();
      
      if (error) {
        console.error('Error fetching subscription:', error);
        setSubscription(null);
        return;
      }
      
      if (!data) {
        setSubscription(null);
        return;
      }
      
      // Convert Supabase timestamps to Date objects
      const subscription: Subscription = {
        id: data.id,
        userId: data.userid,
        plan: data.plan as SubscriptionPlan,
        status: data.status as SubscriptionStatus,
        startDate: new Date(data.startdate),
        nextBillingDate: data.nextbillingdate ? new Date(data.nextbillingdate) : null,
        paymentMethod: data.paymentmethod as PaymentMethod
      };
      
      setSubscription(subscription);
    } catch (error) {
      console.error('Error fetching subscription:', error);
      setSubscription(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, [currentUser]);

  const refreshSubscription = async () => {
    await fetchSubscription();
  };

  // Implement feature access logic based on subscription plan
  const hasFeatureAccess = (feature: AIFeature): boolean => {
    if (!subscription || subscription.status !== 'active') {
      return false;
    }

    // Define which features are available for each plan
    const featureAccess: Record<SubscriptionPlan, AIFeature[]> = {
      'Free': ['job-matching'],
      'Basic': ['job-matching', 'brief-builder', 'proposal-assistance'],
      'Pro': ['job-matching', 'brief-builder', 'proposal-assistance', 'image-generation', 'analytics']
    };

    return featureAccess[subscription.plan]?.includes(feature) || false;
  };

  const value = {
    subscription,
    isLoading,
    refreshSubscription,
    hasFeatureAccess
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
