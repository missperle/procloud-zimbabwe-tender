
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DEV_CREDENTIALS } from "@/utils/authHelpers";
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
      
      // Attempt login with provided credentials
      const { data: loginData, error: loginError } = await attemptLogin(
        data.email, 
        data.password,
        import.meta.env.DEV
      );
      
      // Handle potential error from login attempt
      if (loginError) {
        throw new Error(loginError.message);
      }
      
      if (!loginData?.user) {
        throw new Error("No user returned from login");
      }
      
      // Get user profile to check role
      const userRole = await fetchUserRole((await supabase.auth.getUser()).data.user?.id || "");
      
      // Ensure we're passing the loginType to handle redirection properly
      handleRoleRedirection(userRole, loginType, navigate);
      
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : "An error occurred during login.";
      console.error("Login error:", errorMessage);
      setError(errorMessage);
      
      // If this is development mode and the error is about invalid credentials,
      // provide more helpful guidance
      if (import.meta.env.DEV && errorMessage.includes("Invalid login credentials")) {
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
