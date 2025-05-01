
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleDollarSign, Megaphone, Star, TrendingUp, Award } from "lucide-react";

interface TokenUsageOption {
  title: string;
  description: string;
  tokenCost: string;
  icon: React.ReactNode;
  comingSoon?: boolean;
}

const TokenUsageOptions = () => {
  const options: TokenUsageOption[] = [
    {
      title: "Post a Job Brief",
      description: "Create a new project and receive proposals from freelancers",
      tokenCost: "50-100",
      icon: <CircleDollarSign className="h-5 w-5 text-indigo-600" />
    },
    {
      title: "Featured Placement",
      description: "Get your job brief highlighted in search results and the homepage",
      tokenCost: "25",
      icon: <Star className="h-5 w-5 text-amber-500" />
    },
    {
      title: "Boost Visibility",
      description: "Push your brief to the top of relevant search results for 24 hours",
      tokenCost: "15",
      icon: <TrendingUp className="h-5 w-5 text-green-500" />
    },
    {
      title: "Extend Duration",
      description: "Keep your brief active for an additional 7 days",
      tokenCost: "20",
      icon: <Megaphone className="h-5 w-5 text-blue-500" />
    },
    {
      title: "Freelancer Verification",
      description: "Verify a freelancer's background and qualifications",
      tokenCost: "35",
      icon: <Award className="h-5 w-5 text-purple-500" />
    }
  ];
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Token Usage Options</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {options.map((option, index) => (
            <div 
              key={index} 
              className={`flex items-center p-3 rounded-md border ${
                option.comingSoon ? "bg-gray-50 border-gray-200" : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
              }`}
            >
              <div className="p-2 bg-gray-50 rounded-full mr-3">
                {option.icon}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">
                    {option.title}
                    {option.comingSoon && (
                      <span className="ml-2 text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                        Coming Soon
                      </span>
                    )}
                  </h4>
                  <span className="text-sm font-medium">
                    {option.tokenCost} tokens
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{option.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TokenUsageOptions;
