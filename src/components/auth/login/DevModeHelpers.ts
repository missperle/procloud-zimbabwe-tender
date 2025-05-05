
import { supabase } from "@/integrations/supabase/client";
import { handleDevModeLogin } from "@/utils/authHelpers";

const MAX_RETRIES = 3;
const INITIAL_DELAY = 500; // 500ms initial delay

/**
 * Handles login attempts with special consideration for development mode and rate limiting
 */
export const attemptLogin = async (email: string, password: string, isDev: boolean) => {
  console.log(`Attempting login with: ${email}`);
  
  let retries = 0;
  let delay = INITIAL_DELAY;
  
  while (retries <= MAX_RETRIES) {
    try {
      // If we're in development mode, let's handle unconfirmed emails
      if (isDev) {
        const devModeResult = await handleDevModeLogin(email, password);
        return {
          data: devModeResult.data || { user: null, session: null },
          error: devModeResult.error || null
        };
      } else {
        // Normal login flow for production - no need to sign out first
        const result = await supabase.auth.signInWithPassword({
          email: email,
          password: password
        });
        
        return {
          data: result.data || { user: null, session: null },
          error: result.error || null
        };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      
      // Check if the error is a rate limiting error
      if (errorMessage.includes("rate limit") && retries < MAX_RETRIES) {
        console.log(`Rate limit hit, retrying (${retries + 1}/${MAX_RETRIES}) after ${delay}ms...`);
        retries++;
        
        // Wait using exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
        continue; // Try again
      }
      
      // If we've exhausted retries or it's another type of error, return it
      return { 
        data: { user: null, session: null }, 
        error: { message: errorMessage } 
      };
    }
  }
  
  // If we've exhausted all retries
  return { 
    data: { user: null, session: null }, 
    error: { message: "Login failed after multiple attempts. Please try again later." } 
  };
};

/**
 * Fetches the user role from the database with retry capabilities
 */
export const fetchUserRole = async (userId: string) => {
  if (!userId) {
    console.error("Cannot fetch role: No user ID provided");
    return null;
  }
  
  console.log(`Fetching role for user: ${userId}`);
  
  let retries = 0;
  let delay = INITIAL_DELAY;
  
  while (retries <= MAX_RETRIES) {
    try {
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .maybeSingle();
      
      if (profileError) {
        if (profileError.message.includes("rate limit") && retries < MAX_RETRIES) {
          console.log(`Rate limit hit when fetching role, retrying (${retries + 1}/${MAX_RETRIES}) after ${delay}ms...`);
          retries++;
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2;
          continue; // Try again
        }
        
        console.error("Error fetching user role:", profileError);
        throw new Error(`Error fetching user role: ${profileError.message}`);
      }
      
      const userRole = userProfile?.role || null;
      console.log("User role detected:", userRole);
      return userRole;
    } catch (error) {
      if (retries < MAX_RETRIES) {
        console.log(`Error when fetching role, retrying (${retries + 1}/${MAX_RETRIES}) after ${delay}ms...`);
        retries++;
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2;
        continue; // Try again
      }
      
      console.error("Failed to fetch user role after retries:", error);
      return null;
    }
  }
  
  return null;
};
