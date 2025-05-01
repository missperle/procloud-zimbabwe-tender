
import { Coins } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface TokenBalanceWidgetProps {
  balance: number;
  totalPurchased?: number;
  lastUpdated?: Date;
}

const TokenBalanceWidget = ({ 
  balance, 
  totalPurchased = 0,
  lastUpdated 
}: TokenBalanceWidgetProps) => {
  // Calculate usage percentage if totalPurchased is provided
  const usagePercentage = totalPurchased > 0 
    ? Math.min(100, Math.round((balance / totalPurchased) * 100)) 
    : 0;

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
