
import { toast } from "@/hooks/use-toast";
import { NavigateFunction } from "react-router-dom";

/**
 * Handles the redirection logic based on user role
 */
export const handleRoleRedirection = (
  userRole: string | null,
  loginType: "client" | "freelancer",
  navigate: NavigateFunction
) => {
  console.log(`Redirecting based on detected role: ${userRole}`);
  
  // Display role mismatch warning if applicable
  if ((loginType === "client" && userRole !== "client") || 
      (loginType === "freelancer" && userRole !== "freelancer")) {
    // Show warning but don't log out
    toast({
      title: "Role mismatch",
      description: `This account is registered as a ${userRole || 'unknown'} account but you're using the ${loginType} login. You'll be redirected to the appropriate dashboard.`,
      variant: "default",
    });
  }
  
  toast({
    title: "Login successful",
    description: "Redirecting to your dashboard...",
  });
  
  // Enhanced redirect logic with explicit role-based routing
  if (userRole === "freelancer") {
    console.log("Navigating to freelancer dashboard");
    navigate("/freelancer-dashboard", { replace: true });
  } else if (userRole === "client") {
    console.log("Navigating to client dashboard");
    navigate("/client-dashboard", { replace: true });
  } else {
    // Default fallback - now explicitly log this decision
    console.log("No specific role detected or role unknown, using default redirect to client dashboard");
    navigate("/client-dashboard", { replace: true });
  }
};
