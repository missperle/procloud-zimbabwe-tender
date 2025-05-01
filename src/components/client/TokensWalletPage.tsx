
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Coins, Plus, Trophy, UserPlus, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import TokenBalanceWidget from "./TokenBalanceWidget";
import RecentTokenTransactions from "./RecentTokenTransactions";
import TokenUsageChart from "./TokenUsageChart";
import AchievementsWidget from "./achievements/AchievementsWidget";
import ReferralWidget from "./referral/ReferralWidget";
import TokenROIWidget from "./analytics/TokenROIWidget";
import TokenUsageOptions from "./token/TokenUsageOptions";
import { Achievement, Referral } from "@/types/token";
import { ACHIEVEMENTS } from "@/lib/tokenUtils";

const TokensWalletPage = () => {
  const [currentTab, setCurrentTab] = useState<string>("overview");
  const [currentBalance, setCurrentBalance] = useState<number>(315);
  const [totalPurchased, setTotalPurchased] = useState<number>(450);
  const [lifetimePurchased, setLifetimePurchased] = useState<number>(650);
  const [lastUpdated, setLastUpdated] = useState<Date | undefined>(new Date());
  
  // Mock achievements data
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: "first_brief",
      name: "First Brief",
      description: "Post your first project brief",
      completed: true,
      icon: "star",
      reward: 10
    },
    {
      id: "five_briefs",
      name: "Regular Client",
      description: "Post 5 project briefs",
      completed: false,
      progress: { current: 3, target: 5 },
      icon: "star",
      reward: 25
    },
    {
      id: "first_hire",
      name: "First Hire",
      description: "Hire your first freelancer",
      completed: true,
      icon: "users",
      reward: 15
    },
    {
      id: "first_referral",
      name: "Spread the Word",
      description: "Refer your first client",
      completed: false,
      icon: "user-plus",
      reward: 50
    }
  ]);
  
  // Mock referral data
  const [referral, setReferral] = useState<Referral>({
    id: "ref-123",
    code: "PV-AB12CD",
    usedBy: ["user1", "user2"],
    rewards: 100,
    status: "active"
  });
  
  // Mock ROI data
  const [roiData, setRoiData] = useState([
    { month: "Jan", projectValue: 1200, tokenCost: 250 },
    { month: "Feb", projectValue: 1800, tokenCost: 300 },
    { month: "Mar", projectValue: 1500, tokenCost: 200 },
    { month: "Apr", projectValue: 2400, tokenCost: 350 },
    { month: "May", projectValue: 3200, tokenCost: 400 },
    { month: "Jun", projectValue: 2800, tokenCost: 380 },
  ]);
  
  // In a real app, this would fetch data from Firebase
  useEffect(() => {
    // Simulate fetching token balance and history from Firestore
    // This is just for demonstration
  }, []);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Token Wallet</h2>
        <Button asChild>
          <Link to="/buy-tokens">
            <Plus className="mr-2 h-4 w-4" />
            Buy Tokens
          </Link>
        </Button>
      </div>
      
      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="overview">
            <Coins className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="achievements">
            <Trophy className="h-4 w-4 mr-2" />
            Achievements
          </TabsTrigger>
          <TabsTrigger value="referrals">
            <UserPlus className="h-4 w-4 mr-2" />
            Referrals
          </TabsTrigger>
          <TabsTrigger value="roi">
            <TrendingUp className="h-4 w-4 mr-2" />
            ROI
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Token balance widget */}
            <div className="md:col-span-1">
              <TokenBalanceWidget 
                balance={currentBalance} 
                totalPurchased={totalPurchased}
                lastUpdated={lastUpdated}
                lifetimePurchased={lifetimePurchased}
              />
            </div>
            
            {/* Token usage chart */}
            <div className="md:col-span-2">
              <TokenUsageChart />
            </div>
          </div>
          
          {/* Token usage options */}
          <div className="mt-6">
            <TokenUsageOptions />
          </div>
          
          {/* Recent transactions */}
          <div className="mt-6">
            <RecentTokenTransactions />
          </div>
          
          {/* Information box */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-6">
            <h3 className="text-md font-medium flex items-center">
              <Coins className="h-4 w-4 mr-2 text-blue-500" />
              About Tokens
            </h3>
            <p className="text-sm text-gray-700 mt-1">
              Tokens are the currency used on Proverb Digital. They can be used to post jobs, 
              boost visibility, and access premium features. Purchase tokens in bundles
              or earn them through referrals and achievements.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="achievements">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Token balance widget (smaller) */}
            <div className="md:col-span-1">
              <TokenBalanceWidget 
                balance={currentBalance} 
                lifetimePurchased={lifetimePurchased}
              />
            </div>
            
            {/* Achievements widget */}
            <div className="md:col-span-2">
              <AchievementsWidget achievements={achievements} />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="referrals">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Token balance widget (smaller) */}
            <div className="md:col-span-1">
              <TokenBalanceWidget 
                balance={currentBalance} 
                lifetimePurchased={lifetimePurchased}
              />
            </div>
            
            {/* Referral widget */}
            <div className="md:col-span-2">
              <ReferralWidget referral={referral} totalRewards={100} />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="roi">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Token balance widget (smaller) */}
            <div className="md:col-span-1">
              <TokenBalanceWidget 
                balance={currentBalance} 
                lifetimePurchased={lifetimePurchased}
              />
            </div>
            
            {/* ROI widget */}
            <div className="md:col-span-2">
              <TokenROIWidget data={roiData} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TokensWalletPage;
