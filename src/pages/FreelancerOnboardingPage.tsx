
import Layout from "@/components/layout/Layout";
import FreelancerOnboarding from "@/components/freelancers/FreelancerOnboarding";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Navigate } from "react-router-dom";

const FreelancerOnboardingPage = () => {
  const { currentUser, loading } = useAuth();
  const { userRole } = useSubscription();
  
  // Show loading state while auth initializes
  if (loading) {
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
        <FreelancerOnboarding />
      </div>
    </Layout>
  );
};

export default FreelancerOnboardingPage;
