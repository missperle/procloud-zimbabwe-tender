import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PlanFeature {
  name: string;
  included: boolean;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  features: PlanFeature[];
}

const SubscriptionPage = () => {
  const { currentUser } = useAuth();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSubscription = async () => {
      if (currentUser) {
        try {
          const { data, error } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('userid', currentUser.id) // Updated from currentUser.uid
            .single();

          if (error) {
            console.error("Error fetching subscription:", error);
            toast({
              title: "Error",
              description: "Failed to fetch your subscription details.",
              variant: "destructive",
            });
          } else {
            setSubscription(data);
          }
        } catch (error) {
          console.error("Unexpected error fetching subscription:", error);
          toast({
            title: "Unexpected Error",
            description: "An unexpected error occurred while fetching your subscription.",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      }
    };

    fetchSubscription();
  }, [currentUser, toast]);

  const subscriptionPlans: SubscriptionPlan[] = [
    {
      id: "free",
      name: "Free",
      description: "Limited AI features (try us out!)",
      features: [
        { name: "Create up to 3 briefs", included: true },
        { name: "Basic freelancer matching", included: true },
        { name: "Limited proposal reviews", included: true },
        { name: "AI-powered brief builder", included: false },
        { name: "AI image generation", included: false },
        { name: "Smart freelancer matching", included: false },
        { name: "Budget & timeline suggestions", included: false },
        { name: "AI proposal drafting", included: false },
        { name: "Live AI chat support", included: false },
        { name: "Proposal sentiment scoring", included: false },
      ],
    },
    {
      id: "basic",
      name: "Basic",
      description: "Core AI features",
      features: [
        { name: "Create unlimited briefs", included: true },
        { name: "Enhanced freelancer matching", included: true },
        { name: "Unlimited proposal reviews", included: true },
        { name: "AI-powered brief builder", included: true },
        { name: "AI image generation", included: true },
        { name: "Smart freelancer matching", included: true },
        { name: "Budget & timeline suggestions", included: true },
        { name: "AI proposal drafting", included: false },
        { name: "Live AI chat support", included: false },
        { name: "Proposal sentiment scoring", included: false },
      ],
    },
    {
      id: "pro",
      name: "Pro",
      description: "All AI features & priority support",
      features: [
        { name: "Create unlimited briefs", included: true },
        { name: "Premium freelancer matching", included: true },
        { name: "Priority support", included: true },
        { name: "AI-powered brief builder", included: true },
        { name: "AI image generation", included: true },
        { name: "Smart freelancer matching", included: true },
        { name: "Budget & timeline suggestions", included: true },
        { name: "AI proposal drafting", included: true },
        { name: "Live AI chat support", included: true },
        { name: "Proposal sentiment scoring", included: true },
      ],
    },
  ];

  if (loading) {
    return <p>Loading subscription details...</p>;
  }

  if (!subscription) {
    return <p>No subscription found. Please subscribe to a plan.</p>;
  }

  const currentPlan = subscriptionPlans.find((plan) => plan.id === subscription.tier);

  if (!currentPlan) {
    return <p>Invalid subscription plan. Please contact support.</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Current Subscription</CardTitle>
        <CardDescription>You are currently on the {currentPlan.name} plan.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Subscription Status: {subscription.status}</p>
        <p>Plan Details:</p>
        <ul>
          {currentPlan.features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <Check
                className={`mr-2 h-4 w-4 ${feature.included ? 'text-green-500' : 'text-gray-500'}`}
              />
              {feature.name}
            </li>
          ))}
        </ul>
      </CardContent>
      <Button>Manage Subscription</Button>
    </Card>
  );
};

export default SubscriptionPage;
