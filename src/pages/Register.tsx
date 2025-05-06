
import Layout from "@/components/layout/Layout";
import SignupForm from "@/components/auth/SignupForm";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useSearchParams } from "react-router-dom";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Register = () => {
  const { currentUser } = useAuth();
  const { userRole } = useSubscription();
  const [searchParams] = useSearchParams();
  const userType = searchParams.get('type') || 'freelancer';
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [redirectPath, setRedirectPath] = useState('');

  useEffect(() => {
    const checkUserStatus = async () => {
      if (currentUser) {
        const { data, error } = await supabase
          .from('users')
          .select('role, onboarding_completed')
          .eq('id', currentUser.id)
          .single();

        if (!error && data) {
          if (data.role === 'freelancer') {
            setRedirectPath('/freelancer-onboarding');
          } else if (data.role === 'client') {
            setRedirectPath(data.onboarding_completed ? '/client-dashboard' : '/client-onboarding');
          }
          setShouldRedirect(true);
        }
      }
    };

    checkUserStatus();
  }, [currentUser]);

  if (shouldRedirect) {
    return <Navigate to={redirectPath} />;
  }

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4">
        {userType === 'freelancer' && (
          <Alert className="mb-6 max-w-md bg-blue-50 border-blue-200">
            <Info className="h-5 w-5 text-blue-600" />
            <AlertTitle className="text-blue-700">Creating a Creator Account</AlertTitle>
            <AlertDescription className="text-blue-600">
              As a creator, you'll be assigned a unique alias to ensure fair project selection based solely on 
              the quality of your work. Your real identity is only revealed to clients after being awarded a project.
            </AlertDescription>
          </Alert>
        )}
        
        {userType === 'client' && (
          <Alert className="mb-6 max-w-md bg-blue-50 border-blue-200">
            <Info className="h-5 w-5 text-blue-600" />
            <AlertTitle className="text-blue-700">Creating a Client Account</AlertTitle>
            <AlertDescription className="text-blue-600">
              All briefs you submit will be reviewed by Proverb Digital before being shared with our creators. 
              We protect your identity while ensuring you get the best talent for your projects.
            </AlertDescription>
          </Alert>
        )}
        
        <SignupForm initialUserType={userType} />
      </div>
    </Layout>
  );
};

export default Register;
