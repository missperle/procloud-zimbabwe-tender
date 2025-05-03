
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, CreditCard, Wallet, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { auth } from "@/lib/firebase";

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
  const [paymentMethod, setPaymentMethod] = useState<"card" | "ecocash" | "mukuru" | "innbucks">("card");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchaseRequestSent, setPurchaseRequestSent] = useState(false);

  // Define subscription plans
  const subscriptionPlans: SubscriptionPlan[] = [
    {
      id: "free",
      name: "Free",
      description: "Limited AI features (try us out!)",
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
      description: "Core AI features",
      price: 2500, // $25.00
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
      description: "All AI features & priority support",
      price: 10000, // $100.00
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
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "Please login or sign up to subscribe",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    if (plan.id === "free") {
      // For free plan, just update the user record
      handleSubmitFreeSubscription();
      return;
    }
    setIsDialogOpen(true);
  };

  const handleSubmitFreeSubscription = async () => {
    setIsProcessing(true);
    try {
      // In a real implementation, this would update the database with a free subscription
      // For demonstration purposes, we'll just show a success toast
      toast({
        title: "Free plan selected",
        description: "You're now on the Free plan",
      });
      setTimeout(() => {
        setIsProcessing(false);
        navigate("/client-dashboard");
      }, 1000);
    } catch (error) {
      console.error("Error setting free subscription:", error);
      toast({
        title: "Error",
        description: "Failed to set up free plan. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  const handlePaymentMethodSelect = (method: "card" | "ecocash" | "mukuru" | "innbucks") => {
    setPaymentMethod(method);
  };

  const handleProceedToCheckout = async () => {
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "Please login or sign up to subscribe",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    setIsProcessing(true);

    try {
      // In a real app, this would be calling a Firebase function or API
      console.log("Processing subscription:", {
        userId: currentUser.uid,
        plan: selectedPlan?.id,
        paymentMethod
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (paymentMethod === "card") {
        // Simulate redirect to Stripe checkout
        toast({
          title: "Redirecting to payment",
          description: "Preparing your subscription...",
        });
        // In a real implementation, this would call the Stripe checkout edge function
      } else {
        // Show local payment instructions
        setPurchaseRequestSent(true);
        toast({
          title: `${paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)} Payment Selected`,
          description: "Instructions will be sent to your email",
        });
      }
    } catch (error) {
      console.error("Subscription error:", error);
      toast({
        title: "Error",
        description: "Failed to process your subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
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
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : plan.id === "free" ? "Get Started" : "Subscribe"}
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
            
            {!purchaseRequestSent ? (
              <>
                <RadioGroup 
                  value={paymentMethod} 
                  onValueChange={(value) => handlePaymentMethodSelect(value as any)} 
                  className="grid grid-cols-2 gap-4 py-4"
                >
                  <div className={`border rounded-md p-3 flex flex-col items-center cursor-pointer ${
                    paymentMethod === "card" ? "border-procloud-green bg-primary/10" : ""
                  }`}>
                    <RadioGroupItem value="card" id="card" className="sr-only" />
                    <Label htmlFor="card" className="flex flex-col items-center cursor-pointer">
                      <CreditCard className="h-6 w-6 mb-2" />
                      <span className="text-sm font-medium">Credit Card</span>
                      <span className="text-xs text-muted-foreground mt-1">Visa, Mastercard</span>
                    </Label>
                  </div>
                  
                  <div className={`border rounded-md p-3 flex flex-col items-center cursor-pointer ${
                    paymentMethod === "ecocash" ? "border-procloud-green bg-primary/10" : ""
                  }`}>
                    <RadioGroupItem value="ecocash" id="ecocash" className="sr-only" />
                    <Label htmlFor="ecocash" className="flex flex-col items-center cursor-pointer">
                      <Wallet className="h-6 w-6 mb-2" />
                      <span className="text-sm font-medium">EcoCash</span>
                      <span className="text-xs text-muted-foreground mt-1">USSD/Cash Deposit</span>
                    </Label>
                  </div>
                  
                  <div className={`border rounded-md p-3 flex flex-col items-center cursor-pointer ${
                    paymentMethod === "mukuru" ? "border-procloud-green bg-primary/10" : ""
                  }`}>
                    <RadioGroupItem value="mukuru" id="mukuru" className="sr-only" />
                    <Label htmlFor="mukuru" className="flex flex-col items-center cursor-pointer">
                      <Wallet className="h-6 w-6 mb-2" />
                      <span className="text-sm font-medium">Mukuru</span>
                      <span className="text-xs text-muted-foreground mt-1">Cash Deposit</span>
                    </Label>
                  </div>
                  
                  <div className={`border rounded-md p-3 flex flex-col items-center cursor-pointer ${
                    paymentMethod === "innbucks" ? "border-procloud-green bg-primary/10" : ""
                  }`}>
                    <RadioGroupItem value="innbucks" id="innbucks" className="sr-only" />
                    <Label htmlFor="innbucks" className="flex flex-col items-center cursor-pointer">
                      <Wallet className="h-6 w-6 mb-2" />
                      <span className="text-sm font-medium">Innbucks</span>
                      <span className="text-xs text-muted-foreground mt-1">Wallet</span>
                    </Label>
                  </div>
                </RadioGroup>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isProcessing}>
                    Cancel
                  </Button>
                  <Button onClick={handleProceedToCheckout} disabled={isProcessing}>
                    {isProcessing ? "Processing..." : 
                     paymentMethod === "card" ? "Proceed to Payment" : "Submit Purchase Request"}
                  </Button>
                </DialogFooter>
              </>
            ) : (
              <div className="py-4">
                <Alert className="bg-green-50 border-green-200">
                  <AlertCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Your purchase request has been sent. Follow the instructions sent to your email, 
                    and once payment is confirmed, your plan will be activated!
                  </AlertDescription>
                </Alert>
                <div className="mt-6 text-center">
                  <Button onClick={() => {
                    setIsDialogOpen(false);
                    setPurchaseRequestSent(false);
                    navigate("/client-dashboard");
                  }}>
                    Return to Dashboard
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Pricing;
