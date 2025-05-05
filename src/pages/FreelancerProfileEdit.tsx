
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import Layout from "@/components/layout/Layout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import FreelancerProfileForm from "@/components/freelancers/profile/FreelancerProfileForm";
import PortfolioManager from "@/components/freelancers/portfolio/PortfolioManager";

const FreelancerProfileEdit = () => {
  const { currentUser, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("profile");

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-64 mb-6" />
          <div className="grid gap-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Edit Your Freelancer Profile</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full max-w-md mb-8">
            <TabsTrigger value="profile">Profile Info</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <FreelancerProfileForm />
          </TabsContent>
          
          <TabsContent value="portfolio">
            <PortfolioManager />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default FreelancerProfileEdit;
