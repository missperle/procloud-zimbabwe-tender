
import { useState, useEffect } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DashboardTabs from "@/components/freelancer/dashboard/DashboardTabs";
import { calculateProfileCompletion } from "@/utils/profileUtils";

const FreelancerDashboard = () => {
  const { currentUser, loading: authLoading } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [freelancerAlias, setFreelancerAlias] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [profileData, setProfileData] = useState<any>(null);
  const [roleChecked, setRoleChecked] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkUserInfo = async () => {
      if (!currentUser) {
        setLoading(false);
        setRoleChecked(true);
        return;
      }
      
      try {
        console.log("FreelancerDashboard: Fetching user info for:", currentUser.id);
        
        // Get user role and alias
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role, alias')
          .eq('id', currentUser.id)
          .maybeSingle();
        
        if (userError) {
          console.error("FreelancerDashboard: Error fetching user role:", userError);
        } else if (userData) {
          console.log("FreelancerDashboard: User data retrieved:", userData);
          setUserRole(userData.role);
          setFreelancerAlias(userData.alias);
          
          // If user is not a freelancer, show toast and redirect
          if (userData.role !== "freelancer") {
            console.log("FreelancerDashboard: User is not a freelancer, role is:", userData.role);
            toast({
              title: "Access restricted",
              description: "You're being redirected to the appropriate dashboard for your account type.",
              variant: "default"
            });
            
            // Navigate based on role
            if (userData.role === "client") {
              navigate("/client-dashboard", { replace: true });
            }
          }
        }
        
        // Get freelancer profile
        const { data: profileData, error: profileError } = await supabase
          .from('freelancer_profiles')
          .select('*')
          .eq('id', currentUser.id)
          .maybeSingle();
          
        if (profileError && profileError.code !== "PGRST116") {
          console.error("FreelancerDashboard: Error fetching freelancer profile:", profileError);
        } else if (profileData) {
          console.log("FreelancerDashboard: Profile data retrieved:", profileData);
          setProfileData(profileData);
        }
      } catch (error) {
        console.error("FreelancerDashboard: Error in checkUserInfo:", error);
      } finally {
        setLoading(false);
        setRoleChecked(true);
      }
    };
    
    checkUserInfo();
  }, [currentUser, navigate, toast]);

  if (authLoading || loading) {
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
  
  // Redirect if not logged in
  if (!currentUser) {
    console.log("FreelancerDashboard: No current user, redirecting to login");
    return <Navigate to="/login" replace />;
  }
  
  // Add a stronger role check with explicit redirect
  if (roleChecked && userRole !== "freelancer" && userRole !== null) {
    console.log("FreelancerDashboard: User role is not freelancer, redirecting. Role:", userRole);
    return <Navigate to={userRole === "client" ? "/client-dashboard" : "/login"} replace />;
  }

  const profileCompletion = profileData ? calculateProfileCompletion(profileData) : 0;
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">Freelancer Dashboard</h1>
            {freelancerAlias && (
              <p className="text-gray-500">Your alias: {freelancerAlias}</p>
            )}
          </div>
          
          <Link to="/freelancer-profile-edit">
            <Button className="mt-4 md:mt-0">
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </Link>
        </div>
        
        <DashboardTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          profileCompletion={profileCompletion}
          profileData={profileData}
        />
      </div>
    </Layout>
  );
};

export default FreelancerDashboard;
