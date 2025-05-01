
import { Coins, Award, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { calculateLoyaltyTier, LOYALTY_TIERS, getNextTier } from "@/lib/tokenUtils";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TokenBalanceWidgetProps {
  balance: number;
  totalPurchased?: number;
  lastUpdated?: Date;
  lifetimePurchased?: number;
}

const TokenBalanceWidget = ({ 
  balance, 
  totalPurchased = 0,
  lastUpdated,
  lifetimePurchased = 0
}: TokenBalanceWidgetProps) => {
  // Calculate usage percentage if totalPurchased is provided
  const usagePercentage = totalPurchased > 0 
    ? Math.min(100, Math.round((balance / totalPurchased) * 100)) 
    : 0;

  const loyaltyTier = calculateLoyaltyTier(lifetimePurchased);
  const tierInfo = LOYALTY_TIERS[loyaltyTier];
  
  const nextTierInfo = getNextTier({
    currentBalance: balance,
    lifetimePurchased,
    lifetimeUsed: totalPurchased - balance,
    loyaltyTier
  });

  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-gray-700">Token Balance</h3>
            <p className="text-sm text-gray-500">Available to use on the platform</p>
          </div>
          <div className="bg-amber-50 p-2 rounded-full">
            <Coins className="h-6 w-6 text-amber-500" />
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between items-end">
            <span className="text-3xl font-bold">{balance}</span>
            <span className="text-sm text-gray-500">tokens</span>
          </div>
          
          {/* Loyalty tier badge */}
          <div className="mt-3 flex items-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge 
                    className="flex items-center gap-1 cursor-help" 
                    style={{ backgroundColor: tierInfo.color }}
                  >
                    <Award className="h-3 w-3" />
                    {tierInfo.name} Tier
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="w-64 p-2">
                    <h4 className="font-medium">{tierInfo.name} Tier Benefits</h4>
                    <ul className="mt-1 text-xs space-y-1">
                      {tierInfo.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <span className="text-green-500 mt-1">•</span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {nextTierInfo && (
              <span className="text-xs text-gray-500 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                {nextTierInfo.tokensNeeded} more tokens to {nextTierInfo.name}
              </span>
            )}
          </div>
          
          {totalPurchased > 0 && (
            <div className="mt-3">
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-gray-600">Usage</span>
                <span className="font-medium">{usagePercentage}%</span>
              </div>
              <Progress value={usagePercentage} className="h-2" />
              <p className="text-xs text-gray-500 mt-2">
                {balance} of {totalPurchased} tokens remaining
              </p>
            </div>
          )}
          
          {lastUpdated && (
            <p className="text-xs text-gray-400 mt-4">
              Last updated: {lastUpdated.toLocaleString()}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TokenBalanceWidget;
