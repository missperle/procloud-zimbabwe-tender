import React, { createContext, useState, useEffect, useContext } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';

interface Subscription {
  tier: string;
  status: string;
  currentPeriodEnd: Date | null;
  paymentMethod: string | null;
}

interface SubscriptionContextProps {
  subscription: Subscription | null;
  isLoading: boolean;
  hasFeatureAccess: (feature: AIFeature) => boolean;
}

const SubscriptionContext = createContext<SubscriptionContextProps | undefined>(undefined);

export type AIFeature = 'ai_completion' | 'ai_image_generation' | 'ai_summarization' | 'ai_translation';

interface SubscriptionProviderProps {
  children: React.ReactNode;
}

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({ children }) => {
  const { currentUser } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!currentUser) {
        setIsLoading(false);
        return;
      }

      try {
        const db = getFirestore();
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          if (userData && userData.subscriptionId) {
            const subscriptionDocRef = doc(db, 'subscriptions', userData.subscriptionId);
            const subscriptionDocSnap = await getDoc(subscriptionDocRef);

            if (subscriptionDocSnap.exists()) {
              const subscriptionData = subscriptionDocSnap.data() as Subscription;
              // Convert timestamp to Date object
              const currentPeriodEnd = subscriptionData.currentPeriodEnd ? new Date(subscriptionData.currentPeriodEnd) : null;
              setSubscription({
                ...subscriptionData,
                currentPeriodEnd: currentPeriodEnd,
              });
            } else {
              setSubscription(null);
            }
          } else {
            setSubscription(null);
          }
        } else {
          setSubscription(null);
        }
      } catch (error) {
        console.error("Error fetching subscription:", error);
        setSubscription(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscription();
  }, [currentUser]);

  const hasFeatureAccess = (feature: AIFeature): boolean => {
    if (!subscription) return false;
    
    const { tier, status } = subscription;
    
    // Ensure subscription is active
    if (status !== 'active') return false;
    
    // Feature access based on tier
    switch (feature) {
      case 'ai_completion':
        return tier === 'pro' || tier === 'basic';
      case 'ai_summarization':
        return tier === 'pro';
      case 'ai_translation':
        return tier === 'pro';
      case 'ai_image_generation':
        return tier === 'pro'; // Only pro users can generate images
      default:
        return false;
    }
  };

  const value: SubscriptionContextProps = {
    subscription,
    isLoading,
    hasFeatureAccess,
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
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return context;
};
