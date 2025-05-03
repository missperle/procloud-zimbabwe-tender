
import React, { ReactNode } from 'react';
import { AIFeature } from '@/contexts/SubscriptionContext';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AIFeatureGateProps {
  feature: AIFeature;
  children: ReactNode;
  fallback?: ReactNode;
  redirectOnLocked?: boolean;
}

/**
 * A component that conditionally renders children based on feature access
 */
export const AIFeatureGate: React.FC<AIFeatureGateProps> = ({
  feature,
  children,
  fallback,
  redirectOnLocked = false
}) => {
  const { checkAccess } = useFeatureAccess();
  const navigate = useNavigate();
  
  const hasAccess = checkAccess(feature, redirectOnLocked);
  
  if (hasAccess) {
    return <>{children}</>;
  }
  
  if (fallback) {
    return <>{fallback}</>;
  }
  
  return (
    <Card className="p-6 flex flex-col items-center justify-center min-h-[200px] text-center">
      <Lock className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">Premium Feature</h3>
      <p className="text-muted-foreground mb-4">
        This feature requires a subscription upgrade
      </p>
      <Button onClick={() => navigate('/pricing')}>
        Upgrade Now
      </Button>
    </Card>
  );
};
