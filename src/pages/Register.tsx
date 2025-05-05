
import Layout from "@/components/layout/Layout";
import SignupForm from "@/components/auth/SignupForm";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useSearchParams } from "react-router-dom";

const Register = () => {
  const { currentUser } = useAuth();
  const [searchParams] = useSearchParams();
  const userType = searchParams.get('type') || 'freelancer';

  if (currentUser) {
    return <Navigate to="/dashboard" />;
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
