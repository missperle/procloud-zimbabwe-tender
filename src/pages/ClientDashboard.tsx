
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useSearchParams } from "react-router-dom";
import DashboardOverview from "@/components/client/DashboardOverview";
import MyBriefs from "@/components/client/MyBriefs";
import ReviewProposals from "@/components/client/ReviewProposals";
import TokensWalletPage from "@/components/client/TokensWalletPage";
import AccountSettings from "@/components/client/AccountSettings";
import ChatWidget from "@/components/chat/ChatWidget";
import { useAuth } from "@/contexts/AuthContext";
import Profile from "@/components/client/Profile";

const ClientDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentUser, loading } = useAuth();

  // Set active tab based on URL query param or default to "overview"
  useEffect(() => {
    const tabFromUrl = searchParams.get("tab");
    if (tabFromUrl && ["overview", "briefs", "proposals", "wallet", "profile", "settings"].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    searchParams.set("tab", value);
    setSearchParams(searchParams);
  };

  // Redirect to login if user is not logged in and not in loading state
  useEffect(() => {
    if (!loading && !currentUser) {
      // In a real app, you might want to redirect to login here
      // navigate("/login");
      console.log("User not logged in - this would typically redirect to login");
    }
  }, [currentUser, loading, navigate]);

  if (loading) {
    return (
      <Layout>
        <div className="client-dashboard p-6">
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="text-center">
              <div className="h-8 w-8 border-4 border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500">Loading dashboard...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="client-dashboard p-6">
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-4">Client Dashboard</h1>
            <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="briefs">My Briefs</TabsTrigger>
              <TabsTrigger value="proposals">Proposals</TabsTrigger>
              <TabsTrigger value="wallet">Tokens</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="overview">
            <DashboardOverview />
          </TabsContent>
          
          <TabsContent value="briefs">
            <MyBriefs />
          </TabsContent>
          
          <TabsContent value="proposals">
            <ReviewProposals />
          </TabsContent>
          
          <TabsContent value="wallet">
            <TokensWalletPage />
          </TabsContent>
          
          <TabsContent value="profile">
            <Profile />
          </TabsContent>
          
          <TabsContent value="settings">
            <AccountSettings />
          </TabsContent>
        </Tabs>
        
        <ChatWidget />
      </div>
    </Layout>
  );
};

export default ClientDashboard;
