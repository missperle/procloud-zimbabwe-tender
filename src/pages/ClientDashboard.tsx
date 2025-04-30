
import { useState } from "react";
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
import { useEffect } from "react";

const ClientDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Client Dashboard</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-8">
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
