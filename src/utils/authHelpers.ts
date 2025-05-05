
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

// Function for handling development mode login issues
export const handleDevModeLogin = async (email: string, password: string) => {
  // For dev mode, try to sign up the user again if login fails due to unconfirmed email
  const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
    email: email,
    password: password
  });
  
  if (loginError && loginError.message.includes("Email not confirmed")) {
    console.log("Email not confirmed, attempting workaround in development mode...");
    
    // Extract role from email for default assignment
    const role = email.includes("client") ? "client" : "freelancer";
    
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
  } 
  
  // If there was another error or the login was successful
  if (loginError) {
    return {
      data: null,
      error: loginError
    };
  }
  
  return { 
    data: loginData,
    error: null
  };
};
