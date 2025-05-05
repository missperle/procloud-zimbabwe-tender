
import { useToast } from "@/hooks/use-toast";
import { NavigateFunction } from "react-router-dom";

/**
 * Handles the redirection logic based on user role
 */
export const handleRoleRedirection = (
  userRole: string | null,
  loginType: "client" | "freelancer",
  navigate: NavigateFunction
) => {
  console.log(`Redirecting based on detected role: ${userRole}, login type: ${loginType}`);
  
  const redirectToClientDashboard = () => {
    console.log("Navigating to client dashboard");
    navigate("/client-dashboard", { replace: true });
  };
  
  const redirectToFreelancerDashboard = () => {
    console.log("Navigating to freelancer dashboard");
    navigate("/freelancer-dashboard", { replace: true });
  };
  
  // Role-based redirection logic
  if (userRole === "freelancer") {
    if (loginType === "client") {
      // Show warning but proceed with correct redirection
      console.log("Role mismatch: Freelancer account using client login");
    }
    redirectToFreelancerDashboard();
  } 
  else if (userRole === "client") {
    if (loginType === "freelancer") {
      // Show warning but proceed with correct redirection
      console.log("Role mismatch: Client account using freelancer login");
    }
    redirectToClientDashboard();
  } 
  else {
    // If no role detected, use the login type as fallback
    console.log(`No role detected, using login type (${loginType}) for redirect`);
    if (loginType === "freelancer") {
      redirectToFreelancerDashboard();
    } else {
      redirectToClientDashboard();
    }
  }
};
