
import { useState } from "react";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DevModeUsersInitializer from "./DevModeUsersInitializer";
import LoginFormContent from "./LoginFormContent";

const LoginForm = () => {
  const { login } = useAuth();
  const { toast } = useToast();
  const [loginType, setLoginType] = useState<"client" | "freelancer">("client");

  return (
    <div className="login-card bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-auto">
      {/* Initialize test users in dev mode */}
      <DevModeUsersInitializer />
      
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">Proverb Digital Login</h1>
        <p className="text-sm text-gray-500 mt-1">Sign in to access your dashboard</p>
      </div>
      
      <Tabs value={loginType} onValueChange={(value) => setLoginType(value as "client" | "freelancer")} className="mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="client">Client Login</TabsTrigger>
          <TabsTrigger value="freelancer">Freelancer Login</TabsTrigger>
        </TabsList>
      </Tabs>

      <LoginFormContent loginType={loginType} />
    </div>
  );
};

export default LoginForm;
