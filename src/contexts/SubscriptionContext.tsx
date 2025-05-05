
import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { useAuth } from "./SupabaseAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { SubscriptionPlan, SubscriptionStatus, PaymentMethod } from "@/hooks/useSubscriptionGuard";

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

  return (
    <SubscriptionContext.Provider value={{ subscription, isLoading, refreshSubscription }}>
      {children}
    </SubscriptionContext.Provider>
  );
};
