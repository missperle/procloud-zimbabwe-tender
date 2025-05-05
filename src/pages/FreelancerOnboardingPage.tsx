
import Layout from "@/components/layout/Layout";
import FreelancerOnboarding from "@/components/freelancers/FreelancerOnboarding";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

const FreelancerOnboardingPage = () => {
  const { currentUser, loading } = useAuth();
  const { userRole } = useSubscription();
  const [alias, setAlias] = useState<string | null>(null);
  const [aliasLoading, setAliasLoading] = useState(true);
  
  useEffect(() => {
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
      }
    };

    fetchUserAlias();
  }, [currentUser]);

  // Show loading state while auth initializes
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

  // Redirect if not logged in
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  // Redirect if not a freelancer
  if (userRole !== 'freelancer') {
    return <Navigate to="/client-dashboard" />;
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
