
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, DollarSign, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import PaymentMethods from "./PaymentMethods";

interface PlanFeature {
  name: string;
  included: boolean;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  features: any;
  popular?: boolean;
}

const SubscriptionPage = () => {
  const { currentUser } = useAuth();
  const { userSubscription, refreshSubscription } = useSubscription();
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser) {
        try {
          // Fetch subscription plans
          const { data: plansData, error: plansError } = await supabase
            .from('subscription_plans')
            .select('*')
            .order('price');

          if (plansError) {
            console.error("Error fetching subscription plans:", plansError);
            toast({
              title: "Error",
              description: "Failed to fetch subscription plans.",
              variant: "destructive",
            });
          } else {
            setPlans(plansData || []);
          }
        } catch (error) {
          console.error("Unexpected error:", error);
          toast({
            title: "Unexpected Error",
            description: "An unexpected error occurred.",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [currentUser, toast]);

  // Find current plan
  const currentPlan = userSubscription 
    ? plans.find(plan => plan.id === userSubscription.plan_id) 
    : plans.find(plan => plan.id === 'free');

  // Handle plan selection and show payment dialog
  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setShowPaymentDialog(true);
  };

  // Handle successful payment
  const handleSuccessfulPayment = () => {
    setShowPaymentDialog(false);
    refreshSubscription();
    toast({
      title: "Payment Initiated",
      description: "Your subscription will be activated once payment is confirmed.",
    });
  };

  // Get features for a plan
  const getPlanFeatures = (plan: SubscriptionPlan): PlanFeature[] => {
    if (!plan) return [];
    
    const features: PlanFeature[] = [];
    
    // Add specific features from the plan's features JSON
    if (plan.features) {
      if (plan.features.tokens) {
        features.push({ name: `${plan.features.tokens} tokens per month`, included: true });
      }
      
      features.push({ name: 'AI brief builder', included: plan.features.ai_assistance === true });
      features.push({ name: 'AI image generation', included: plan.features.ai_assistance === true });
      features.push({ name: 'Smart freelancer matching', included: plan.features.ai_assistance === true });
      features.push({ name: 'Budget & timeline suggestions', included: plan.features.ai_assistance === true });
      features.push({ name: 'AI proposal drafting', included: plan.features.premium_features === true });
      features.push({ name: 'Live AI chat support', included: plan.features.premium_features === true });
      features.push({ name: 'Proposal sentiment scoring', included: plan.features.premium_features === true });
      features.push({ name: 'Priority support', included: plan.features.dedicated_support === true });
    }
    
    return features;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Subscription</h2>
          <p className="text-gray-500">Manage your subscription plan and billing</p>
        </div>
      </div>
      
      {currentPlan && userSubscription && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Current Plan: {currentPlan.name}</CardTitle>
            <CardDescription>
              Status: <span className="font-medium capitalize">{userSubscription.status}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <h3 className="font-medium mb-2">Plan Details:</h3>
                <ul className="space-y-2">
                  {getPlanFeatures(currentPlan).map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className={`mr-2 mt-1 ${feature.included ? 'text-green-500' : 'text-gray-300'}`}>
                        {feature.included ? '✓' : '✗'}
                      </span>
                      <span className={feature.included ? '' : 'text-gray-400'}>{feature.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {userSubscription.status === 'active' && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Your plan renews on {userSubscription.nextbillingdate 
                      ? new Date(userSubscription.nextbillingdate).toLocaleDateString() 
                      : 'N/A'}
                  </p>
                </div>
              )}
              
              {userSubscription.status === 'pending' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-yellow-800">
                  <p className="text-sm">
                    Your payment is being processed. Your subscription will be activated once payment is confirmed.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      <h3 className="text-xl font-semibold">Available Plans</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isCurrentPlan = userSubscription && userSubscription.plan_id === plan.id;
          const features = getPlanFeatures(plan);
          
          return (
            <Card 
              key={plan.id} 
              className={`relative overflow-hidden ${plan.popular ? 'border-procloud-green' : ''}`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-procloud-green text-white px-3 py-1 text-xs font-medium">
                  Popular
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-2">
                  <span className="text-3xl font-bold">${(plan.price / 100).toFixed(2)}</span>
                  <span className="text-gray-500 ml-1">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className={`mr-2 mt-1 ${feature.included ? 'text-green-500' : 'text-gray-300'}`}>
                        {feature.included ? '✓' : '✗'}
                      </span>
                      <span className={feature.included ? '' : 'text-gray-400'}>{feature.name}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className="w-full" 
                  variant={isCurrentPlan ? "outline" : "default"}
                  onClick={() => handleSelectPlan(plan)}
                  disabled={isCurrentPlan && userSubscription?.status === 'active'}
                >
                  {isCurrentPlan ? 'Current Plan' : 'Upgrade'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Subscribe to {selectedPlan?.name}</DialogTitle>
            <DialogDescription>
              Complete payment to activate your subscription.
            </DialogDescription>
          </DialogHeader>
          
          {selectedPlan && (
            <PaymentMethods
              amount={selectedPlan.price}
              onSuccessfulPayment={handleSuccessfulPayment}
              purchaseType="subscription"
              tokenAmount={selectedPlan.features?.tokens || 0}
              planId={selectedPlan.id}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubscriptionPage;
