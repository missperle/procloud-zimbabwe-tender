
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { EmailPasswordForm } from "./login/EmailPasswordForm";
import { attemptLogin, fetchUserRole } from "./login/DevModeHelpers";
import { DEV_CREDENTIALS } from "@/utils/authHelpers";
import { handleRoleRedirection } from "./login/RoleRedirection";

interface FormData {
  email: string;
  password: string;
}

const MAX_RETRIES = 2;
const INITIAL_DELAY = 500;

const FreelancerLoginForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: FormData) => {
    try {
      setError(null);
      setIsLoading(true);
      
      console.log("Freelancer login attempt with:", data.email);
      
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
          const role = await fetchUserRole(userId);
          if (role !== null) {
            userRole = role;
            break;
          }
          
          if (retries < MAX_RETRIES) {
            console.log(`Role fetch attempt failed, retrying (${retries + 1}/${MAX_RETRIES})`);
            retries++;
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2;
            continue;
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
      
      console.log("Login successful, detected role:", userRole);
      
      // Show appropriate toast based on role
      toast({
        title: "Login successful",
        description: "Redirecting to your dashboard...",
      });
      
      // Use the consistent handleRoleRedirection function for all redirections
      handleRoleRedirection(userRole, "freelancer", navigate);
      
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : "An error occurred during login.";
      console.error("Login error:", errorMessage);
      setError(errorMessage);
      
      if (import.meta.env.DEV && errorMessage.includes("Invalid")) {
        setError(`Invalid login credentials. In development mode, try using freelancer credentials: ${DEV_CREDENTIALS.freelancer.email} / ${DEV_CREDENTIALS.freelancer.password}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-card bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-auto">
      <EmailPasswordForm
        loginType="freelancer"
        isLoading={isLoading}
        error={error}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default FreelancerLoginForm;
