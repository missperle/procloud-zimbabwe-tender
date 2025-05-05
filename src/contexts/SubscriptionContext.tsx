import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

interface SubscriptionContextType {
  subscription: any | null;
  isLoading: boolean;
  error: any | null;
  fetchSubscription: () => Promise<void>;
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
      
      // Update line 40 to use user.id instead of user.uid
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
    }
  }, [currentUser]);

  const value: SubscriptionContextType = {
    subscription,
    isLoading,
    error,
    fetchSubscription,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};
