
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FileUploadField from "./FileUploadField";
import {
  freelancerSignupSchema,
  FreelancerSignupFormValues,
  validateFile
} from "./FreelancerSignupSchema";

const FreelancerSignupForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [taxClearanceDoc, setTaxClearanceDoc] = useState<File | null>(null);

  const form = useForm<FreelancerSignupFormValues>({
    resolver: zodResolver(freelancerSignupSchema),
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
      acceptTerms: false,
    },
  });

  const uploadFile = async (file: File, userId: string): Promise<string | null> => {
    if (!file) return null; // Skip if no file

    try {
      const filePath = `${userId}/tax_clearance_${Date.now()}.pdf`;
      const { error: uploadError } = await supabase.storage
        .from('freelancers')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Insert record in user_documents table
      const { error: docError } = await supabase
        .from('user_documents')
        .insert({
          user_id: userId,
          document_type: "tax_clearance",
          file_path: filePath,
          file_name: file.name,
          file_size: file.size,
        });

      if (docError) throw docError;

      return filePath;
    } catch (error: any) {
      console.error("Error uploading file:", error.message);
      return null;
    }
  };

  const onSubmit = async (data: FreelancerSignupFormValues) => {
    // Validate file if provided
    if (taxClearanceDoc && !validateFile(taxClearanceDoc)) {
      toast({
        title: "Invalid file",
        description: "Tax Clearance Certificate must be a PDF less than 5MB",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Check if email is already registered as a client
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('role')
        .eq('email', data.email)
        .single();

      if (existingUser && existingUser.role === 'client') {
        throw new Error("This email is already registered as a client. Please use a different email address.");
      }

      // 1. Create the user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            role: "freelancer"
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("User creation failed");

      const userId = authData.user.id;

      // 2. Upload tax clearance document if provided
      let taxClearancePath = null;
      if (taxClearanceDoc) {
        taxClearancePath = await uploadFile(taxClearanceDoc, userId);
      }

      // 3. Update user profile with full name
      const { error: updateError } = await supabase
        .from('users')
        .update({
          full_name: data.fullName,
          onboarding_completed: true
        })
        .eq('id', userId);

      if (updateError) throw updateError;

      toast({
        title: "Account created",
        description: "Your freelancer account has been created successfully. You can now log in.",
      });
      
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      
    } catch (error: any) {
      toast({
        title: "Error creating account",
        description: error.message || "An error occurred while creating your account",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your.email@gmail.com" {...field} />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-muted-foreground mt-1">
                      Use a personal email address (Gmail, Hotmail, etc.)
                    </p>
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
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          {...field}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-2.5 text-gray-400"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FileUploadField
                file={taxClearanceDoc}
                onFileChange={setTaxClearanceDoc}
                label="Tax Clearance Certificate (Optional)"
                acceptTypes=".pdf"
              />

              <FormField
                control={form.control}
                name="acceptTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I accept the{" "}
                        <a
                          href="/terms.pdf"
                          target="_blank"
                          className="text-indigo-ink underline"
                        >
                          terms and conditions
                        </a>
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default FreelancerSignupForm;
