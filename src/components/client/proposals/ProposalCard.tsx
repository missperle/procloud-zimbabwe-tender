
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  ThumbsUp, 
  Award, 
  MessageSquare, 
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type Freelancer = {
  id: string;
  alias: string;
  rating: number;
  skills: string[];
  successRate: number;
  projectsCompleted: number;
  verified: boolean;
};

export type ProposalData = {
  id: string;
  briefId: string;
  freelancer: Freelancer;
  bidAmount: string;
  text: string;
  timeline: string;
  adminReview?: {
    score: number;
    comment: string;
  };
};

interface ProposalCardProps {
  proposal: ProposalData;
  onRequestCreator: (proposalId: string) => void;
  onMessageCreator: (proposalId: string) => void;
  recommended?: boolean;
}

const ProposalCard = ({ 
  proposal, 
  onRequestCreator, 
  onMessageCreator,
  recommended = false
}: ProposalCardProps) => {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <Card className={`overflow-hidden hover:shadow-md transition-shadow ${
      recommended ? 'border-2 border-indigo-200' : ''
    }`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {proposal.freelancer.verified && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
                      <Shield className="h-3 w-3 mr-1" />
                      Verified Creator
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs max-w-xs">This creator has been verified by Proverb Digital and has a proven track record of quality work.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {recommended && (
              <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200">
                <Award className="h-3 w-3 mr-1" />
                Recommended
              </Badge>
            )}
            <div className="flex items-center">
              <span className="text-amber-500 mr-1">★</span>
              <span className="text-sm">{proposal.freelancer.rating}/5</span>
            </div>
          </div>
          <div className="font-bold text-indigo-700">
            {proposal.bidAmount}
          </div>
        </div>
        
        <div className="flex justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <ThumbsUp className="h-3.5 w-3.5 text-green-600 mr-1" />
            <span>{proposal.freelancer.successRate}% success rate</span>
          </div>
          <div>
            {proposal.timeline} timeline
          </div>
        </div>
        
        <p className={cn(
          "text-sm text-gray-600 mb-4",
          !expanded && "line-clamp-3"
        )}>
          {proposal.text}
        </p>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="px-0 text-xs flex items-center"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <>
              <ChevronUp className="h-3 w-3 mr-1" />
              Show less
            </>
          ) : (
            <>
              <ChevronDown className="h-3 w-3 mr-1" />
              Show more
            </>
          )}
        </Button>
        
        {proposal.adminReview && (
          <div className="mt-4 border-t pt-3">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-green-100 text-green-800">
                Proverb Digital Review
              </Badge>
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span 
                    key={i} 
                    className={cn(
                      "text-lg", 
                      i < proposal.adminReview.score ? "text-amber-500" : "text-gray-200"
                    )}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            <p className="text-xs text-gray-600 italic">
              "{proposal.adminReview.comment}"
            </p>
          </div>
        )}
        
        <div className="mt-4 text-xs text-gray-400 flex items-center">
          <Shield className="h-3.5 w-3.5 mr-1" />
          Creator identity protected by Proverb Digital
        </div>
      </CardContent>
      
      <CardFooter className="bg-gray-50 p-4 flex justify-between">
        <Button 
          onClick={() => onRequestCreator(proposal.id)}
          className="text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100"
        >
          Request this creator
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onMessageCreator(proposal.id)}
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
        >
          <MessageSquare className="h-4 w-4 mr-1" />
          Message
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProposalCard;
