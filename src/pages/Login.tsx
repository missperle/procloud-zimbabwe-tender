
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import LoginForm from "@/components/auth/LoginForm";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { handleRoleRedirection } from "@/components/auth/login/RoleRedirection";

const Login = () => {
  const { currentUser, loading } = useAuth();
  const [checkingRole, setCheckingRole] = useState(false);
  const navigate = useNavigate();
  
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
          .maybeSingle();
        
        if (error) {
          console.error("Error checking user role:", error);
        } else if (data) {
          // Use the same handleRoleRedirection function we use for login
          // For consistency, we'll use 'client' as default loginType when detecting from session
          const loginType = data.role === 'freelancer' ? 'freelancer' : 'client';
          handleRoleRedirection(data.role, loginType, navigate);
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
  }, [currentUser, navigate]);

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

  // If user is already logged in, they will be redirected by the useEffect

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4 client-dashboard">
        <LoginForm />
        
        <div className="mt-8 text-center">
          <p className="mb-2 text-gray-600">Don't have an account?</p>
          <div className="flex gap-3 flex-wrap justify-center">
            <Button asChild variant="outline">
              <Link to="/role-selection">Sign up</Link>
            </Button>
            <Button asChild>
              <Link to="/buy-tokens">
                <CreditCard className="mr-2 h-4 w-4" />
                Buy Tokens
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
