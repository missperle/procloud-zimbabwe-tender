
import { supabase } from "@/integrations/supabase/client";
import { DEV_CREDENTIALS } from "@/utils/authHelpers";

/**
 * Creates test users for development mode testing
 */
export const createTestUsers = async () => {
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

/**
 * Creates a single test user with the specified role
 */
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
