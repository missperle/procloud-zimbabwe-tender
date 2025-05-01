
import { useState } from "react";
import { UserPlus, Copy, Check, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Referral } from "@/types/token";

interface ReferralWidgetProps {
  referral: Referral;
  totalRewards: number;
}

const ReferralWidget = ({ referral, totalRewards }: ReferralWidgetProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  const handleCopy = () => {
    navigator.clipboard.writeText(referral.code);
    setCopied(true);
    toast({
      title: "Referral code copied!",
      description: "Share it with potential clients to earn rewards."
    });
    
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleShare = () => {
    const subject = encodeURIComponent("Join Proverb Digital - Get Started with Free Tokens!");
    const body = encodeURIComponent(
      `Hi there,\n\nI've been using Proverb Digital for my freelancer needs and thought you might be interested too. Use my referral code ${referral.code} to sign up and we'll both receive bonus tokens!\n\nSign up here: https://proverb.digital/signup?ref=${referral.code}`
    );
    
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">Refer & Earn</CardTitle>
          <Badge variant="secondary" className="flex items-center gap-1">
            <UserPlus className="h-3 w-3" />
            {referral.usedBy.length} Referrals
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">
          Share your referral code with other clients. When they sign up and make their first token purchase,
          you'll both receive 50 bonus tokens!
        </p>
        
        <div className="mb-4">
          <div className="flex items-center space-x-2">
            <Input 
              value={referral.code} 
              readOnly
              className="font-medium text-center bg-gray-50"
            />
            <Button size="sm" onClick={handleCopy} variant="outline">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="bg-green-50 p-3 rounded-md flex items-center gap-3 w-full">
            <div className="bg-green-100 p-2 rounded-full">
              <Coins className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h4 className="font-medium text-sm">Total Rewards Earned</h4>
              <p className="text-xl font-bold">{totalRewards} tokens</p>
            </div>
          </div>
          
          <Button onClick={handleShare} className="w-full sm:w-auto">
            <Mail className="mr-2 h-4 w-4" />
            Share via Email
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReferralWidget;
