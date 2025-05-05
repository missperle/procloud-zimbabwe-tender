
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { DEV_CREDENTIALS, handleDevModeLogin } from "@/utils/authHelpers";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

type FormData = z.infer<typeof formSchema>;

interface LoginFormContentProps {
  loginType: "client" | "freelancer";
}

const LoginFormContent = ({ loginType }: LoginFormContentProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: loginType === "client" 
        ? (import.meta.env.DEV ? DEV_CREDENTIALS.client.email : "") 
        : (import.meta.env.DEV ? DEV_CREDENTIALS.freelancer.email : ""),
      password: loginType === "client" 
        ? (import.meta.env.DEV ? DEV_CREDENTIALS.client.password : "") 
        : (import.meta.env.DEV ? DEV_CREDENTIALS.freelancer.password : ""),
    },
  });

  // Update form values when login type changes
  useEffect(() => {
    form.setValue("email", loginType === "client" 
      ? (import.meta.env.DEV ? DEV_CREDENTIALS.client.email : "") 
      : (import.meta.env.DEV ? DEV_CREDENTIALS.freelancer.email : ""));
    form.setValue("password", loginType === "client" 
      ? (import.meta.env.DEV ? DEV_CREDENTIALS.client.password : "") 
      : (import.meta.env.DEV ? DEV_CREDENTIALS.freelancer.password : ""));
  }, [loginType, form]);

  const onSubmit = async (data: FormData) => {
    try {
      setError(null);
      setIsLoading(true);
      console.log(`Attempting ${loginType} login with:`, data.email);
      
      // If we're in development mode, let's handle unconfirmed emails
      if (import.meta.env.DEV) {
        const { data: loginData } = await handleDevModeLogin(data.email, data.password);
        
        if (!loginData.user) {
          throw new Error("No user returned from login");
        }
      } else {
        // Normal login flow for production
        const { error: signOutError } = await supabase.auth.signOut();
        if (signOutError) {
          console.warn("Error signing out before login:", signOutError);
        }
        
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password
        });
        
        if (loginError) {
          throw new Error(loginError.message);
        }
        
        if (!loginData.user) {
          throw new Error("No user returned from login");
        }
      }
      
      // Get user profile to check role
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('role')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .maybeSingle();
      
      if (profileError) {
        console.error("Error fetching user role:", profileError);
      }
      
      const userRole = userProfile?.role || null;
      console.log("User role:", userRole);
      
      // Verify role matches the login type
      if ((loginType === "client" && userRole !== "client") || 
          (loginType === "freelancer" && userRole !== "freelancer")) {
        // Show warning but don't log out
        toast({
          title: "Role mismatch",
          description: `This account is registered as a ${userRole || 'unknown'} account but you're using the ${loginType} login. You'll be redirected to the appropriate dashboard.`,
          variant: "warning",
        });
      }
      
      toast({
        title: "Login successful",
        description: "Redirecting to your dashboard...",
      });
      
      // Redirect based on role
      if (userRole === "freelancer") {
        navigate("/freelancer-dashboard");
      } else if (userRole === "client") {
        navigate("/client-dashboard");
      } else {
        // Default fallback
        navigate("/client-dashboard");
      }
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

  // For development convenience
  const devLoginMessage = import.meta.env.DEV ? (
    <p className="text-xs text-gray-400 mt-2">
      DEV MODE: Use {loginType === "client" ? DEV_CREDENTIALS.client.email : DEV_CREDENTIALS.freelancer.email} / {loginType === "client" ? DEV_CREDENTIALS.client.password : DEV_CREDENTIALS.freelancer.password}
    </p>
  ) : null;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input 
                  placeholder={loginType === "client" ? "client@example.com" : "freelancer@example.com"} 
                  {...field} 
                  className="custom-input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  {...field} 
                  className="custom-input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && <p className="text-destructive text-sm text-center">{error}</p>}

        <Button 
          type="submit" 
          className="w-full accent-button"
          disabled={isLoading}
        >
          {isLoading ? (
            <span>Logging in...</span>
          ) : (
            <>
              <LogIn size={18} />
              <span>Sign In as {loginType === "client" ? "Client" : "Freelancer"}</span>
            </>
          )}
        </Button>

        <div className="text-center mt-4 pt-2 text-sm">
          <Link to="/signup" className="text-accent hover:underline">
            Don't have an account? Register
          </Link>
        </div>
        
        {devLoginMessage}
      </form>
    </Form>
  );
};

export default LoginFormContent;
