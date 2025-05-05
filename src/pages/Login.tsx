
import Layout from "@/components/layout/Layout";
import LoginForm from "@/components/auth/LoginForm";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CreditCard, Coins } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const { currentUser, loading } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [checkingRole, setCheckingRole] = useState(false);
  
  // Check user role when currentUser changes
  useEffect(() => {
    const checkUserRole = async () => {
      if (!currentUser) return;
      
      try {
        setCheckingRole(true);
        // Query the users table for role
        const { data, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', currentUser.id)
          .single();
        
        if (error) {
          console.error("Error checking user role:", error);
        } else if (data) {
          setUserRole(data.role);
        }
      } catch (error) {
        console.error("Error checking user role:", error);
      } finally {
        setCheckingRole(false);
      }
    };
    
    if (currentUser) {
      checkUserRole();
    }
  }, [currentUser]);

  // Show loading state while auth initializes or role is being checked
  if (loading || checkingRole) {
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

  // If user is already logged in, redirect based on role
  if (currentUser) {
    console.log("User already logged in, redirecting based on role:", userRole);
    if (userRole === "agency") {
      return <Navigate to="/agency/review" replace />;
    } else {
      return <Navigate to="/client-dashboard" replace />;
    }
  }

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4 client-dashboard">
        <LoginForm />
        
        <div className="mt-8 text-center">
          <p className="mb-2 text-gray-600">Want to explore our platform?</p>
          <div className="flex gap-3 flex-wrap justify-center">
            <Button asChild variant="outline">
              <Link to="/client-dashboard">View Client Demo</Link>
            </Button>
            <Button asChild>
              <Link to="/buy-tokens">
                <CreditCard className="mr-2 h-4 w-4" />
                Buy Tokens
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/agency/review">
                <Coins className="mr-2 h-4 w-4" />
                View Agency Demo
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
