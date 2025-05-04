
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';

export type SubscriptionStatus = 'pending' | 'active' | 'canceled';
export type SubscriptionPlan = 'Free' | 'Basic' | 'Pro';
export type PaymentMethod = 'Visa' | 'Ecocash' | 'Mukuru' | 'Innbucks' | null;

export interface Subscription {
  userId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  startDate: Date;
  nextBillingDate: Date | null;
  paymentMethod: PaymentMethod;
}

export function useSubscriptionGuard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  useEffect(() => {
    const checkSubscription = async () => {
      if (!currentUser) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        const subscriptionsRef = collection(db, 'subscriptions');
        const q = query(
          subscriptionsRef,
          where('userId', '==', currentUser.uid),
          orderBy('startDate', 'desc'),
          limit(1)
        );

        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          console.log('No subscription found, redirecting to pricing');
          navigate('/pricing');
          return;
        }

        const subscriptionData = querySnapshot.docs[0].data() as Subscription;
        
        // Convert Firestore timestamps to Date objects
        subscriptionData.startDate = subscriptionData.startDate instanceof Date 
          ? subscriptionData.startDate 
          : new Date(subscriptionData.startDate.seconds * 1000);
        
        if (subscriptionData.nextBillingDate) {
          subscriptionData.nextBillingDate = subscriptionData.nextBillingDate instanceof Date 
            ? subscriptionData.nextBillingDate 
            : new Date(subscriptionData.nextBillingDate.seconds * 1000);
        }

        setSubscription(subscriptionData);

        if (subscriptionData.status !== 'active') {
          console.log('Subscription not active, redirecting to pricing');
          navigate('/pricing');
          return;
        }

      } catch (error) {
        console.error('Error checking subscription:', error);
        navigate('/pricing');
      } finally {
        setLoading(false);
      }
    };

    checkSubscription();
  }, [currentUser, navigate]);

  return { loading, subscription };
}
