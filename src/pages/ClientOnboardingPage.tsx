
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OnboardingWizard from '@/components/onboarding/OnboardingWizard';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';

const ClientOnboardingPage = () => {
  const { currentUser, loading, userStatus } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if not logged in
    if (!loading && !currentUser) {
      navigate('/login');
      return;
    }

    // Check if the user has the correct role
    if (!loading && userStatus && userStatus.role !== 'client') {
      // If they're a freelancer, redirect to freelancer dashboard or onboarding
      if (userStatus.role === 'freelancer') {
        navigate(userStatus.onboardingCompleted ? '/dashboard' : '/freelancer-onboarding');
      } else {
        // If role is not set, redirect to signup page
        navigate('/register');
      }
      return;
    }

    // If client onboarding is completed, redirect to client dashboard
    if (!loading && userStatus && userStatus.role === 'client' && userStatus.onboardingCompleted) {
      navigate('/client-dashboard');
    }
  }, [currentUser, loading, navigate, userStatus]);

  if (loading) {
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
      <div className="container mx-auto">
        <OnboardingWizard />
      </div>
    </Layout>
  );
};

export default ClientOnboardingPage;
