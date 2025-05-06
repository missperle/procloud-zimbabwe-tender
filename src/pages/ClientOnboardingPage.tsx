
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OnboardingWizard from '@/components/onboarding/OnboardingWizard';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const ClientOnboardingPage = () => {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!currentUser) return;

      try {
        const { data, error } = await supabase
          .from('users')
          .select('onboarding_completed, role')
          .eq('id', currentUser.id)
          .single();

        if (error) {
          console.error('Error checking onboarding status:', error);
          toast({
            title: "Error",
            description: "Failed to check your onboarding status.",
            variant: "destructive",
          });
          return;
        }

        if (data) {
          // If user is not a client, redirect to appropriate page
          if (data.role !== 'client') {
            navigate('/dashboard');
            return;
          }

          // If onboarding is already completed, redirect to client dashboard
          if (data.onboarding_completed) {
            navigate('/client-dashboard');
          }
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        toast({
          title: "Error",
          description: "An error occurred while checking your account status.",
          variant: "destructive",
        });
      }
    };

    if (!loading) {
      // If not logged in, redirect to login
      if (!currentUser) {
        navigate('/login');
      } else {
        checkOnboardingStatus();
      }
    }
  }, [currentUser, loading, navigate, toast]);

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
