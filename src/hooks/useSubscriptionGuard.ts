
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, limit, getDocs, Timestamp } from 'firebase/firestore';

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

        const subscriptionDoc = querySnapshot.docs[0];
        const data = subscriptionDoc.data();
        
        // Convert Firestore timestamps to Date objects
        const subscriptionData: Subscription = {
          userId: data.userId,
          plan: data.plan,
          status: data.status,
          startDate: new Date(),
          nextBillingDate: null,
          paymentMethod: data.paymentMethod
        };

        // Handle startDate conversion from Firestore Timestamp to Date
        if (data.startDate) {
          if (data.startDate instanceof Timestamp) {
            subscriptionData.startDate = data.startDate.toDate();
          } else if (data.startDate.seconds) {
            subscriptionData.startDate = new Date(data.startDate.seconds * 1000);
          }
        }
        
        // Handle nextBillingDate conversion from Firestore Timestamp to Date
        if (data.nextBillingDate) {
          if (data.nextBillingDate instanceof Timestamp) {
            subscriptionData.nextBillingDate = data.nextBillingDate.toDate();
          } else if (data.nextBillingDate.seconds) {
            subscriptionData.nextBillingDate = new Date(data.nextBillingDate.seconds * 1000);
          }
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
