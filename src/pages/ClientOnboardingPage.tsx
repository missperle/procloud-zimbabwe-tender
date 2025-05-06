
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OnboardingWizard from '@/components/onboarding/OnboardingWizard';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { shouldRedirect } from '@/utils/authRedirect';
import { useToast } from '@/hooks/use-toast';

const ClientOnboardingPage = () => {
  const { currentUser, loading, userStatus } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user should be redirected
    const redirectPath = shouldRedirect(
      currentUser, 
      loading,
      userStatus?.role || null,
      userStatus?.onboardingCompleted || null,
      ['client']
    );
    
    if (redirectPath && redirectPath !== '/client-onboarding') {
      navigate(redirectPath);
    }
  }, [currentUser, loading, userStatus, navigate]);

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
