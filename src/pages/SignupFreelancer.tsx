
import Layout from "@/components/layout/Layout";
import SignupForm from "@/components/auth/SignupForm";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const SignupFreelancer = () => {
  const { currentUser, loading } = useAuth();
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  useEffect(() => {
    const checkUserStatus = async () => {
      if (!currentUser) {
        setCheckingStatus(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('users')
          .select('role, onboarding_completed')
          .eq('id', currentUser.id)
          .single();

        if (error) {
          console.error("Error checking user status:", error);
          setCheckingStatus(false);
          return;
        }

        if (data) {
          // Determine redirect path based on role and onboarding status
          if (data.role === 'freelancer') {
            setRedirectPath(data.onboarding_completed ? '/dashboard' : '/freelancer-onboarding');
          } else if (data.role === 'client') {
            setRedirectPath(data.onboarding_completed ? '/client-dashboard' : '/client-onboarding');
          }
        }
      } catch (error) {
        console.error("Error in checkUserStatus:", error);
      } finally {
        setCheckingStatus(false);
      }
    };

    if (!loading && currentUser) {
      checkUserStatus();
    } else if (!loading) {
      setCheckingStatus(false);
    }
  }, [currentUser, loading]);

  // Show loading state while checking
  if (loading || checkingStatus) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
          <div className="text-center">
            <div className="h-8 w-8 border-4 border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Loading authentication...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Redirect if user is already logged in
  if (currentUser && redirectPath) {
    return <Navigate to={redirectPath} />;
  }

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4">
        <Alert className="mb-6 max-w-md bg-blue-50 border-blue-200">
          <Info className="h-5 w-5 text-blue-600" />
          <AlertTitle className="text-blue-700">Creating a Creator Account</AlertTitle>
          <AlertDescription className="text-blue-600">
            As a creator, you'll be assigned a unique alias to ensure fair project selection based solely on 
            the quality of your work. Your real identity is only revealed to clients after being awarded a project.
          </AlertDescription>
        </Alert>
        
        <SignupForm initialUserType="freelancer" />
      </div>
    </Layout>
  );
};

export default SignupFreelancer;
