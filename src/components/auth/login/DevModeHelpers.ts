
import { supabase } from "@/integrations/supabase/client";
import { handleDevModeLogin } from "@/utils/authHelpers";

/**
 * Handles login attempts with special consideration for development mode
 */
export const attemptLogin = async (email: string, password: string, isDev: boolean) => {
  console.log(`Attempting login with: ${email}`);
  
  // If we're in development mode, let's handle unconfirmed emails
  if (isDev) {
    return await handleDevModeLogin(email, password);
  } else {
    // Normal login flow for production
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
      console.warn("Error signing out before login:", signOutError);
    }
    
    return await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });
  }
};

/**
 * Fetches the user role from the database
 */
export const fetchUserRole = async (userId: string) => {
  console.log(`Fetching role for user: ${userId}`);
  
  const { data: userProfile, error: profileError } = await supabase
    .from('users')
    .select('role')
    .eq('id', userId)
    .maybeSingle();
  
  if (profileError) {
    console.error("Error fetching user role:", profileError);
    throw new Error(`Error fetching user role: ${profileError.message}`);
  }
  
  const userRole = userProfile?.role || null;
  console.log("User role detected:", userRole);
  return userRole;
};
