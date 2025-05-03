
import { useSubscription, AIFeature } from '@/contexts/SubscriptionContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from './use-toast';

export function useFeatureAccess() {
  const { hasFeatureAccess } = useSubscription();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  /**
   * Check if user has access to a feature and redirect if not
   * @param feature The AI feature to check access for
   * @param redirectOnFailure Whether to redirect to pricing page on failure
   * @returns Boolean indicating if user has access
   */
  const checkAccess = (feature: AIFeature, redirectOnFailure = true): boolean => {
    const hasAccess = hasFeatureAccess(feature);
    
    if (!hasAccess && redirectOnFailure) {
      toast({
        title: "Upgrade Required",
        description: "This feature requires a paid subscription",
        variant: "destructive",
      });
      navigate('/pricing');
    }
    
    return hasAccess;
  };
  
  return { checkAccess };
}
