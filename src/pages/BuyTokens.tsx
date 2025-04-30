
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/lib/firebase";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Coins, QrCode, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface TokenBundle {
  id: string;
  tokens: number;
  price: number;
  savings?: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  instructions: React.ReactNode;
}

const BuyTokens = () => {
  const [currentBalance, setCurrentBalance] = useState<number>(100); // Placeholder - would fetch from Firebase
  const [selectedBundle, setSelectedBundle] = useState<TokenBundle | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Token bundle options
  const tokenBundles: TokenBundle[] = [
    { id: "basic", tokens: 10, price: 5 },
    { id: "popular", tokens: 50, price: 20, savings: "20% savings" },
    { id: "pro", tokens: 100, price: 35, savings: "30% savings" },
  ];

  // Payment method options
  const paymentMethods: PaymentMethod[] = [
    {
      id: "ecocash",
      name: "EcoCash",
      icon: <CreditCard className="h-5 w-5" />,
      instructions: (
        <div className="space-y-2 mt-2">
          <p className="text-sm">Follow these steps to complete your payment:</p>
          <ol className="list-decimal list-inside text-sm space-y-1">
            <li>Dial <span className="font-mono bg-gray-100 px-1 rounded">*151#</span> on your mobile phone</li>
            <li>Select option 3: "Payments"</li>
            <li>Select option 1: "Pay Merchant"</li>
            <li>Enter merchant code: <span className="font-mono bg-gray-100 px-1 rounded">151001</span></li>
            <li>Enter amount: <span className="font-mono bg-gray-100 px-1 rounded">${selectedBundle?.price || 0}</span></li>
            <li>Enter reference: <span className="font-mono bg-gray-100 px-1 rounded">PD-{auth.currentUser?.uid.substring(0, 6) || "TOKEN"}</span></li>
            <li>Confirm payment with your EcoCash PIN</li>
          </ol>
          <p className="text-sm font-semibold mt-2">Account Number: 0771 234 567</p>
        </div>
      ),
    },
    {
      id: "mukuru",
      name: "Mukuru",
      icon: <Coins className="h-5 w-5" />,
      instructions: (
        <div className="space-y-2 mt-2">
          <p className="text-sm">Follow these steps to complete your payment:</p>
          <ol className="list-decimal list-inside text-sm space-y-1">
            <li>Visit your nearest Mukuru agent location</li>
            <li>Provide the agent with the following reference code: <span className="font-mono bg-gray-100 px-1 rounded">PD-{auth.currentUser?.uid.substring(0, 8) || "PDTOKEN"}</span></li>
            <li>Pay the amount of <span className="font-mono bg-gray-100 px-1 rounded">${selectedBundle?.price || 0}</span></li>
            <li>Keep the receipt as proof of payment</li>
          </ol>
          <p className="text-sm font-semibold mt-2">Agent Network: All registered Mukuru agents nationwide</p>
        </div>
      ),
    },
    {
      id: "innbucks",
      name: "InnBucks",
      icon: <QrCode className="h-5 w-5" />,
      instructions: (
        <div className="space-y-2 mt-2">
          <p className="text-sm">Follow these steps to complete your payment:</p>
          <ol className="list-decimal list-inside text-sm space-y-1">
            <li>Open your InnBucks app</li>
            <li>Select "Scan to Pay"</li>
            <li>Scan the QR code below</li>
            <li>Enter the amount: <span className="font-mono bg-gray-100 px-1 rounded">${selectedBundle?.price || 0}</span></li>
            <li>Add the reference: <span className="font-mono bg-gray-100 px-1 rounded">PD-{auth.currentUser?.uid.substring(0, 6) || "TOKEN"}</span></li>
            <li>Confirm the payment</li>
          </ol>
          <div className="flex justify-center mt-3 mb-2">
            <div className="border-2 border-gray-300 p-2 rounded-md w-40 h-40 flex items-center justify-center">
              <p className="text-xs text-gray-500">QR Code Placeholder</p>
            </div>
          </div>
          <p className="text-sm font-semibold">InnBucks Wallet ID: IB1234567890</p>
        </div>
      ),
    },
  ];

  const handleBundleSelect = (bundle: TokenBundle) => {
    setSelectedBundle(bundle);
    // Automatically scroll to payment methods
    setTimeout(() => {
      document.getElementById("payment-methods")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handlePurchase = () => {
    if (!selectedBundle || !paymentMethod) {
      toast({
        title: "Error",
        description: "Please select a token bundle and payment method.",
        variant: "destructive",
      });
      return;
    }

    // This would normally write to Firestore:
    /* 
    const purchaseRef = collection(db, "tokenPurchases");
    addDoc(purchaseRef, {
      clientId: auth.currentUser.uid,
      tokens: selectedBundle.tokens,
      amount: selectedBundle.price,
      method: paymentMethod,
      status: 'pending',
      createdAt: serverTimestamp()
    });
    */

    // Show confirmation dialog
    setShowConfirmation(true);
    
    // Log the purchase request (for demo purposes)
    console.log("Token purchase request:", {
      clientId: auth.currentUser?.uid || "user-id",
      tokens: selectedBundle.tokens,
      amount: selectedBundle.price,
      method: paymentMethod,
      status: 'pending',
      createdAt: new Date().toISOString()
    });

    toast({
      title: "Purchase request submitted",
      description: "Follow the payment instructions to complete your purchase.",
    });
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
  };

  return (
    <Layout>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Buy Tokens</h1>
        
        {/* Current token balance */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium">Current Token Balance</h2>
            <p className="text-sm text-gray-600">Use tokens to post jobs and hire freelancers</p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-bold flex items-center">
              {currentBalance} <Coins className="ml-2 h-6 w-6 text-amber-500" />
            </span>
            <span className="text-xs text-gray-500">Platform Tokens</span>
          </div>
        </div>

        {/* Token bundles */}
        <h2 className="text-xl font-semibold mb-4">Select a Token Bundle</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {tokenBundles.map((bundle) => (
            <Card 
              key={bundle.id} 
              className={`hover:shadow-md transition-all ${selectedBundle?.id === bundle.id ? 'border-2 border-procloud-green' : ''}`}
            >
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-center">
                  <span>{bundle.tokens} Tokens</span>
                  {bundle.savings && <Badge variant="success" className="text-xs">{bundle.savings}</Badge>}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">${bundle.price}</p>
                <p className="text-sm text-gray-500">
                  ${(bundle.price / bundle.tokens).toFixed(2)} per token
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => handleBundleSelect(bundle)} 
                  className="w-full"
                  variant={selectedBundle?.id === bundle.id ? "default" : "outline"}
                >
                  {selectedBundle?.id === bundle.id ? (
                    <><Check className="mr-1" /> Selected</>
                  ) : (
                    "Select"
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Payment methods */}
        {selectedBundle && (
          <div id="payment-methods" className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Select a Payment Method</h2>
            <Card>
              <CardContent className="pt-6">
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="mb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <RadioGroupItem value={method.id} id={method.id} />
                        <Label htmlFor={method.id} className="flex items-center">
                          {method.icon}
                          <span className="ml-2">{method.name}</span>
                        </Label>
                      </div>
                      {paymentMethod === method.id && (
                        <div className="ml-6 border-l-2 pl-4 border-gray-200">
                          {method.instructions}
                        </div>
                      )}
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
              <CardFooter className="flex justify-end border-t pt-4">
                <Button onClick={handlePurchase} disabled={!paymentMethod}>
                  Purchase {selectedBundle.tokens} Tokens for ${selectedBundle.price}
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}

        {/* Confirmation dialog */}
        <Dialog open={showConfirmation} onOpenChange={handleConfirmationClose}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Purchase Request Submitted</DialogTitle>
              <DialogDescription className="pt-4">
                <p className="mb-4">
                  Your token purchase request has been submitted. Please follow the payment instructions 
                  to complete your purchase.
                </p>
                
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h3 className="font-medium text-sm mb-2">Order Summary</h3>
                  <div className="flex justify-between text-sm">
                    <span>Tokens:</span>
                    <span>{selectedBundle?.tokens}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Price:</span>
                    <span>${selectedBundle?.price}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Payment Method:</span>
                    <span className="capitalize">{paymentMethod}</span>
                  </div>
                  <div className="border-t mt-2 pt-2 flex justify-between font-medium">
                    <span>Reference Code:</span>
                    <span>PD-{auth.currentUser?.uid.substring(0, 6) || "TOKEN"}</span>
                  </div>
                </div>

                <p className="text-sm">
                  Your tokens will be credited to your account once your payment is confirmed. This usually 
                  takes 5-10 minutes during business hours.
                </p>
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end">
              <Button onClick={handleConfirmationClose}>Close</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Info box */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h2 className="text-lg font-medium mb-1">How tokens work</h2>
          <p className="text-sm text-gray-700">
            Tokens are used to access premium features on Proverb Digital. Clients use tokens to post jobs, 
            while freelancers earn tokens by completing projects. Tokens can be converted to real cash by freelancers.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default BuyTokens;
