
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, X } from "lucide-react";

type Freelancer = {
  id: string;
  name: string;
  avatar: string;
  rating: number;
};

export type ProposalData = {
  id: string;
  briefId: string;
  freelancer: Freelancer;
  bidAmount: string;
  text: string;
};

interface ProposalCardProps {
  proposal: ProposalData;
  onAccept: (proposalId: string) => void;
  onReject: (proposalId: string) => void;
}

const ProposalCard = ({ proposal, onAccept, onReject }: ProposalCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4 mb-4">
          <Avatar>
            <AvatarImage src={proposal.freelancer.avatar} alt={proposal.freelancer.name} />
            <AvatarFallback>
              {proposal.freelancer.name.substr(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{proposal.freelancer.name}</h3>
            <div className="flex items-center">
              <span className="text-xs text-amber-burst mr-1">★</span>
              <span className="text-xs">{proposal.freelancer.rating}/5</span>
            </div>
          </div>
          <div className="ml-auto font-bold text-indigo-ink">
            {proposal.bidAmount}
          </div>
        </div>
        
        <p className="text-sm text-gray-600 line-clamp-4 mb-4">
          {proposal.text}
        </p>
        
        <Button variant="link" className="px-0 text-xs">
          View Full Proposal
        </Button>
      </CardContent>
      
      <CardFooter className="bg-gray-50 p-4 flex justify-between">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onAccept(proposal.id)}
          className="text-green-600 hover:text-green-700 hover:bg-green-50"
        >
          <Check className="h-4 w-4 mr-1" />
          Accept
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onReject(proposal.id)}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <X className="h-4 w-4 mr-1" />
          Reject
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProposalCard;
