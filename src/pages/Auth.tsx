
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import LoginForm from "@/components/auth/LoginForm";
import ClientSignupForm from "@/components/auth/ClientSignupForm";
import FreelancerSignupForm from "@/components/auth/freelancer/FreelancerSignupForm";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role") as "client" | "freelancer" | null;
  const [activeTab, setActiveTab] = useState<"login" | "signup">("signup");
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // If user already logged in, redirect based on their role
  useEffect(() => {
    if (currentUser) {
      // This will be handled by the SupabaseAuthContext which will redirect based on role
      navigate("/client-dashboard"); // Will be redirected appropriately from there
    }
  }, [currentUser, navigate]);

  // Redirect to role-specific login page for login tab
  useEffect(() => {
    if (activeTab === "login") {
      if (role === "client") {
        navigate("/client-login");
      } else if (role === "freelancer") {
        navigate("/freelancer-login");
      } else {
        navigate("/client-login"); // Default to client login
      }
    }
  }, [activeTab, role, navigate]);

  if (!role) {
    return (
      <Layout>
        <div className="container mx-auto py-12">
          <Alert variant="destructive" className="max-w-md mx-auto">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Please select a role first. 
              <Link to="/role-selection" className="font-medium underline ml-1">
                Go back to role selection
              </Link>
            </AlertDescription>
          </Alert>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-12 flex justify-center">
        <div className="max-w-md w-full">
          <h1 className="text-2xl font-bold mb-6 text-center">
            {role === "client" ? "Client Account" : "Freelancer Account"}
          </h1>
          
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "login" | "signup")}>
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
              <TabsTrigger value="login">Log In</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signup">
              {role === "client" ? <ClientSignupForm /> : <FreelancerSignupForm />}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Auth;
