
import Layout from "@/components/layout/Layout";
import LoginForm from "@/components/auth/LoginForm";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Briefcase, UserPlus } from "lucide-react";
import { useState, useEffect } from "react";

const Login = () => {
  const { currentUser, loading, userStatus } = useAuth();
  
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

  // If user is already logged in and we have a redirect path, redirect to it
  if (currentUser && userStatus?.redirectPath) {
    console.log("User already logged in, redirecting to:", userStatus.redirectPath);
    return <Navigate to={userStatus.redirectPath} replace />;
  }

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4 client-dashboard">
        <LoginForm />
        
        <div className="mt-8 text-center">
          <p className="mb-2 text-gray-600">New to proCloud?</p>
          <div className="flex gap-3 flex-wrap justify-center">
            <Link to="/signup/client">
              <Button variant="outline" className="flex items-center gap-2">
                <Briefcase className="mr-2 h-4 w-4" />
                Join as a Client
              </Button>
            </Link>
            <Link to="/signup/freelancer">
              <Button className="flex items-center gap-2">
                <UserPlus className="mr-2 h-4 w-4" />
                Join as a Creator
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
