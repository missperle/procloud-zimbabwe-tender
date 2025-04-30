
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
import { CreditCard, Coins, QrCode, Check, AlertTriangle, InfoIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface TokenBundle {
  id: string;
  tokens: number;
  price: number;
  savings?: string;
  commission: number;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  instructions: React.ReactNode;
}

interface PurchaseHistory {
  today: number;
  total: number;
  lastPurchase: Date | null;
}

const MAX_DAILY_PURCHASES = 2;
const COMMISSION_RATE = 0.05; // 5%

const BuyTokens = () => {
  const [currentBalance, setCurrentBalance] = useState<number>(100); // Placeholder - would fetch from Firebase
  const [selectedBundle, setSelectedBundle] = useState<TokenBundle | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [confirmPurchase, setConfirmPurchase] = useState<boolean>(false);
  const [purchaseHistory, setPurchaseHistory] = useState<PurchaseHistory>({
    today: 0,
    total: 0,
    lastPurchase: null
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  // High-value token bundle options
  const tokenBundles: TokenBundle[] = [
    { 
      id: "standard", 
      tokens: 100, 
      price: 1000,
      commission: 1000 * COMMISSION_RATE
    },
    { 
      id: "premium", 
      tokens: 250, 
      price: 2400, 
      savings: "4% savings",
      commission: 2400 * COMMISSION_RATE 
    },
    { 
      id: "enterprise", 
      tokens: 500, 
      price: 4500, 
      savings: "10% savings",
      commission: 4500 * COMMISSION_RATE 
    },
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
            <li>Enter amount: <span className="font-mono bg-gray-100 px-1 rounded">${selectedBundle ? (selectedBundle.price + selectedBundle.commission).toFixed(2) : 0}</span></li>
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
            <li>Pay the amount of <span className="font-mono bg-gray-100 px-1 rounded">${selectedBundle ? (selectedBundle.price + selectedBundle.commission).toFixed(2) : 0}</span></li>
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
            <li>Enter the amount: <span className="font-mono bg-gray-100 px-1 rounded">${selectedBundle ? (selectedBundle.price + selectedBundle.commission).toFixed(2) : 0}</span></li>
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

  // Simulate fetching purchase history from Firestore
  useEffect(() => {
    // In a real app, this would be a Firestore query:
    // const today = new Date();
    // today.setHours(0, 0, 0, 0);
    // 
    // const purchasesRef = collection(db, "tokenPurchases");
    // const purchasesQuery = query(
    //   purchasesRef,
    //   where("clientId", "==", auth.currentUser.uid),
    //   where("createdAt", ">=", today),
    //   orderBy("createdAt", "desc")
    // );
    // 
    // getDocs(purchasesQuery).then((snapshot) => {
    //   setPurchaseHistory({
    //     today: snapshot.docs.length,
    //     total: snapshot.docs.length, // would need a separate query for all-time
    //     lastPurchase: snapshot.docs[0]?.data().createdAt.toDate() || null
    //   });
    // });

    // For demo purposes:
    setPurchaseHistory({
      today: 1, // Simulate one purchase already made today
      total: 5,
      lastPurchase: new Date(Date.now() - 3600000) // 1 hour ago
    });
  }, []);

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

    // Check purchase limits
    if (purchaseHistory.today >= MAX_DAILY_PURCHASES) {
      toast({
        title: "Daily Purchase Limit Reached",
        description: `You can only purchase ${MAX_DAILY_PURCHASES} bundles per day.`,
        variant: "destructive",
      });
      return;
    }

    // Show confirmation dialog
    setConfirmPurchase(true);
  };

  const confirmPurchaseAction = () => {
    setConfirmPurchase(false);

    // This would normally write to Firestore:
    /* 
    const purchaseRef = collection(db, "tokenPurchases");
    addDoc(purchaseRef, {
      clientId: auth.currentUser.uid,
      bundleTokens: selectedBundle.tokens,
      grossAmount: selectedBundle.price,
      commissionAmount: selectedBundle.commission,
      netTokens: selectedBundle.tokens,
      method: paymentMethod,
      status: 'pending',
      createdAt: serverTimestamp()
    });
    */

    // Show payment instructions dialog
    setShowConfirmation(true);
    
    // Log the purchase request (for demo purposes)
    console.log("Token purchase request:", {
      clientId: auth.currentUser?.uid || "user-id",
      bundleTokens: selectedBundle?.tokens,
      grossAmount: selectedBundle?.price,
      commissionAmount: selectedBundle?.commission,
      netTokens: selectedBundle?.tokens,
      method: paymentMethod,
      status: 'pending',
      createdAt: new Date().toISOString()
    });

    // Update purchase history for demo
    setPurchaseHistory(prev => ({
      ...prev,
      today: prev.today + 1,
      total: prev.total + 1,
      lastPurchase: new Date()
    }));

    toast({
      title: "Purchase request submitted",
      description: "Follow the payment instructions to complete your purchase.",
    });
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
  };

  const canPurchase = purchaseHistory.today < MAX_DAILY_PURCHASES;

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

        {/* Purchase limits warning */}
        {purchaseHistory.today > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-start">
            <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-amber-800">Purchase Limits</h3>
              <p className="text-sm text-amber-700">
                You've made {purchaseHistory.today} of {MAX_DAILY_PURCHASES} allowed purchases today.
                {purchaseHistory.today >= MAX_DAILY_PURCHASES && " You've reached your daily limit."}
              </p>
              {purchaseHistory.lastPurchase && (
                <p className="text-xs text-amber-600 mt-1">
                  Last purchase: {purchaseHistory.lastPurchase.toLocaleString()}
                </p>
              )}
            </div>
          </div>
        )}

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
                <div className="space-y-2">
                  <p className="text-3xl font-bold">${bundle.price.toLocaleString()}</p>
                  <div className="text-sm text-gray-500 space-y-1">
                    <div className="flex justify-between">
                      <span>Base price:</span>
                      <span>${bundle.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Commission ({(COMMISSION_RATE * 100)}%):</span>
                      <span>${bundle.commission.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-medium border-t pt-1 mt-1">
                      <span>Total:</span>
                      <span>${(bundle.price + bundle.commission).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => handleBundleSelect(bundle)} 
                  className="w-full"
                  variant={selectedBundle?.id === bundle.id ? "default" : "outline"}
                  disabled={!canPurchase}
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

        {!canPurchase && (
          <div className="mb-6 text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-500">
              You've reached your daily purchase limit of {MAX_DAILY_PURCHASES} bundles.
              Try again tomorrow or contact support for special arrangements.
            </p>
          </div>
        )}

        {/* Payment methods */}
        {selectedBundle && canPurchase && (
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
                  Purchase {selectedBundle.tokens} Tokens
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}

        {/* Purchase confirmation dialog */}
        <Dialog open={confirmPurchase} onOpenChange={setConfirmPurchase}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Your Purchase</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <div className="rounded-lg bg-gray-50 p-4 mb-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Bundle:</span>
                    <span>{selectedBundle?.tokens} Tokens</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Base Price:</span>
                    <span>${selectedBundle?.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Commission ({COMMISSION_RATE * 100}%):</span>
                    <span>${selectedBundle?.commission.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium border-t border-gray-200 pt-2 mt-1">
                    <span>Total Amount:</span>
                    <span>${selectedBundle ? (selectedBundle.price + selectedBundle.commission).toLocaleString() : 0}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start mb-4">
                <InfoIcon className="text-blue-500 h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-sm">
                  You will be charged <strong>${selectedBundle?.price.toLocaleString()}</strong> + 
                  <strong> ${selectedBundle?.commission.toFixed(2)}</strong> commission = 
                  <strong> ${selectedBundle ? (selectedBundle.price + selectedBundle.commission).toLocaleString() : 0}</strong>. 
                  You will receive <strong>{selectedBundle?.tokens} tokens</strong>.
                </p>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setConfirmPurchase(false)}>
                Cancel
              </Button>
              <Button onClick={confirmPurchaseAction}>
                Proceed with Purchase
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Payment instructions dialog */}
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
                    <span>Base Price:</span>
                    <span>${selectedBundle?.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Commission ({COMMISSION_RATE * 100}%):</span>
                    <span>${selectedBundle?.commission.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Total Amount:</span>
                    <span>${selectedBundle ? (selectedBundle.price + selectedBundle.commission).toLocaleString() : 0}</span>
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
