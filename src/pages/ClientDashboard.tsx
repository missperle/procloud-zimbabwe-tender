
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import DashboardOverview from "@/components/client/DashboardOverview";
import MyBriefs from "@/components/client/MyBriefs";
import ReviewProposals from "@/components/client/ReviewProposals";
import PaymentsPage from "@/components/client/PaymentsPage";
import AnalyticsPage from "@/components/client/AnalyticsPage";
import AccountSettings from "@/components/client/AccountSettings";
import TokensWalletPage from "@/components/client/TokensWalletPage";
import SubscriptionPage from "@/components/client/SubscriptionPage";
import BuyTokensPage from "@/pages/BuyTokens";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Coins, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const ClientDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const location = useLocation();

  useEffect(() => {
    // Check for tab parameter in URL
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab');
    if (tabParam && ['dashboard', 'briefs', 'proposals', 'payments', 'analytics', 'tokens', 'subscription', 'account'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [location]);
  
  // Mock notification count - in a real app, this would come from Firestore
  useEffect(() => {
    // Simulate fetching notification count
    // In a real app, this would be a Firestore query:
    // const notificationsRef = collection(db, "notifications");
    // const q = query(notificationsRef, 
    //                 where("userId", "==", auth.currentUser.uid),
    //                 where("read", "==", false));
    // const unreadSnapshot = await getDocs(q);
    // setUnreadNotifications(unreadSnapshot.size);
    
    // For demo purposes:
    setUnreadNotifications(3);
  }, []);

  return (
    <Layout>
      <div className="p-6 client-dashboard">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Client Dashboard</h1>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
                <Bell className="h-5 w-5" />
                {unreadNotifications > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {unreadNotifications}
                  </Badge>
                )}
              </Button>
            </div>
            <Button asChild>
              <Link to="/client-dashboard?tab=tokens">
                <Coins className="mr-2 h-4 w-4" />
                Buy Tokens
              </Link>
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-8 gap-2 mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="briefs">My Briefs</TabsTrigger>
            <TabsTrigger value="proposals">Review Proposals</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="tokens">Tokens</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
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
          
          <TabsContent value="tokens">
            <div className="max-w-4xl mx-auto">
              <TokensWalletPage />
            </div>
          </TabsContent>
          
          <TabsContent value="subscription">
            <div className="max-w-4xl mx-auto">
              <SubscriptionPage />
            </div>
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
