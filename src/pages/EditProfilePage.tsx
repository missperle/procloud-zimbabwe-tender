
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import EditFreelancerProfile from "@/components/freelancers/EditFreelancerProfile";
import PortfolioManager from "@/components/freelancers/portfolio/PortfolioManager";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const EditProfilePage = () => {
  const { currentUser, loading } = useAuth();
  const { userRole } = useSubscription();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>("profile");

  // Parse query parameters to determine active tab
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab === "portfolio") {
      setActiveTab("portfolio");
    } else {
      setActiveTab("profile");
    }
  }, [location.search]);
  
  // Redirect if not logged in or not a freelancer
  useEffect(() => {
    if (!loading && (!currentUser || userRole !== "freelancer")) {
      navigate("/login");
    }
  }, [currentUser, loading, userRole, navigate]);

  // Show loading state while auth initializes
  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
          <div className="text-center">
            <div className="h-8 w-8 border-4 border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Edit Profile</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="profile">Profile Information</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <EditFreelancerProfile />
          </TabsContent>
          
          <TabsContent value="portfolio">
            <PortfolioManager />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default EditProfilePage;
