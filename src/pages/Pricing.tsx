
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, CreditCard, Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Define subscription plan interfaces
interface PlanFeature {
  name: string;
  included: boolean;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: "monthly" | "yearly";
  features: PlanFeature[];
  popular?: boolean;
}

const Pricing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cash">("card");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Define subscription plans
  const subscriptionPlans: SubscriptionPlan[] = [
    {
      id: "free",
      name: "Free",
      description: "Basic access to the platform",
      price: 0,
      interval: "monthly",
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
      description: "Essential AI tools for small projects",
      price: 1499,
      interval: "monthly",
      popular: true,
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
      description: "Advanced AI tools for serious clients",
      price: 3999,
      interval: "monthly",
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

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    if (plan.id === "free") {
      // For free plan, just update the user record
      toast({
        title: "Free plan selected",
        description: "You're now on the Free plan",
      });
      navigate("/client-dashboard");
      return;
    }
    setIsDialogOpen(true);
  };

  const handlePaymentMethodSelect = (method: "card" | "cash") => {
    setPaymentMethod(method);
  };

  const handleProceedToCheckout = () => {
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "Please login or sign up to subscribe",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (paymentMethod === "card") {
      // Redirect to stripe checkout
      toast({
        title: "Redirecting to payment",
        description: "Preparing your subscription...",
      });
      // In a real implementation, this would call the Stripe checkout edge function
      console.log("Proceeding to Stripe checkout for plan:", selectedPlan?.id);
    } else {
      // Show cash payment instructions
      toast({
        title: "Cash Payment Selected",
        description: "Instructions will be sent to your email",
      });
      // In a real implementation, this would update the database with a pending subscription
      console.log("Proceeding with cash payment for plan:", selectedPlan?.id);
    }
    
    setIsDialogOpen(false);
    navigate("/client-dashboard?tab=tokens");
  };

  const formatPrice = (price: number) => {
    if (price === 0) return "Free";
    // Format price in USD
    return `$${(price / 100).toFixed(2)}`;
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-3">Choose Your Plan</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Unlock AI-powered features to find the perfect freelancers, create stunning briefs,
            and get the most out of your projects.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {subscriptionPlans.map((plan) => (
            <Card 
              key={plan.id}
              className={`flex flex-col h-full ${plan.popular ? 'border-procloud-green shadow-lg' : ''}`}
            >
              <CardHeader>
                <div className="flex justify-between items-center mb-2">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  {plan.popular && (
                    <Badge className="bg-procloud-green hover:bg-procloud-green">Popular</Badge>
                  )}
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="mb-6">
                  <span className="text-3xl font-bold">{formatPrice(plan.price)}</span>
                  {plan.price > 0 && <span className="text-muted-foreground">/{plan.interval}</span>}
                </div>
                
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check 
                        className={`mr-2 h-4 w-4 ${feature.included ? 'text-procloud-green' : 'text-muted-foreground opacity-50'}`} 
                      />
                      <span className={feature.included ? '' : 'text-muted-foreground line-through'}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => handleSelectPlan(plan)}
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.id === "free" ? "Get Started" : "Subscribe"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Choose Payment Method</DialogTitle>
              <DialogDescription>
                Select how you'd like to pay for your {selectedPlan?.name} subscription
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-2 gap-4 py-4">
              <div
                className={`border rounded-md p-3 flex flex-col items-center cursor-pointer ${
                  paymentMethod === "card" ? "border-procloud-green bg-primary/10" : ""
                }`}
                onClick={() => handlePaymentMethodSelect("card")}
              >
                <CreditCard className="h-6 w-6 mb-2" />
                <span className="text-sm font-medium">Credit Card</span>
                <span className="text-xs text-muted-foreground mt-1">Visa, Mastercard</span>
              </div>
              
              <div
                className={`border rounded-md p-3 flex flex-col items-center cursor-pointer ${
                  paymentMethod === "cash" ? "border-procloud-green bg-primary/10" : ""
                }`}
                onClick={() => handlePaymentMethodSelect("cash")}
              >
                <Wallet className="h-6 w-6 mb-2" />
                <span className="text-sm font-medium">Local Payment</span>
                <span className="text-xs text-muted-foreground mt-1">EcoCash, Mukuru, Innbucks</span>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleProceedToCheckout}>
                {paymentMethod === "card" ? "Proceed to Payment" : "Get Payment Instructions"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Pricing;
