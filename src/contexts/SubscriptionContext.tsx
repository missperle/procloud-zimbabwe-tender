
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';

// Define subscription tier types
export type SubscriptionTier = 'free' | 'basic' | 'pro';

export interface Subscription {
  id: string;
  userId: string;
  tier: SubscriptionTier;
  status: 'active' | 'canceled' | 'past_due' | 'pending';
  currentPeriodEnd: Date | null;
  paymentMethod: 'card' | 'cash' | null;
  createdAt: Date;
}

interface SubscriptionContextType {
  subscription: Subscription | null;
  isLoading: boolean;
  hasFeatureAccess: (feature: AIFeature) => boolean;
  refreshSubscription: () => Promise<void>;
}

// Define AI features that can be checked for access control
export type AIFeature = 
  | 'brief-builder'
  | 'image-generation'
  | 'smart-matching'
  | 'budget-suggestions'
  | 'proposal-drafting'
  | 'ai-chat'
  | 'sentiment-scoring';

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

interface SubscriptionProviderProps {
  children: ReactNode;
}

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({ children }) => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Feature access map based on subscription tier
  const featureAccessMap: Record<SubscriptionTier, AIFeature[]> = {
    free: [],
    basic: [
      'brief-builder',
      'image-generation',
      'smart-matching',
      'budget-suggestions'
    ],
    pro: [
      'brief-builder',
      'image-generation',
      'smart-matching', 
      'budget-suggestions',
      'proposal-drafting',
      'ai-chat',
      'sentiment-scoring'
    ]
  };

  const fetchSubscription = async () => {
    if (!currentUser) {
      setSubscription(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      // In a real implementation, this would fetch from Firestore or an API
      // For now, simulate a fetch with a timeout
      setTimeout(() => {
        // Mock subscription data - would come from Firestore in production
        const mockSubscription: Subscription = {
          id: 'sub_123456789',
          userId: currentUser.uid,
          tier: 'free', // Default to free
          status: 'active',
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          paymentMethod: null,
          createdAt: new Date()
        };
        
        setSubscription(mockSubscription);
        setIsLoading(false);
        
        console.log('Subscription fetched:', mockSubscription);
      }, 1000);

    } catch (error) {
      console.error('Error fetching subscription:', error);
      toast({
        title: "Error",
        description: "Failed to fetch subscription information",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  // Check if user has access to a particular feature
  const hasFeatureAccess = (feature: AIFeature): boolean => {
    if (!subscription || subscription.status !== 'active') return false;
    return featureAccessMap[subscription.tier].includes(feature);
  };

  // Refresh subscription data
  const refreshSubscription = async () => {
    await fetchSubscription();
  };

  // Fetch subscription when user changes
  useEffect(() => {
    fetchSubscription();
  }, [currentUser]);

  const value = {
    subscription,
    isLoading,
    hasFeatureAccess,
    refreshSubscription,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};
