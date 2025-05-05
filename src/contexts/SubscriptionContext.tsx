
import React, { createContext, useState, useEffect, useContext } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, limit, getDocs, DocumentData } from 'firebase/firestore';
import { useAuth } from './AuthContext';
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
      const subscriptionsRef = collection(db, 'subscriptions');
      const q = query(
        subscriptionsRef,
        where('userId', '==', currentUser.uid),
        orderBy('startDate', 'desc'),
        limit(1)
      );

      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        setSubscription(null);
        return;
      }

      const doc = querySnapshot.docs[0];
      const data = doc.data();
      
      // Convert Firestore timestamps to Date objects
      const subscription: Subscription = {
        id: doc.id,
        userId: data.userId,
        plan: data.plan,
        status: data.status,
        startDate: data.startDate instanceof Date 
          ? data.startDate 
          : new Date(data.startDate.seconds * 1000),
        nextBillingDate: data.nextBillingDate 
          ? (data.nextBillingDate instanceof Date 
              ? data.nextBillingDate 
              : new Date(data.nextBillingDate.seconds * 1000))
          : null,
        paymentMethod: data.paymentMethod
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
