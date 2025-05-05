
import { supabase } from "@/integrations/supabase/client";

/**
 * Attempts to login with provided credentials, with special handling for development mode
 */
export const attemptLogin = async (
  email: string, 
  password: string,
  isDevelopmentMode: boolean
) => {
  try {
    // Standard login attempt first
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (!error) {
      return { data, error: null };
    }
    
    // In development mode, provide additional options if email not confirmed
    if (isDevelopmentMode && error.message.includes("Email not confirmed")) {
      console.log("Development mode: attempting workaround for unconfirmed email...");
      
      try {
        // Force sign up again to work around email confirmation in dev
        await supabase.auth.signUp({
          email,
          password
        });
        
        // Wait briefly to ensure signup is processed
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Try login again
        const retryResult = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        return retryResult;
      } catch (devError) {
        console.error("Dev mode login workaround failed:", devError);
        return { data: null, error };
      }
    }
    
    return { data: null, error };
  } catch (err) {
    console.error("Login attempt failed:", err);
    return { 
      data: null, 
      error: err instanceof Error ? { message: err.message } : { message: "Unknown error during login" } 
    };
  }
};

/**
 * Fetches user role from the database
 */
export const fetchUserRole = async (userId: string): Promise<string | null> => {
  try {
    console.log("Fetching user role for:", userId);
    
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .maybeSingle();
    
    if (error) {
      console.error("Error fetching user role:", error);
      return null;
    }
    
    console.log("User role data:", data);
    return data?.role || null;
  } catch (error) {
    console.error("Error fetching user role:", error);
    return null;
  }
};
