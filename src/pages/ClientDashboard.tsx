
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import DashboardOverview from "@/components/client/DashboardOverview";
import MyBriefs from "@/components/client/MyBriefs";
import ReviewProposals from "@/components/client/ReviewProposals";
import PaymentsPage from "@/components/client/PaymentsPage";
import AnalyticsPage from "@/components/client/AnalyticsPage";
import AccountSettings from "@/components/client/AccountSettings";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Coins } from "lucide-react";

const ClientDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <Layout>
      <div className="p-6 client-dashboard">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Client Dashboard</h1>
          <Button asChild>
            <Link to="/buy-tokens">
              <Coins className="mr-2 h-4 w-4" />
              Buy Tokens
            </Link>
          </Button>
        </div>
        
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
