
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { handleDevModeLogin } from "@/utils/authHelpers";
import ClientLoginForm from "@/components/auth/ClientLoginForm";

const ClientLogin = () => {
  const { currentUser, loading } = useAuth();
  const [checkingRole, setCheckingRole] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
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

  // If user is already logged in, redirect them
  if (currentUser) {
    // First try to navigate based on role, fall back to client dashboard
    (async () => {
      setCheckingRole(true);
      try {
        const { data } = await supabase
          .from('users')
          .select('role')
          .eq('id', currentUser.id)
          .maybeSingle();
        
        if (data?.role === "freelancer") {
          toast({
            title: "Role mismatch",
            description: "You're logging in with a freelancer account. Redirecting to freelancer dashboard.",
          });
          navigate("/freelancer-dashboard", { replace: true });
        } else {
          // Default or client role
          navigate("/client-dashboard", { replace: true });
        }
      } catch (error) {
        console.error("Error checking user role:", error);
        // Fall back to client dashboard on error
        navigate("/client-dashboard", { replace: true });
      } finally {
        setCheckingRole(false);
      }
    })();
    
    return null;
  }

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4 client-dashboard">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Client Login</h1>
          <p className="text-gray-600 mt-2">
            Access your client dashboard to manage projects and post jobs
          </p>
        </div>
        
        <ClientLoginForm />
        
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
          
          <div className="mt-4">
            <Link to="/freelancer-login" className="text-sm text-accent hover:underline">
              Switch to Freelancer Login
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ClientLogin;
