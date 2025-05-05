
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import RecommendedFreelancers from "./proposals/RecommendedFreelancers";
import ProposalsList from "./proposals/ProposalsList";
import { useProposalsData } from "@/hooks/useProposalsData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, MessageSquare, Info, Shield, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const ReviewProposals = () => {
  const { currentUser } = useAuth();
  const {
    briefs,
    activeTab,
    filteredProposals,
    recommendedFreelancers,
    recommendedProposals,
    loading,
    handleTabChange,
    handleRequestCreator,
    handleMessageCreator
  } = useProposalsData();

  if (!currentUser) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Review Proposals</h2>
        </div>
        
        <Card className="p-8 text-center">
          <h3 className="text-lg font-medium mb-2">Authentication Required</h3>
          <p className="text-gray-500 mb-4">
            Please log in to view proposals for your briefs.
          </p>
          <Link to="/login">
            <Button>
              Log In
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Review Proposals</h2>
        </div>
        
        <Card>
          <CardContent className="p-6 flex justify-center items-center min-h-[300px]">
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
              <p className="text-gray-500">Loading proposals...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Review Proposals</h2>
      </div>
      
      <Alert className="bg-blue-50 border-blue-200">
        <Shield className="h-5 w-5 text-blue-600" />
        <AlertDescription className="text-blue-600">
          Proverb Digital protects creator identities during the proposal stage. This ensures an unbiased selection process based on skill and quality, not personal connections.
        </AlertDescription>
      </Alert>
      
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="mb-6 flex flex-wrap">
          {briefs.map((brief) => (
            <TabsTrigger key={brief.id} value={brief.id}>
              {brief.name}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-0">
          {activeTab !== "all" && recommendedFreelancers.length > 0 && (
            <Card className="mb-8 bg-gradient-to-br from-indigo-50 to-white border-indigo-100">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="h-5 w-5 text-indigo-600" />
                  Proverb Digital Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-indigo-900 mb-4">
                  Based on your brief, our team has carefully selected these creators who are particularly well-suited for your project. These recommendations are based on their skills, experience, and past performance.
                </p>
                
                <Separator className="my-4" />
                
                {/* AI Recommended Freelancers Section */}
                <RecommendedFreelancers recommendations={recommendedFreelancers} />
              </CardContent>
            </Card>
          )}
          
          {/* Regular Proposals Section */}
          <ProposalsList 
            proposals={filteredProposals} 
            activeTab={activeTab}
            onRequestCreator={handleRequestCreator}
            onMessageCreator={handleMessageCreator}
            recommendedProposals={recommendedProposals}
          />
          
          {filteredProposals.length > 0 && (
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                <Info className="h-5 w-5 text-gray-500" />
                How to Select Creators
              </h3>
              <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-600">
                <li>Review all proposals carefully, paying attention to creator ratings and Proverb Digital recommendations.</li>
                <li>Use the message feature to ask any clarifying questions before making a decision.</li>
                <li>When you've found a creator you'd like to work with, click "Request this creator".</li>
                <li>Proverb Digital will facilitate the introduction and handle all contractual details to protect both parties.</li>
              </ol>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReviewProposals;
