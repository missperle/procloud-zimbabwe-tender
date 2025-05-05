
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  
  // Redirect to client login by default
  useEffect(() => {
    navigate("/client-login", { replace: true });
  }, [navigate]);

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Redirecting to login page...</p>
          <div className="mt-4 flex gap-4 justify-center">
            <Button asChild variant="outline">
              <Link to="/client-login">Client Login</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/freelancer-login">Freelancer Login</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
