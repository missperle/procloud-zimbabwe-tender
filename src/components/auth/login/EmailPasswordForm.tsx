
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { LogIn } from "lucide-react";
import { Link } from "react-router-dom";
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
import { DEV_CREDENTIALS } from "@/utils/authHelpers";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export type FormData = z.infer<typeof formSchema>;

interface EmailPasswordFormProps {
  loginType: "client" | "freelancer";
  isLoading: boolean;
  error: string | null;
  onSubmit: (data: FormData) => Promise<void>;
}

export const EmailPasswordForm = ({ 
  loginType, 
  isLoading, 
  error, 
  onSubmit 
}: EmailPasswordFormProps) => {
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

  // Development mode helper message
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
