
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { Navigate } from "react-router-dom";

const Register = () => {
  const { currentUser } = useAuth();

  if (currentUser) {
    return <Navigate to="/dashboard" />;
  }

  // Redirect to the role selection page
  return <Navigate to="/role-selection" />;
};

export default Register;
