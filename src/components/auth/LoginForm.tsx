
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/contexts/SupabaseAuthContext";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";

// Define credentials for dev mode login with valid email formats
const DEV_CREDENTIALS = {
  client: {
    email: "client@company-test.com",
    password: "password123"
  },
  freelancer: {
    email: "freelancer@personal-test.com",
    password: "freelancer123"
  }
};

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

type FormData = z.infer<typeof formSchema>;

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loginType, setLoginType] = useState<"client" | "freelancer">("client");

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

  // Create test users for development mode
  useEffect(() => {
    const createTestUsers = async () => {
      if (!import.meta.env.DEV) return;
      
      try {
        console.log("Checking if test users need to be created...");
        
        // Try to create client test user
        await createTestUser("client", DEV_CREDENTIALS.client.email, DEV_CREDENTIALS.client.password);
        
        // Try to create freelancer test user
        await createTestUser("freelancer", DEV_CREDENTIALS.freelancer.email, DEV_CREDENTIALS.freelancer.password);
      } catch (err) {
        console.error("Error creating test users:", err);
      }
    };
    
    createTestUsers();
  }, []);
  
  const createTestUser = async (role: "client" | "freelancer", email: string, password: string) => {
    try {
      // Check if user already exists by trying to sign in
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      // If sign in succeeds, user exists - sign out and return
      if (signInData.user) {
        console.log(`Test ${role} user already exists:`, email);
        await supabase.auth.signOut();
        return;
      }
      
      // User doesn't exist or wrong password, try to create
      console.log(`Creating test ${role} user:`, email);
      
      // Create the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role
          }
        }
      });
      
      if (error) {
        console.error(`Error creating test ${role} user:`, error);
        return;
      }
      
      if (!data.user) {
        console.error(`No user returned when creating test ${role} user`);
        return;
      }
      
      // Insert role into users table after successful signup
      const { error: userError } = await supabase
        .from('users')
        .insert({ 
          id: data.user.id, 
          email: email, 
          role: role,
          ...(role === 'freelancer' ? { alias: `freelancer_${Math.random().toString(36).substring(2, 8)}` } : {})
        });
        
      if (userError) {
        console.error(`Error setting role for test ${role} user:`, userError);
      }
      
      // Sign out the test user so we don't interfere with the login flow
      await supabase.auth.signOut();
      
      console.log(`Test ${role} user created successfully:`, email);
    } catch (err) {
      console.error(`Error in createTestUser for ${role}:`, err);
    }
  };

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
      
      // Sign out any existing user first
      await supabase.auth.signOut();
      
      // Attempt to log in
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
      
      // Get user profile to check role
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('role')
        .eq('id', loginData.user.id)
        .single();
      
      if (profileError) {
        console.error("Error fetching user role:", profileError);
        throw new Error("Error fetching user role");
      }
      
      const userRole = userProfile?.role || null;
      console.log("User role:", userRole);
      
      // Verify role matches the login type
      if ((loginType === "client" && userRole !== "client") || 
          (loginType === "freelancer" && userRole !== "freelancer")) {
        // Log out the user since they used the wrong login type
        await supabase.auth.signOut();
        throw new Error(`This email is registered as a ${userRole || 'unknown'} account. Please use the correct login option.`);
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
    <div className="login-card bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-auto">
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
    </div>
  );
};

export default LoginForm;
