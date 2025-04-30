
import Layout from "@/components/layout/Layout";
import LoginForm from "@/components/auth/LoginForm";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const Login = () => {
  const { currentUser, loading } = useAuth();

  // Show loading state while auth initializes
  if (loading) {
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

  // If user is already logged in, redirect to dashboard
  if (currentUser) {
    console.log("User already logged in, redirecting to dashboard");
    return <Navigate to="/client-dashboard" replace />;
  }

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-4 client-dashboard">
        <LoginForm />
      </div>
    </Layout>
  );
};

export default Login;
