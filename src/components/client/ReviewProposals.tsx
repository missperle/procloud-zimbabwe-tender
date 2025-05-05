
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import RecommendedFreelancers from "./proposals/RecommendedFreelancers";
import ProposalsList from "./proposals/ProposalsList";
import { useProposalsData } from "@/hooks/useProposalsData";

const ReviewProposals = () => {
  const {
    briefs,
    activeTab,
    filteredProposals,
    recommendedFreelancers,
    handleTabChange,
    handleAccept,
    handleReject
  } = useProposalsData();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Review Proposals</h2>
      
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="mb-6 flex flex-wrap">
          {briefs.map((brief) => (
            <TabsTrigger key={brief.id} value={brief.id}>
              {brief.name}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-0">
          {/* AI Recommended Freelancers Section */}
          {activeTab !== "all" && (
            <RecommendedFreelancers recommendations={recommendedFreelancers} />
          )}
          
          {/* Regular Proposals Section */}
          <ProposalsList 
            proposals={filteredProposals} 
            activeTab={activeTab}
            onAccept={handleAccept}
            onReject={handleReject}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReviewProposals;
