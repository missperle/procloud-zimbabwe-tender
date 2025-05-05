
import Layout from "@/components/layout/Layout";
import SignupForm from "@/components/auth/SignupForm";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useSearchParams } from "react-router-dom";
import { useSubscription } from "@/contexts/SubscriptionContext";

const Register = () => {
  const { currentUser } = useAuth();
  const { userRole } = useSubscription();
  const [searchParams] = useSearchParams();
  const userType = searchParams.get('type') || 'freelancer';

  if (currentUser) {
    if (userRole === 'freelancer') {
      return <Navigate to="/freelancer-onboarding" />;
    }
    return <Navigate to="/client-dashboard" />;
  }

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-4">
        <SignupForm initialUserType={userType} />
      </div>
    </Layout>
  );
};

export default Register;
