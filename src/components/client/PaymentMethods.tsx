
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  CreditCard, 
  Smartphone, 
  DollarSign, 
  Landmark, 
  AlertCircle, 
  Copy, 
  Check, 
  Loader2,
  Coins
} from "lucide-react";
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { formatCurrency } from '@/lib/tokenUtils';

interface PaymentMethodsProps {
  amount: number;
  onSuccessfulPayment: () => void;
  purchaseType: 'subscription' | 'tokens';
  tokenAmount?: number;
  planId?: string;
  generateReferenceCode?: () => string;
}

const PaymentMethods = ({ 
  amount, 
  onSuccessfulPayment, 
  purchaseType,
  tokenAmount = 0,
  planId = '',
  generateReferenceCode = () => `PV-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
}: PaymentMethodsProps) => {
  const [activeTab, setActiveTab] = useState<string>('paynow');
  const [loading, setLoading] = useState<boolean>(false);
  const [referenceCode, setReferenceCode] = useState<string>(generateReferenceCode());
  const [copied, setCopied] = useState<boolean>(false);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const { refreshSubscription, refreshTokenBalance, tokenBalance } = useSubscription();
  
  // Handle copy reference code
  const copyReferenceCode = () => {
    navigator.clipboard.writeText(referenceCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Handle token payment
  const payWithTokens = async () => {
    if (!currentUser) return;
    
    if (tokenBalance < tokenAmount) {
      toast({
        title: "Insufficient Tokens",
        description: "You don't have enough tokens for this purchase.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      if (purchaseType === 'subscription') {
        // Create subscription with token payment
        const { error } = await supabase
          .from('subscriptions')
          .upsert({
            userid: currentUser.id,
            plan_id: planId,
            status: 'active', // Activate immediately since paid with tokens
            plan: planId,
            paymentmethod: 'tokens',
            startdate: new Date().toISOString()
          }, { onConflict: 'userid' });
          
        if (error) throw error;
        
        // Record token usage
        await supabase
          .from('token_transactions')
          .insert({
            user_id: currentUser.id,
            amount: -tokenAmount,
            type: 'usage',
            description: `Subscription payment for ${planId} plan`,
            payment_status: 'completed'
          });
          
        // Update token balance
        await supabase
          .from('tokens')
          .update({ 
            balance: tokenBalance - tokenAmount,
            lifetime_used: supabase.rpc('increment', { x: tokenAmount })
          })
          .eq('user_id', currentUser.id);
          
        toast({
          title: "Payment Successful",
          description: `Your subscription has been activated using ${tokenAmount} tokens.`,
        });
        
        // Refresh subscription data
        await refreshSubscription();
      }
      
      // Refresh token balance
      await refreshTokenBalance();
      
      // Call the success callback
      onSuccessfulPayment();
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle PayNow payment
  const initiatePaynowPayment = async () => {
    if (!currentUser || !phoneNumber) {
      toast({
        title: "Information Required",
        description: "Please enter your phone number to proceed with payment.",
        variant: "destructive",
      });
      return;
    }
    
    if (!phoneNumber.match(/^(\+263|0)7[1-9]\d{7}$/)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid Zimbabwean phone number.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      if (purchaseType === 'tokens') {
        // Record token purchase request
        await supabase
          .from('token_transactions')
          .insert({
            user_id: currentUser.id,
            amount: tokenAmount,
            type: 'purchase',
            description: `Token purchase - ${tokenAmount} tokens`,
            reference_code: referenceCode,
            payment_method: 'paynow',
            payment_status: 'pending'
          });
      } else {
        // Create or update subscription record
        await supabase
          .from('subscriptions')
          .upsert({
            userid: currentUser.id,
            plan_id: planId,
            status: 'pending',
            plan: planId,
            paymentmethod: 'paynow',
            reference_code: referenceCode
          }, { onConflict: 'userid' });
      }
      
      toast({
        title: "Payment Initiated",
        description: "Please complete the payment using your mobile money wallet. Your purchase will be activated once payment is confirmed.",
      });
      
      // Generate a new reference code for next payment
      setReferenceCode(generateReferenceCode());
    } catch (error) {
      console.error('Payment initiation error:', error);
      toast({
        title: "Error",
        description: "Failed to initiate payment. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="paynow" className="flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            PayNow
          </TabsTrigger>
          <TabsTrigger value="bank" className="flex items-center gap-2">
            <Landmark className="h-4 w-4" />
            Bank Transfer
          </TabsTrigger>
          {purchaseType === 'subscription' && tokenBalance >= tokenAmount && (
            <TabsTrigger value="tokens" className="flex items-center gap-2">
              <Coins className="h-4 w-4" />
              Pay with Tokens
            </TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="paynow">
          <Card className="p-6">
            <h3 className="font-medium text-lg mb-4">Pay with PayNow</h3>
            
            <div className="mb-6">
              <p className="text-gray-500 mb-2">
                Complete your payment by sending ${(amount / 100).toFixed(2)} to our PayNow number.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-md p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium">Reference Code:</p>
                  <p className="text-xl font-bold font-mono mt-1">{referenceCode}</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={copyReferenceCode} 
                  className="whitespace-nowrap"
                >
                  {copied ? (
                    <Check className="h-4 w-4 mr-1" />
                  ) : (
                    <Copy className="h-4 w-4 mr-1" />
                  )}
                  {copied ? 'Copied' : 'Copy Code'}
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-1">
                  Your Mobile Number (EcoCash, OneMoney, Telecash)
                </label>
                <Input
                  id="phone"
                  placeholder="+263 7X XXX XXXX"
                  value={phoneNumber}
                  onChange={e => setPhoneNumber(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  We'll use this to match your payment
                </p>
              </div>
              
              <Alert variant="default" className="bg-blue-50 border-blue-200">
                <AlertCircle className="h-4 w-4 text-blue-500" />
                <AlertDescription className="text-blue-700">
                  After clicking "Pay Now", please send exactly ${(amount / 100).toFixed(2)} to our PayNow number with the reference code above.
                </AlertDescription>
              </Alert>
              
              <Button 
                className="w-full" 
                onClick={initiatePaynowPayment}
                disabled={loading || !phoneNumber}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <DollarSign className="h-4 w-4 mr-2" />
                    Pay ${(amount / 100).toFixed(2)} Now
                  </>
                )}
              </Button>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="bank">
          <Card className="p-6">
            <h3 className="font-medium text-lg mb-4">Pay via Bank Transfer</h3>
            
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <h4 className="font-medium mb-2">Bank Details:</h4>
                <ul className="space-y-2">
                  <li><strong>Bank:</strong> First Capital Bank</li>
                  <li><strong>Account Name:</strong> Proverb Digital</li>
                  <li><strong>Account Number:</strong> 2150264123</li>
                  <li><strong>Branch:</strong> Harare</li>
                  <li><strong>Reference:</strong> <span className="font-mono font-medium">{referenceCode}</span></li>
                </ul>
              </div>
              
              <Alert variant="default" className="bg-yellow-50 border-yellow-200">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-700">
                  Please include your reference code <strong>{referenceCode}</strong> in the transfer description. Your purchase will be activated within 1 business day after we confirm your payment.
                </AlertDescription>
              </Alert>
              
              <div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={copyReferenceCode}
                >
                  {copied ? (
                    <Check className="h-4 w-4 mr-2" />
                  ) : (
                    <Copy className="h-4 w-4 mr-2" />
                  )}
                  {copied ? 'Reference Copied' : 'Copy Reference Code'}
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        {purchaseType === 'subscription' && (
          <TabsContent value="tokens">
            <Card className="p-6">
              <h3 className="font-medium text-lg mb-4">Pay with Tokens</h3>
              
              <div className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">Current Token Balance:</p>
                      <p className="text-xl font-bold mt-1">{tokenBalance} tokens</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">Required Tokens:</p>
                      <p className="text-xl font-bold mt-1">{tokenAmount} tokens</p>
                    </div>
                  </div>
                </div>
                
                {tokenBalance >= tokenAmount ? (
                  <Alert variant="default" className="bg-green-50 border-green-200">
                    <Check className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-700">
                      You have enough tokens to make this purchase. Click below to use your tokens for this subscription.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert variant="default" className="bg-red-50 border-red-200">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-700">
                      You don't have enough tokens for this purchase. You need {tokenAmount - tokenBalance} more tokens.
                    </AlertDescription>
                  </Alert>
                )}
                
                <Button 
                  className="w-full" 
                  onClick={payWithTokens}
                  disabled={loading || tokenBalance < tokenAmount}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Coins className="h-4 w-4 mr-2" />
                      Pay with {tokenAmount} Tokens
                    </>
                  )}
                </Button>
                
                <p className="text-xs text-center text-gray-500">
                  Subscription will be activated immediately when using tokens.
                </p>
              </div>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default PaymentMethods;
