
import * as z from "zod";

// List of common personal email domains
export const personalEmailDomains = [
  "gmail.com", "yahoo.com", "hotmail.com", "outlook.com", 
  "aol.com", "icloud.com", "mail.com", "protonmail.com", 
  "zoho.com", "yandex.com", "gmx.com", "tutanota.com",
  "live.com", "msn.com"
];

// Form schema for freelancer signup
export const freelancerSignupSchema = z.object({
  email: z.string()
    .email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  fullName: z.string().min(2, { message: "Full name is required" }),
  acceptTerms: z.boolean().refine(val => val === true, { message: "You must accept the terms and conditions" }),
});

export type FreelancerSignupFormValues = z.infer<typeof freelancerSignupSchema>;

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Validates if a file meets the requirements for upload
 * @param file The file to validate
 * @returns true if the file is valid, false otherwise
 */
export const validateFile = (file: File | null): boolean => {
  if (file === null) {
    // Tax clearance is optional for freelancers
    return true;
  }

  if (file.size > MAX_FILE_SIZE) {
    return false;
  }

  if (file.type !== "application/pdf") {
    return false;
  }

  return true;
};
