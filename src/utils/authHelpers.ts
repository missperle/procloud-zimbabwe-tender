
import { supabase } from "@/integrations/supabase/client";

// Define credentials for dev mode login with valid email formats
export const DEV_CREDENTIALS = {
  client: {
    email: "client123@gmail.com",
    password: "password123"
  },
  freelancer: {
    email: "freelancer123@gmail.com",
    password: "freelancer123"
  }
};

// Function for handling development mode login issues with improved reliability
export const handleDevModeLogin = async (email: string, password: string) => {
  // Try to sign in first without signing out
  const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
    email: email,
    password: password
  });
  
  // If login successful, return the data
  if (!loginError) {
    return { 
      data: loginData,
      error: null
    };
  }
  
  // If email not confirmed, try the workaround
  if (loginError.message.includes("Email not confirmed")) {
    console.log("Email not confirmed, attempting workaround in development mode...");
    
    // Extract role from email for default assignment
    const role = email.includes("client") ? "client" : "freelancer";
    
    try {
      // Force sign up again, which will overwrite the existing user
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            role: role
          }
        }
      });
      
      if (signUpError) {
        return { 
          data: null, 
          error: { message: signUpError.message } 
        };
      }
      
      // Wait a moment to ensure the signup is processed
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Try login again
      const { data: secondLoginData, error: secondLoginError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      });
      
      if (secondLoginError) {
        return {
          data: null,
          error: { message: "Failed to login after signup workaround: " + secondLoginError.message }
        };
      }
      
      return { 
        data: secondLoginData,
        error: null
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error during dev mode login";
      return {
        data: null,
        error: { message }
      };
    }
  }
  
  // For other types of errors, return them
  return {
    data: null,
    error: loginError
  };
};
