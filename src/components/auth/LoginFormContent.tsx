
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { EmailPasswordForm, FormData } from "./login/EmailPasswordForm";
import { attemptLogin, fetchUserRole } from "./login/DevModeHelpers";
import { handleRoleRedirection } from "./login/RoleRedirection";

interface LoginFormContentProps {
  loginType: "client" | "freelancer";
}

const LoginFormContent = ({ loginType }: LoginFormContentProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: FormData) => {
    try {
      setError(null);
      setIsLoading(true);
      
      // Attempt login with provided credentials and improved error handling
      const { data: loginData, error: loginError } = await attemptLogin(
        data.email, 
        data.password,
        import.meta.env.DEV
      );
      
      // Handle potential error from login attempt with more specific messages
      if (loginError) {
        let errorMessage = loginError.message;
        
        // Provide more helpful error messages for common issues
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
      
      // Get user profile to check role - with the improved fetchUserRole function
      const userId = loginData.user.id;
      const userRole = await fetchUserRole(userId);
      
      // Use the consistent handleRoleRedirection function for all redirections
      handleRoleRedirection(userRole, loginType, navigate);
      
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : "An error occurred during login.";
      console.error("Login error:", errorMessage);
      setError(errorMessage);
      
      // If this is development mode and the error is about invalid credentials,
      // provide more helpful guidance
      if (import.meta.env.DEV && errorMessage.includes("Invalid")) {
        setError("Invalid login credentials. In development mode, try using the pre-filled credentials or check if the user exists in Supabase.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <EmailPasswordForm
      loginType={loginType}
      isLoading={isLoading}
      error={error}
      onSubmit={onSubmit}
    />
  );
};

export default LoginFormContent;
