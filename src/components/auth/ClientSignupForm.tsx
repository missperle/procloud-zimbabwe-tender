
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, EyeOff, UploadCloud } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// List of common personal email domains
const personalEmailDomains = [
  "gmail.com", "yahoo.com", "hotmail.com", "outlook.com", 
  "aol.com", "icloud.com", "mail.com", "protonmail.com", 
  "zoho.com", "yandex.com", "gmx.com", "tutanota.com",
  "live.com", "msn.com"
];

const clientSignupSchema = z.object({
  email: z.string()
    .email({ message: "Please enter a valid email address" })
    .refine((email) => {
      const domain = email.split('@')[1]?.toLowerCase();
      return !personalEmailDomains.includes(domain);
    }, { message: "Please use a work email address, not a personal email" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  companyName: z.string().min(2, { message: "Company name is required" }),
  companyRegistrationNumber: z.string().min(1, { message: "Registration number is required" }),
  streetAddress: z.string().min(1, { message: "Street address is required" }),
  city: z.string().min(1, { message: "City is required" }),
  postalCode: z.string().min(1, { message: "Postal code is required" }),
  acceptTerms: z.boolean().refine(val => val === true, { message: "You must accept the terms and conditions" }),
});

type ClientSignupFormValues = z.infer<typeof clientSignupSchema>;

const ClientSignupForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [registrationDoc, setRegistrationDoc] = useState<File | null>(null);
  const [taxClearanceDoc, setTaxClearanceDoc] = useState<File | null>(null);

  const form = useForm<ClientSignupFormValues>({
    resolver: zodResolver(clientSignupSchema),
    defaultValues: {
      email: "",
      password: "",
      companyName: "",
      companyRegistrationNumber: "",
      streetAddress: "",
      city: "",
      postalCode: "",
      acceptTerms: false,
    },
  });

  const validateFile = (file: File | null, fieldName: string): boolean => {
    if (!file) {
      toast({
        title: "Missing file",
        description: `${fieldName} is required`,
        variant: "destructive",
      });
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: `${fieldName} must be less than 5MB`,
        variant: "destructive",
      });
      return false;
    }

    if (file.type !== "application/pdf") {
      toast({
        title: "Invalid file type",
        description: `${fieldName} must be a PDF`,
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setFile: React.Dispatch<React.SetStateAction<File | null>>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const uploadFile = async (file: File, userId: string, documentType: string): Promise<string | null> => {
    try {
      const filePath = `${userId}/${documentType}_${Date.now()}.pdf`;
      const { error: uploadError } = await supabase.storage
        .from('clients')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Insert record in user_documents table
      const { error: docError } = await supabase
        .from('user_documents')
        .insert({
          user_id: userId,
          document_type: documentType,
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

  const onSubmit = async (data: ClientSignupFormValues) => {
    // Validate files first
    if (!validateFile(registrationDoc, "Company Registration Document") || 
        !validateFile(taxClearanceDoc, "Tax Clearance Certificate")) {
      return;
    }

    setLoading(true);
    try {
      // 1. Create the user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            role: "client"
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("User creation failed");

      const userId = authData.user.id;

      // 2. Upload documents to storage
      const registrationPath = await uploadFile(registrationDoc!, userId, "company_registration");
      const taxClearancePath = await uploadFile(taxClearanceDoc!, userId, "tax_clearance");
      
      if (!registrationPath || !taxClearancePath) {
        throw new Error("Document upload failed");
      }

      // 3. Update user profile with additional information
      const { error: updateError } = await supabase
        .from('users')
        .update({
          company_name: data.companyName,
          company_registration_number: data.companyRegistrationNumber,
          company_address: {
            street: data.streetAddress,
            city: data.city,
            postal_code: data.postalCode
          },
          onboarding_completed: true
        })
        .eq('id', userId);

      if (updateError) throw updateError;

      toast({
        title: "Account created",
        description: "Your client account has been created successfully. You can now log in.",
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
                      <Input placeholder="your.email@company.com" {...field} />
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
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="companyRegistrationNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Registration Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="streetAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postal Code</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormLabel>Company Registration Document</FormLabel>
                <div className="border border-input rounded-md p-2">
                  <label className="flex items-center justify-center gap-2 cursor-pointer h-20 rounded-md border border-dashed border-gray-300 px-6 text-sm hover:bg-gray-50">
                    <UploadCloud className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">
                      {registrationDoc ? registrationDoc.name : "Upload PDF (max 5MB)"}
                    </span>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => handleFileChange(e, setRegistrationDoc)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <FormLabel>Tax Clearance Certificate</FormLabel>
                <div className="border border-input rounded-md p-2">
                  <label className="flex items-center justify-center gap-2 cursor-pointer h-20 rounded-md border border-dashed border-gray-300 px-6 text-sm hover:bg-gray-50">
                    <UploadCloud className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">
                      {taxClearanceDoc ? taxClearanceDoc.name : "Upload PDF (max 5MB)"}
                    </span>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => handleFileChange(e, setTaxClearanceDoc)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

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

export default ClientSignupForm;
