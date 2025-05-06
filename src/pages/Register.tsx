
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Link } from "react-router-dom";
import { Briefcase, UserPlus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Register = () => {
  const { currentUser } = useAuth();
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [redirectPath, setRedirectPath] = useState('');

  useEffect(() => {
    const checkUserStatus = async () => {
      if (currentUser) {
        const { data, error } = await supabase
          .from('users')
          .select('role, onboarding_completed')
          .eq('id', currentUser.id)
          .single();

        if (!error && data) {
          if (data.role === 'freelancer') {
            setRedirectPath('/freelancer-onboarding');
          } else if (data.role === 'client') {
            setRedirectPath(data.onboarding_completed ? '/client-dashboard' : '/client-onboarding');
          }
          setShouldRedirect(true);
        }
      }
    };

    checkUserStatus();
  }, [currentUser]);

  if (shouldRedirect) {
    return <Navigate to={redirectPath} />;
  }

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Join Proverb Digital</CardTitle>
            <CardDescription>Choose how you want to use our platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <Link to="/signup/client" className="w-full">
                <Button size="lg" variant="default" className="w-full p-6 text-lg flex items-center gap-3">
                  <Briefcase size={24} />
                  <div className="flex flex-col items-start">
                    <span>I'm a Client</span>
                    <span className="text-xs font-normal">Post projects and hire talent</span>
                  </div>
                </Button>
              </Link>
              
              <Link to="/signup/freelancer" className="w-full">
                <Button size="lg" variant="outline" className="w-full p-6 text-lg flex items-center gap-3">
                  <UserPlus size={24} />
                  <div className="flex flex-col items-start">
                    <span>I'm a Freelancer</span>
                    <span className="text-xs font-normal">Find work and showcase skills</span>
                  </div>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Register;
