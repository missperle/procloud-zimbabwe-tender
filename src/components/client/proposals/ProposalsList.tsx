
import React, { useState } from "react";
import ProposalCard, { ProposalData } from "./ProposalCard";
import { Button } from "@/components/ui/button";
import { Award } from "lucide-react";

interface ProposalsListProps {
  proposals: ProposalData[];
  activeTab: string;
  onRequestCreator: (proposalId: string) => void;
  onMessageCreator: (proposalId: string) => void;
  recommendedProposals?: string[]; // IDs of recommended proposals
}

const ProposalsList = ({ 
  proposals, 
  activeTab, 
  onRequestCreator, 
  onMessageCreator,
  recommendedProposals = []
}: ProposalsListProps) => {
  const [showRecommendedOnly, setShowRecommendedOnly] = useState(false);
  
  // Filter proposals if showing recommended only
  const displayedProposals = showRecommendedOnly 
    ? proposals.filter(proposal => recommendedProposals.includes(proposal.id))
    : proposals;

  return (
    <>
      <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
        {activeTab === "all" 
          ? "All Proposals" 
          : (
            <>
              Submitted Proposals
              <Button 
                variant="outline" 
                size="sm" 
                className={`ml-2 text-indigo-600 border-indigo-200 hover:text-indigo-700 hover:bg-indigo-50 ${
                  showRecommendedOnly ? 'bg-indigo-50' : ''
                }`}
                onClick={() => setShowRecommendedOnly(!showRecommendedOnly)}
              >
                <Award className="h-4 w-4 mr-1" />
                {showRecommendedOnly ? "View All" : "View Recommended Only"}
              </Button>
            </>
          )
        }
      </h3>
      
      {displayedProposals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedProposals.map((proposal) => (
            <ProposalCard 
              key={proposal.id} 
              proposal={proposal} 
              onRequestCreator={onRequestCreator} 
              onMessageCreator={onMessageCreator}
              recommended={recommendedProposals.includes(proposal.id)} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">
            {showRecommendedOnly 
              ? "No recommended proposals available for this brief yet."
              : "No proposals available for this brief yet."}
          </p>
        </div>
      )}
    </>
  );
};

export default ProposalsList;
