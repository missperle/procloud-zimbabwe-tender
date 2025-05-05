
import React from "react";
import ProposalCard, { ProposalData } from "./ProposalCard";

interface ProposalsListProps {
  proposals: ProposalData[];
  activeTab: string;
  onAccept: (proposalId: string) => void;
  onReject: (proposalId: string) => void;
}

const ProposalsList = ({ proposals, activeTab, onAccept, onReject }: ProposalsListProps) => {
  return (
    <>
      <h3 className="text-lg font-medium mb-4">
        {activeTab === "all" ? "All Proposals" : "Submitted Proposals"}
      </h3>
      
      {proposals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {proposals.map((proposal) => (
            <ProposalCard 
              key={proposal.id} 
              proposal={proposal} 
              onAccept={onAccept} 
              onReject={onReject} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No proposals available for this brief yet.</p>
        </div>
      )}
    </>
  );
};

export default ProposalsList;
