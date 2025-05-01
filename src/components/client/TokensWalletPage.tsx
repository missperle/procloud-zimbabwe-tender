
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Coins, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import TokenBalanceWidget from "./TokenBalanceWidget";
import RecentTokenTransactions from "./RecentTokenTransactions";
import TokenUsageChart from "./TokenUsageChart";

const TokensWalletPage = () => {
  const [currentBalance, setCurrentBalance] = useState<number>(315);
  const [totalPurchased, setTotalPurchased] = useState<number>(450);
  const [lastUpdated, setLastUpdated] = useState<Date | undefined>(new Date());
  
  // In a real app, this would fetch data from Firestore
  useEffect(() => {
    // Simulate fetching token balance and history from Firestore
    // In a real app:
    // const fetchTokenData = async () => {
    //   const userDoc = doc(db, "users", auth.currentUser.uid);
    //   const userData = await getDoc(userDoc);
    //   if (userData.exists()) {
    //     setCurrentBalance(userData.data().tokenBalance || 0);
    //     setTotalPurchased(userData.data().totalTokensPurchased || 0);
    //     setLastUpdated(userData.data().lastBalanceUpdate?.toDate() || new Date());
    //   }
    // };
    // 
    // fetchTokenData();
    
    // This is just for demonstration
  }, []);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Token Wallet</h2>
        <Button asChild>
          <Link to="/client-dashboard?tab=tokens">
            <Plus className="mr-2 h-4 w-4" />
            Buy Tokens
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Token balance widget */}
        <div className="md:col-span-1">
          <TokenBalanceWidget 
            balance={currentBalance} 
            totalPurchased={totalPurchased}
            lastUpdated={lastUpdated}
          />
        </div>
        
        {/* Token usage chart */}
        <div className="md:col-span-2">
          <TokenUsageChart />
        </div>
      </div>
      
      {/* Recent transactions */}
      <div className="mt-6">
        <RecentTokenTransactions />
      </div>
      
      {/* Information box */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-4">
        <h3 className="text-md font-medium flex items-center">
          <Coins className="h-4 w-4 mr-2 text-blue-500" />
          About Tokens
        </h3>
        <p className="text-sm text-gray-700 mt-1">
          Tokens are the currency used on Proverb Digital. They can be used to post jobs, 
          boost visibility, and access premium features. You can purchase tokens in bundles
          or earn them through referrals.
        </p>
      </div>
    </div>
  );
};

export default TokensWalletPage;
