
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OnboardingWizard from '@/components/onboarding/OnboardingWizard';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

const ClientOnboardingPage = () => {
  const { currentUser, loading, userStatus, refreshUserStatus } = useAuth();
  const navigate = useNavigate();
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() => {
    // Force refresh user status on mount to ensure we have the latest data after signup
    if (currentUser && !loading) {
      refreshUserStatus().then(() => {
        setCheckingRole(false);
      });
    } else if (!loading) {
      setCheckingRole(false);
    }
  }, [currentUser, loading, refreshUserStatus]);

  useEffect(() => {
    // Don't redirect until checking role is complete
    if (checkingRole) return;
    
    // Redirect if not logged in
    if (!loading && !currentUser) {
      console.log("User not logged in, redirecting to login");
      navigate('/login');
      return;
    }

    // Check if the user has the correct role
    if (!loading && userStatus) {
      console.log("User status:", userStatus);
      
      if (userStatus.role !== 'client') {
        // If they're a freelancer, redirect to freelancer dashboard or onboarding
        if (userStatus.role === 'freelancer') {
          console.log("User is a freelancer, redirecting to appropriate page");
          navigate(userStatus.onboardingCompleted ? '/dashboard' : '/freelancer-onboarding');
        } else {
          // If role is not set, redirect to signup page
          console.log("User role not set, redirecting to register");
          navigate('/register');
        }
        return;
      }

      // If client onboarding is completed, redirect to client dashboard
      if (userStatus.role === 'client' && userStatus.onboardingCompleted) {
        console.log("Client onboarding already completed, redirecting to dashboard");
        navigate('/client-dashboard');
        return;
      }
    }
  }, [currentUser, loading, navigate, userStatus, checkingRole]);

  if (loading || checkingRole) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="h-8 w-8 border-4 border-t-accent rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <Info className="h-5 w-5 text-blue-600" />
          <AlertDescription className="text-blue-600">
            Welcome to the client onboarding process! Complete these steps to set up your account and start posting project briefs.
          </AlertDescription>
        </Alert>
        <OnboardingWizard />
      </div>
    </Layout>
  );
};

export default ClientOnboardingPage;
