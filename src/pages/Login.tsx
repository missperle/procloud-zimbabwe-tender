
import Layout from "@/components/layout/Layout";
import LoginForm from "@/components/auth/LoginForm";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CreditCard, Coins, Briefcase, UserPlus } from "lucide-react";
import { useEffect } from "react";

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

  // If user is already logged in, redirect to appropriate dashboard
  if (currentUser) {
    console.log("User already logged in, redirecting to dashboard");
    return <Navigate to="/client-dashboard" replace />;
  }

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4 client-dashboard">
        <LoginForm />
        
        <div className="mt-8 text-center">
          <p className="mb-2 text-gray-600">New to proCloud?</p>
          <div className="flex gap-3 flex-wrap justify-center">
            <Button asChild variant="outline">
              <Link to="/signup?type=client">
                <Briefcase className="mr-2 h-4 w-4" />
                Join as a Client
              </Link>
            </Button>
            <Button asChild>
              <Link to="/signup?type=freelancer">
                <UserPlus className="mr-2 h-4 w-4" />
                Join as a Creator
              </Link>
            </Button>
          </div>
          
          <div className="mt-6">
            <p className="mb-6 text-gray-600">Want to explore our platform?</p>
            <div className="flex gap-3 flex-wrap justify-center">
              <Button asChild variant="outline">
                <Link to="/client-dashboard">View Demo Dashboard</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/freelancers">Browse Creators</Link>
              </Button>
            </div>
            <p className="mt-6 text-sm text-gray-500 max-w-md mx-auto">
              We maintain creator anonymity to ensure fair selection based on quality of work.
              Your identity is protected until you're selected for a project.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
