
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

// Function to create test users for development mode
export const createTestUser = async (role: "client" | "freelancer", email: string, password: string) => {
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
        },
        // Skip email verification in development
        emailRedirectTo: window.location.origin + "/login"
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
    
    // In development, auto-confirm the email
    if (import.meta.env.DEV) {
      try {
        // This is a workaround to auto-confirm the email in development
        // We sign in directly to bypass the email confirmation requirement
        await supabase.auth.signInWithPassword({ email, password });
        console.log(`Auto-confirmed test ${role} user in dev mode`);
        await supabase.auth.signOut();
      } catch (confirmError) {
        console.error("Error auto-confirming user:", confirmError);
      }
    }
    
    console.log(`Test ${role} user created successfully:`, email);
  } catch (err) {
    console.error(`Error in createTestUser for ${role}:`, err);
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
      throw new Error(signUpError.message);
    }
    
    // Try login again
    const { data: secondLoginData, error: secondLoginError } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });
    
    if (secondLoginError) {
      throw new Error("Failed to login after signup workaround: " + secondLoginError.message);
    }
    
    return { data: secondLoginData };
  } 
  
  // If there was another error or the login was successful
  if (loginError) {
    throw new Error(loginError.message);
  }
  
  return { data: loginData };
};
