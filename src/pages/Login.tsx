
import Layout from "@/components/layout/Layout";
import LoginForm from "@/components/auth/LoginForm";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CreditCard, Coins } from "lucide-react";
import { useEffect, useState } from "react";
import { getAnalytics, logEvent } from "firebase/analytics";
import { auth } from "@/lib/firebase";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { Link } from "react-router-dom";

const Login = () => {
  const { currentUser, loading } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [checkingRole, setCheckingRole] = useState(false);
  
  // Log page view event
  useEffect(() => {
    try {
      const analytics = getAnalytics(auth.app);
      logEvent(analytics, 'page_view');
    } catch (error) {
      console.error("Analytics error:", error);
    }
  }, []);
  
  // Check user role when currentUser changes
  useEffect(() => {
    const checkUserRole = async () => {
      if (!currentUser) return;
      
      try {
        setCheckingRole(true);
        const db = getFirestore(auth.app);
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role);
        }
      } catch (error) {
        console.error("Error checking user role:", error);
      } finally {
        setCheckingRole(false);
      }
    };
    
    if (currentUser) {
      checkUserRole();
    }
  }, [currentUser]);

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

  // If user is already logged in, redirect based on role
  if (currentUser) {
    console.log("User already logged in, redirecting based on role:", userRole);
    if (userRole === "agency") {
      return <Navigate to="/agency/review" replace />;
    } else {
      return <Navigate to="/client-dashboard" replace />;
    }
  }

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4 client-dashboard">
        <LoginForm />
        
        <div className="mt-8 text-center">
          <p className="mb-2 text-gray-600">Want to explore our platform?</p>
          <div className="flex gap-3 flex-wrap justify-center">
            <Button asChild variant="outline">
              <Link to="/client-dashboard">View Client Demo</Link>
            </Button>
            <Button asChild>
              <Link to="/buy-tokens">
                <CreditCard className="mr-2 h-4 w-4" />
                Buy Tokens
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/agency/review">
                <Coins className="mr-2 h-4 w-4" />
                View Agency Demo
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
