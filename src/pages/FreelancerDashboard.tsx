import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

const FreelancerDashboard = () => {
  const { currentUser } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [freelancerAlias, setFreelancerAlias] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const checkUserRole = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('users')
          .select('role, alias')
          .eq('id', currentUser.id)
          .single();
        
        if (error) {
          console.error("Error fetching user role:", error);
          setUserRole(null);
        } else if (data) {
          setUserRole(data.role);
          setFreelancerAlias(data.alias);
        }
      } catch (error) {
        console.error("Error checking user role:", error);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkUserRole();
  }, [currentUser]);

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
  
  if (!currentUser || userRole !== "freelancer") {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-2">Freelancer Dashboard</h1>
        {freelancerAlias && (
          <p className="text-gray-500 mb-6">Your alias: {freelancerAlias}</p>
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="proposals">Proposals</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold mb-4">Welcome to your Freelancer Dashboard</h2>
              <p className="mb-4">
                Your account is set up successfully. Here you can manage your projects, submit proposals,
                track earnings, and update your profile.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="p-4 border rounded-md">
                  <h3 className="font-medium mb-2">Available Jobs</h3>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-gray-500">No jobs available yet</p>
                </div>
                
                <div className="p-4 border rounded-md">
                  <h3 className="font-medium mb-2">My Proposals</h3>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-gray-500">You haven't submitted any proposals yet</p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Other tab contents would go here - simplified for this example */}
          <TabsContent value="projects">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold mb-4">My Projects</h2>
              <p>You don't have any active projects yet.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="documents">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold mb-4">My Documents</h2>
              <p>This is where you can view and manage your uploaded documents.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default FreelancerDashboard;
