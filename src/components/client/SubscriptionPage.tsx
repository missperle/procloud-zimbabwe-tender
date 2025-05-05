
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Calendar, CreditCard } from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getFirestore, collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { useToast } from "@/hooks/use-toast";

const SubscriptionPage: React.FC = () => {
  const { subscription, isLoading } = useSubscription();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const { toast } = useToast();

  const handleChangePlan = () => {
    navigate('/pricing');
  };

  const handleManageBilling = () => {
    // In a real implementation, this would open the Stripe customer portal
    console.log('Opening customer portal...');
  };

  const openCancelDialog = () => {
    setShowCancelDialog(true);
  };

  const handleCancelSubscription = async () => {
    if (!currentUser || !subscription) return;
    
    try {
      const db = getFirestore();
      
      // Find the subscription document by userId (per security rules)
      const subscriptionsRef = collection(db, 'subscriptions');
      const q = query(subscriptionsRef, where("userId", "==", currentUser.id)); // Changed from uid to id
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const subscriptionDoc = querySnapshot.docs[0];
        // Update subscription status to canceled
        await updateDoc(doc(db, 'subscriptions', subscriptionDoc.id), {
          status: 'canceled',
        });
        
        toast({
          title: "Subscription canceled",
          description: "Your subscription will end at the current billing period",
        });
        
        setShowCancelDialog(false);
      }
    } catch (error) {
      console.error("Error canceling subscription:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-procloud-green"></div>
      </div>
    );
  }

  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getTierLabel = (plan: string) => {
    const tierLabels: Record<string, string> = {
      'Free': 'Free',
      'Basic': 'Basic',
      'Pro': 'Pro'
    };
    return tierLabels[plan] || plan;
  };

  const getStatusBadgeColor = (status: string) => {
    const statusColors: Record<string, string> = {
      'active': 'bg-green-100 text-green-800',
      'canceled': 'bg-yellow-100 text-yellow-800',
      'past_due': 'bg-red-100 text-red-800',
      'pending': 'bg-blue-100 text-blue-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Subscription Management</h2>

      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>Manage your subscription details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {subscription ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Plan</h3>
                  <div className="flex items-center">
                    <span className="text-lg font-bold capitalize">
                      {getTierLabel(subscription.plan)}
                    </span>
                    <Badge className={`ml-2 ${getStatusBadgeColor(subscription.status)}`}>
                      {subscription.status}
                    </Badge>
                  </div>
                </div>

                {subscription.nextBillingDate && subscription.status === 'active' && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Renews On</h3>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{formatDate(subscription.nextBillingDate)}</span>
                    </div>
                  </div>
                )}
              </div>

              {subscription.paymentMethod && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Payment Method</h3>
                  <div className="flex items-center">
                    <CreditCard className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="capitalize">{subscription.paymentMethod}</span>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button onClick={handleChangePlan}>
                  Change Plan
                </Button>
                {subscription.plan !== 'Free' && subscription.status === 'active' && (
                  <>
                    <Button variant="outline" onClick={handleManageBilling}>
                      Manage Billing
                    </Button>
                    <Button variant="outline" onClick={openCancelDialog} className="text-destructive">
                      Cancel Subscription
                    </Button>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground mb-4">You don't have an active subscription</p>
              <Button onClick={handleChangePlan}>View Plans</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {subscription?.plan === 'Free' && (
        <Card>
          <CardContent className="pt-6">
            <Alert className="bg-amber-50">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                You're currently on the Free plan. Upgrade to access AI-powered features.
              </AlertDescription>
            </Alert>
            <div className="mt-4">
              <Button onClick={handleChangePlan}>Upgrade Now</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel your subscription?</DialogTitle>
            <DialogDescription>
              You'll lose access to premium features at the end of your current billing period.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p>Your subscription will remain active until {formatDate(subscription?.nextBillingDate)}</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              Keep Subscription
            </Button>
            <Button variant="destructive" onClick={handleCancelSubscription}>
              Cancel Subscription
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubscriptionPage;
