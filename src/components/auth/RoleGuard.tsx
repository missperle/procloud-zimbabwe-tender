
import { ReactNode, useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: string[];
  redirectTo?: string;
}

const RoleGuard = ({
  children,
  allowedRoles,
  redirectTo = "/client-login"
}: RoleGuardProps) => {
  const { currentUser, loading: authLoading } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkUserRole = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }
      
      try {
        console.log("RoleGuard: Checking role for user:", currentUser.id);
        const { data, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', currentUser.id)
          .maybeSingle();
        
        if (error) {
          console.error("RoleGuard: Error fetching user role:", error);
          setUserRole(null);
        } else if (data) {
          console.log("RoleGuard: User role retrieved:", data.role);
          setUserRole(data.role);
        } else {
          console.log("RoleGuard: No role data found for user");
        }
      } catch (error) {
        console.error("RoleGuard: Error checking user role:", error);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };
    
    if (currentUser) {
      checkUserRole();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  if (authLoading || loading) {
    return (
      <div className="container mx-auto p-8">
        <Skeleton className="h-8 w-64 mb-6" />
        <div className="grid gap-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!currentUser) {
    console.log("RoleGuard: No current user, redirecting to login");
    return <Navigate to={redirectTo} state={{ from: window.location.pathname }} replace />;
  }

  if (!allowedRoles.includes(userRole || '')) {
    console.log("RoleGuard: User role not allowed:", userRole);
    
    // Handle unauthorized role with toast notification
    toast({
      title: "Access restricted",
      description: "You're being redirected to the appropriate dashboard for your account type.",
      variant: "default",
    });
    
    // Handle unauthorized role - redirect to appropriate dashboard
    if (userRole === 'client') {
      return <Navigate to="/client-dashboard" replace />;
    } else if (userRole === 'freelancer') {
      return <Navigate to="/freelancer-dashboard" replace />;
    } else if (userRole === 'agency') {
      return <Navigate to="/agency/review" replace />;
    } else {
      return <Navigate to={redirectTo} replace />;
    }
  }

  return <>{children}</>;
};

export default RoleGuard;
