
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import DashboardOverview from "@/components/client/DashboardOverview";
import MyBriefs from "@/components/client/MyBriefs";
import ReviewProposals from "@/components/client/ReviewProposals";
import PaymentsPage from "@/components/client/PaymentsPage";
import AnalyticsPage from "@/components/client/AnalyticsPage";
import AccountSettings from "@/components/client/AccountSettings";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const ClientDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Only redirect after auth has initialized
    if (!loading && !currentUser) {
      console.log("No authenticated user, redirecting to login");
      toast({
        title: "Access denied",
        description: "Please login to view the dashboard",
        variant: "destructive",
      });
      navigate("/login");
    } else if (currentUser) {
      console.log("Authenticated as:", currentUser.email);
    }
  }, [currentUser, loading, navigate, toast]);

  // Show loading state while auth is initializing
  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="text-center">
            <div className="h-8 w-8 border-4 border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Loading dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // If not logged in, don't render anything (the useEffect will redirect)
  if (!currentUser) return null;

  return (
    <Layout>
      <div className="p-6 client-dashboard">
        <h1 className="text-2xl font-bold mb-6">Client Dashboard</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="briefs">My Briefs</TabsTrigger>
            <TabsTrigger value="proposals">Review Proposals</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard">
            <DashboardOverview />
          </TabsContent>
          
          <TabsContent value="briefs">
            <MyBriefs />
          </TabsContent>
          
          <TabsContent value="proposals">
            <ReviewProposals />
          </TabsContent>
          
          <TabsContent value="payments">
            <PaymentsPage />
          </TabsContent>
          
          <TabsContent value="analytics">
            <AnalyticsPage />
          </TabsContent>
          
          <TabsContent value="account">
            <AccountSettings />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ClientDashboard;
