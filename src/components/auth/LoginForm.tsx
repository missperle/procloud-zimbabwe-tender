
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/contexts/AuthContext";
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
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getApp } from "firebase/app";

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
  const [loginType, setLoginType] = useState<"client" | "agency">("client");

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: loginType === "client" 
        ? (import.meta.env.DEV ? "test@proverb.digital" : "") 
        : (import.meta.env.DEV ? "agency@proverb.digital" : ""),
      password: loginType === "client" 
        ? (import.meta.env.DEV ? "password123" : "") 
        : (import.meta.env.DEV ? "agency123" : ""),
    },
  });

  // Update form values when login type changes
  useEffect(() => {
    form.setValue("email", loginType === "client" 
      ? (import.meta.env.DEV ? "test@proverb.digital" : "") 
      : (import.meta.env.DEV ? "agency@proverb.digital" : ""));
    form.setValue("password", loginType === "client" 
      ? (import.meta.env.DEV ? "password123" : "") 
      : (import.meta.env.DEV ? "agency123" : ""));
  }, [loginType, form]);

  const onSubmit = async (data: FormData) => {
    try {
      setError(null);
      setIsLoading(true);
      console.log(`Attempting ${loginType} login with:`, data.email);
      await login(data.email, data.password);
      
      // Check user role in Firestore
      const db = getFirestore(getApp("proverb-digital-client"));
      const user = await getDoc(doc(db, "users", auth.currentUser?.uid || ""));
      const userRole = user.exists() ? user.data().role : null;
      console.log("User role:", userRole);
      
      toast({
        title: "Login successful",
        description: "Redirecting to your dashboard...",
      });
      
      // Redirect based on role
      if (userRole === "agency") {
        navigate("/agency/review");
      } else {
        navigate("/client-dashboard");
      }
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message.replace("Firebase: ", "") 
        : "An error occurred during login.";
      console.error("Login error:", errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // For development convenience
  const devLoginMessage = import.meta.env.DEV ? (
    <p className="text-xs text-gray-400 mt-2">
      DEV MODE: Use {loginType === "client" ? "test@proverb.digital / password123" : "agency@proverb.digital / agency123"}
    </p>
  ) : null;

  return (
    <div className="login-card bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">Proverb Digital Login</h1>
        <p className="text-sm text-gray-500 mt-1">Sign in to access your dashboard</p>
      </div>
      
      <Tabs value={loginType} onValueChange={(value) => setLoginType(value as "client" | "agency")} className="mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="client">Client Login</TabsTrigger>
          <TabsTrigger value="agency">Agency Login</TabsTrigger>
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
                    placeholder={loginType === "client" ? "client@example.com" : "agency@example.com"} 
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
                <span>Sign In as {loginType === "client" ? "Client" : "Agency"}</span>
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
