
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { EmailPasswordForm } from "./login/EmailPasswordForm";
import { attemptLogin } from "./login/DevModeHelpers";
import { DEV_CREDENTIALS } from "@/utils/authHelpers";

interface FormData {
  email: string;
  password: string;
}

const MAX_RETRIES = 2;
const INITIAL_DELAY = 500;

const ClientLoginForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: FormData) => {
    try {
      setError(null);
      setIsLoading(true);
      
      console.log("Client login attempt with:", data.email);
      
      // Attempt login with provided credentials
      const { data: loginData, error: loginError } = await attemptLogin(
        data.email, 
        data.password,
        import.meta.env.DEV
      );
      
      // Handle potential error from login attempt with more specific messages
      if (loginError) {
        let errorMessage = loginError.message;
        
        if (errorMessage.includes("rate limit")) {
          errorMessage = "Too many login attempts. Please wait a moment and try again.";
        } else if (errorMessage.includes("Invalid login")) {
          errorMessage = "Invalid email or password. Please check your credentials and try again.";
        } else if (errorMessage.includes("Email not confirmed")) {
          errorMessage = "Your email is not confirmed. In development mode, try again or use the pre-filled credentials.";
        }
        
        throw new Error(errorMessage);
      }
      
      if (!loginData?.user) {
        throw new Error("Login failed. Please try again.");
      }
      
      // Get user profile to check role
      const userId = loginData.user.id;
      let retries = 0;
      let delay = INITIAL_DELAY;
      let userRole = null;
      
      while (retries <= MAX_RETRIES) {
        try {
          const { data, error: roleError } = await supabase
            .from('users')
            .select('role')
            .eq('id', userId)
            .maybeSingle();
          
          if (roleError) {
            if (roleError.message.includes("rate limit") && retries < MAX_RETRIES) {
              console.log(`Rate limit hit when fetching role, retrying (${retries + 1}/${MAX_RETRIES})`);
              retries++;
              await new Promise(resolve => setTimeout(resolve, delay));
              delay *= 2;
              continue;
            }
            console.error("Error fetching user role:", roleError);
          } else {
            userRole = data?.role || null;
            break;
          }
        } catch (error) {
          console.error("Error in role check:", error);
          if (retries < MAX_RETRIES) {
            retries++;
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2;
            continue;
          }
          break;
        }
      }
      
      // Show appropriate toast based on role
      if (userRole && userRole !== "client") {
        toast({
          title: "Role mismatch",
          description: `This account is registered as a ${userRole} account. You'll be redirected to the appropriate dashboard.`,
          variant: "default",
        });
        
        navigate(userRole === "freelancer" ? "/freelancer-dashboard" : "/client-dashboard", { replace: true });
      } else {
        toast({
          title: "Login successful",
          description: "Redirecting to your dashboard...",
        });
        
        navigate("/client-dashboard", { replace: true });
      }
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : "An error occurred during login.";
      console.error("Login error:", errorMessage);
      setError(errorMessage);
      
      if (import.meta.env.DEV && errorMessage.includes("Invalid")) {
        setError(`Invalid login credentials. In development mode, try using client credentials: ${DEV_CREDENTIALS.client.email} / ${DEV_CREDENTIALS.client.password}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-card bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-auto">
      <EmailPasswordForm
        loginType="client"
        isLoading={isLoading}
        error={error}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default ClientLoginForm;
