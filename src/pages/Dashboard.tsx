
import { useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useNavigate } from "react-router-dom";
import ProfileSection from "@/components/dashboard/ProfileSection";
import JobsSection from "@/components/dashboard/JobsSection";
import LoadingState from "@/components/dashboard/LoadingState";

const Dashboard = () => {
  const { currentUser, loading } = useAuth();
  const { userRole } = useSubscription();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !currentUser) {
      navigate("/login");
    }
  }, [currentUser, loading, navigate]);

  // Redirect to role-specific dashboard if available
  useEffect(() => {
    if (!loading && currentUser) {
      if (userRole === "client") {
        navigate("/client-dashboard");
      }
    }
  }, [currentUser, loading, userRole, navigate]);

  if (loading) {
    return <LoadingState message="Loading..." />;
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <ProfileSection />
          <JobsSection />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
