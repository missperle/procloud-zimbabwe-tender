
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import UserTypeSelector from "./UserTypeSelector";
import EmailField from "./EmailField";
import PasswordField from "./PasswordField";
import SignupFormFooter from "./SignupFormFooter";

const signupSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
  userType: z.enum(["freelancer", "client"], {
    required_error: "Please select a user type",
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

interface SignupFormProps {
  initialUserType?: string;
}

const SignupForm = ({ initialUserType = "freelancer" }: SignupFormProps) => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      userType: initialUserType === "client" ? "client" : "freelancer",
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    setError(null);
    setLoading(true);
    try {
      // Include the user type in the metadata
      await signup(data.email, data.password, {
        role: data.userType
      });
      
      // Show success message
      toast({
        title: "Account Created",
        description: data.userType === "freelancer" 
          ? "Welcome to proCloud! Let's set up your freelancer profile." 
          : "Welcome to proCloud! Let's set up your client profile.",
      });
      
      // Redirect to appropriate onboarding page based on user type
      if (data.userType === "freelancer") {
        navigate("/freelancer-onboarding");
      } else {
        navigate("/client-onboarding");
      }
    } catch (error) {
      console.error("Signup error:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // If the form is on a dedicated page, hide the user type selector
  const showUserTypeSelector = initialUserType === "freelancer" || initialUserType === "client" ? false : true;

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
      <div className="text-center">
        <h2 className="text-2xl font-bold">
          {initialUserType === "freelancer" ? "Create a Creator Account" : 
           initialUserType === "client" ? "Create a Client Account" : 
           "Create an Account"}
        </h2>
        <p className="mt-2 text-sm text-gray-600">Sign up to get started</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {showUserTypeSelector && (
            <UserTypeSelector control={form.control} disabled={loading} />
          )}

          <EmailField control={form.control} disabled={loading} />

          <PasswordField 
            control={form.control} 
            name="password" 
            label="Password" 
            showToggle={true}
            showPasswordState={showPassword}
            onTogglePassword={togglePasswordVisibility}
            disabled={loading}
          />

          <PasswordField 
            control={form.control} 
            name="confirmPassword" 
            label="Confirm Password" 
            showPasswordState={showPassword}
            disabled={loading}
          />

          {error && <p className="text-destructive text-sm">{error}</p>}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? "Creating account..." : "Sign up"}
          </Button>
        </form>
      </Form>

      <SignupFormFooter />
    </div>
  );
};

export default SignupForm;
