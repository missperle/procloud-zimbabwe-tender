
import Layout from "@/components/layout/Layout";
import FreelancerOnboarding from "@/components/freelancers/FreelancerOnboarding";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

const FreelancerOnboardingPage = () => {
  const { currentUser, loading, userStatus } = useAuth();
  const navigate = useNavigate();
  const [alias, setAlias] = useState<string | null>(null);
  const [aliasLoading, setAliasLoading] = useState(true);
  
  useEffect(() => {
    // Redirect if not logged in
    if (!loading && !currentUser) {
      console.log("User not logged in, redirecting to login");
      navigate("/login");
      return;
    }

    // Check if the user has the correct role
    if (!loading && userStatus) {
      console.log("User status:", userStatus);
      
      if (userStatus.role !== 'freelancer') {
        // If they're a client, redirect to client dashboard or onboarding
        if (userStatus.role === 'client') {
          console.log("User is a client, redirecting to appropriate page");
          navigate(userStatus.onboardingCompleted ? "/client-dashboard" : "/client-onboarding");
        } else {
          // If role is not set, redirect to signup page
          console.log("User role not set, redirecting to register");
          navigate("/register");
        }
        return;
      }
      
      // If freelancer onboarding is completed, redirect to freelancer dashboard
      if (userStatus.role === 'freelancer' && userStatus.onboardingCompleted) {
        console.log("Freelancer onboarding already completed, redirecting to dashboard");
        navigate('/dashboard');
        return;
      }
    }

    // Only fetch alias if user is logged in and is a freelancer
    const fetchUserAlias = async () => {
      if (currentUser) {
        try {
          const { data, error } = await supabase
            .from('users')
            .select('alias')
            .eq('id', currentUser.id)
            .single();
          
          if (error) throw error;
          setAlias(data.alias);
        } catch (error) {
          console.error("Error fetching alias:", error);
        } finally {
          setAliasLoading(false);
        }
      } else {
        setAliasLoading(false);
      }
    };

    fetchUserAlias();
  }, [currentUser, loading, navigate, userStatus]);

  // Show loading state while auth initializes or alias is loading
  if (loading || aliasLoading) {
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
      <div className="container mx-auto py-12 px-4">
        {alias && (
          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <Info className="h-5 w-5 text-blue-600" />
            <AlertTitle className="text-blue-700">
              Your Creator Alias: <span className="font-bold">{alias}</span>
            </AlertTitle>
            <AlertDescription className="text-blue-600">
              To maintain fairness in the selection process, your work will be presented to clients under this alias. 
              Your real identity will only be revealed after a project is awarded to you.
            </AlertDescription>
          </Alert>
        )}
        <FreelancerOnboarding />
      </div>
    </Layout>
  );
};

export default FreelancerOnboardingPage;
