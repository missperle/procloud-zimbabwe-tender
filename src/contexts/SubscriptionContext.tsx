
import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { useAuth } from "./SupabaseAuthContext";
import { supabase } from "@/integrations/supabase/client";

export type SubscriptionPlan = "Free" | "Basic" | "Pro";
export type SubscriptionStatus = "pending" | "active" | "canceled";
export type PaymentMethod = "Visa" | "Ecocash" | "Mukuru" | "Innbucks" | null;
export type AIFeature = "brief-builder" | "image-generator" | "proposal-ai" | "matching" | "budget-calculator" | "ai-chat";

interface Subscription {
  userId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  startDate: Date;
  nextBillingDate: Date | null;
  paymentMethod: PaymentMethod;
}

interface SubscriptionContextType {
  subscription: Subscription | null;
  isLoading: boolean;
  refreshSubscription: () => Promise<void>;
  hasFeatureAccess: (feature: AIFeature) => boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | null>(null);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return context;
};

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
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
      
      // Query the subscription table in Supabase
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('userid', currentUser.id)
        .order('startdate', { ascending: false })
        .limit(1)
        .single();
        
      if (error) {
        console.error("Error fetching subscription:", error);
        setSubscription(null);
        return;
      }
      
      if (data) {
        // Map database fields to our Subscription interface
        const subscriptionData: Subscription = {
          userId: data.userid,
          plan: data.plan as SubscriptionPlan,
          status: data.status as SubscriptionStatus,
          startDate: new Date(data.startdate),
          nextBillingDate: data.nextbillingdate ? new Date(data.nextbillingdate) : null,
          paymentMethod: data.paymentmethod as PaymentMethod
        };
        
        setSubscription(subscriptionData);
      } else {
        setSubscription(null);
      }
    } catch (error) {
      console.error("Error in subscription context:", error);
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
  
  // Check if user has access to specific AI feature based on subscription plan
  const hasFeatureAccess = (feature: AIFeature): boolean => {
    if (!subscription || subscription.status !== 'active') {
      return false;
    }
    
    // Feature access mapping based on subscription plan
    const featureAccess: Record<SubscriptionPlan, AIFeature[]> = {
      'Free': ['brief-builder'],
      'Basic': ['brief-builder', 'image-generator', 'matching', 'budget-calculator'],
      'Pro': ['brief-builder', 'image-generator', 'matching', 'budget-calculator', 'proposal-ai', 'ai-chat']
    };
    
    return featureAccess[subscription.plan].includes(feature);
  };

  return (
    <SubscriptionContext.Provider value={{ subscription, isLoading, refreshSubscription, hasFeatureAccess }}>
      {children}
    </SubscriptionContext.Provider>
  );
};
