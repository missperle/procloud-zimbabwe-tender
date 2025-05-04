
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '@/contexts/SubscriptionContext';

interface SubscriptionGuardProps {
  children: React.ReactNode;
  requiredPlans?: ('Free' | 'Basic' | 'Pro')[];
}

const SubscriptionGuard: React.FC<SubscriptionGuardProps> = ({ 
  children, 
  requiredPlans = ['Basic', 'Pro'] 
}) => {
  const { subscription, isLoading } = useSubscription();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect if we've finished loading and either:
    // 1. No subscription exists, or
    // 2. Subscription status is not active, or
    // 3. Subscription plan is not in the required plans list
    if (!isLoading && 
        (!subscription || 
         subscription.status !== 'active' ||
         !requiredPlans.includes(subscription.plan))) {
      navigate('/pricing');
    }
  }, [subscription, isLoading, navigate, requiredPlans]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Checking subscription...</p>
        </div>
      </div>
    );
  }

  // If we have a subscription, it's active, and the plan is allowed, render children
  if (subscription && 
      subscription.status === 'active' && 
      requiredPlans.includes(subscription.plan)) {
    return <>{children}</>;
  }

  // This will only show briefly before redirect happens
  return null;
};

export default SubscriptionGuard;
