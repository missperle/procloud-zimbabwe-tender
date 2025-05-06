
import { useState, useEffect } from 'react';
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Check, Coins, DollarSign } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { calculateLoyaltyTier, TOKEN_PACKAGES, getPricePerToken, formatCurrency } from '@/lib/tokenUtils';
import TokenBalanceWidget from '@/components/client/TokenBalanceWidget';
import RecentTokenTransactions from '@/components/client/RecentTokenTransactions';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import PaymentMethods from '@/components/client/PaymentMethods';

const BuyTokens = () => {
  const { currentUser } = useAuth();
  const { tokenBalance, refreshTokenBalance } = useSubscription();
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [loyaltyTier, setLoyaltyTier] = useState('Bronze');
  const [lifetimePurchased, setLifetimePurchased] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch user's token stats
  useEffect(() => {
    const fetchTokenData = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        
        // Fetch token data
        const { data: tokenData, error: tokenError } = await supabase
          .from('tokens')
          .select('lifetime_purchased')
          .eq('user_id', currentUser.id)
          .single();
          
        if (tokenError && tokenError.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
          console.error('Error fetching token data:', tokenError);
          throw tokenError;
        }
        
        if (tokenData) {
          setLifetimePurchased(tokenData.lifetime_purchased || 0);
          setLoyaltyTier(calculateLoyaltyTier(tokenData.lifetime_purchased || 0));
        }
        
        // Fetch recent transactions
        const { data: transactionData, error: transactionError } = await supabase
          .from('token_transactions')
          .select('*')
          .eq('user_id', currentUser.id)
          .order('created_at', { ascending: false })
          .limit(5);
          
        if (transactionError) {
          console.error('Error fetching transactions:', transactionError);
          throw transactionError;
        }
        
        setTransactions(transactionData || []);
        
      } catch (error) {
        console.error('Error fetching token data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your token data. Please refresh the page.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchTokenData();
  }, [currentUser, toast]);

  const handlePackageSelection = (pkg: any) => {
    setSelectedPackage(pkg);
    setShowPaymentDialog(true);
  };

  const handleSuccessfulPayment = () => {
    setShowPaymentDialog(false);
    refreshTokenBalance();
    toast({
      title: "Payment Initiated",
      description: "Your tokens will be credited to your account once payment is confirmed.",
    });
  };

  // Generate a reference code
  const generateReferenceCode = () => {
    return `TKN-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Buy Tokens</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            {/* Token Balance Widget */}
            <TokenBalanceWidget 
              balance={tokenBalance} 
              lifetimePurchased={lifetimePurchased}
            />
            
            {/* Recent Transactions */}
            <RecentTokenTransactions 
              transactions={transactions.map(t => ({
                id: t.id,
                type: t.type,
                amount: t.amount,
                date: new Date(t.created_at),
                description: t.description || '',
                status: t.payment_status
              }))}
            />
          </div>
          
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Select Token Package</CardTitle>
                <CardDescription>
                  Choose the token package that best fits your needs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="packages">
                  <TabsList className="mb-6">
                    <TabsTrigger value="packages">
                      <Coins className="w-4 h-4 mr-2" />
                      Token Packages
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="packages">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {TOKEN_PACKAGES.map((pkg) => {
                        const basePrice = pkg.price / 100;
                        const pricePerToken = getPricePerToken(loyaltyTier as any, pkg.id);
                        const hasDiscount = pricePerToken < (pkg.price / pkg.tokens);
                        
                        return (
                          <Card key={pkg.id} className={`${pkg.popular ? 'border-procloud-green' : ''}`}>
                            <CardContent className="p-6">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-semibold text-lg">{pkg.tokens} Tokens</h3>
                                  <p className="text-sm text-gray-500 mt-1">{pkg.description}</p>
                                </div>
                                {pkg.popular && (
                                  <span className="bg-procloud-green text-white text-xs px-2 py-1 rounded-full">
                                    Popular
                                  </span>
                                )}
                              </div>
                              
                              <div className="mt-4">
                                <div className="flex items-center">
                                  <span className="text-2xl font-bold">${basePrice.toFixed(2)}</span>
                                  {hasDiscount && (
                                    <span className="ml-2 text-sm bg-green-100 text-green-800 px-2 py-0.5 rounded">
                                      {loyaltyTier} Tier Discount
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-500 mt-1">
                                  {(basePrice / pkg.tokens).toFixed(3)} per token
                                </p>
                              </div>
                              
                              <Button 
                                className="w-full mt-4"
                                onClick={() => handlePackageSelection(pkg)}
                              >
                                <DollarSign className="h-4 w-4 mr-1" />
                                Buy Now
                              </Button>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="mt-8 bg-blue-50 p-4 rounded-md">
                  <h4 className="font-medium flex items-center">
                    <Coins className="h-4 w-4 mr-2 text-blue-600" />
                    What can I do with tokens?
                  </h4>
                  <ul className="mt-2 space-y-2">
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-blue-600 mr-2 mt-1 flex-shrink-0" />
                      <span className="text-sm">Post new briefs and projects</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-blue-600 mr-2 mt-1 flex-shrink-0" />
                      <span className="text-sm">Boost visibility of your projects</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-blue-600 mr-2 mt-1 flex-shrink-0" />
                      <span className="text-sm">Use premium AI features like image generation</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-blue-600 mr-2 mt-1 flex-shrink-0" />
                      <span className="text-sm">Pay for subscription plans</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Payment Dialog */}
        <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Buy {selectedPackage?.tokens} Tokens</DialogTitle>
            </DialogHeader>
            
            {selectedPackage && (
              <PaymentMethods
                amount={selectedPackage.price}
                onSuccessfulPayment={handleSuccessfulPayment}
                purchaseType="tokens"
                tokenAmount={selectedPackage.tokens}
                generateReferenceCode={generateReferenceCode}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default BuyTokens;
