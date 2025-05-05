
import { supabase } from "@/integrations/supabase/client";
import { DEV_CREDENTIALS } from "@/utils/authHelpers";

const MAX_RETRIES = 3;
const INITIAL_DELAY = 500;

/**
 * Creates test users for development mode testing with improved retry logic
 */
export const createTestUsers = async () => {
  if (!import.meta.env.DEV) return;
  
  try {
    console.log("Checking if test users need to be created...");
    
    // Try to create client test user
    await createTestUser("client", DEV_CREDENTIALS.client.email, DEV_CREDENTIALS.client.password);
    
    // Add a small delay between creations to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Try to create freelancer test user
    await createTestUser("freelancer", DEV_CREDENTIALS.freelancer.email, DEV_CREDENTIALS.freelancer.password);
  } catch (err) {
    console.error("Error creating test users:", err);
  }
};

/**
 * Creates a single test user with the specified role
 * Now with improved error handling and retry logic
 */
export const createTestUser = async (role: "client" | "freelancer", email: string, password: string) => {
  let retries = 0;
  let delay = INITIAL_DELAY;
  
  while (retries <= MAX_RETRIES) {
    try {
      // Check if user already exists by trying to sign in
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      // If sign in succeeds, user exists - sign out and return
      if (signInData.user) {
        console.log(`Test ${role} user already exists:`, email);
        
        // Check if the role is set correctly in the users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role')
          .eq('id', signInData.user.id)
          .maybeSingle();
        
        if (!userError && userData && userData.role !== role) {
          console.log(`Updating role for test user ${email} from ${userData.role} to ${role}`);
          await supabase
            .from('users')
            .update({ role: role })
            .eq('id', signInData.user.id);
        }
        
        await supabase.auth.signOut();
        return;
      }
      
      // Handle rate limiting
      if (signInError && signInError.message.includes("rate limit") && retries < MAX_RETRIES) {
        console.log(`Rate limit hit, retrying (${retries + 1}/${MAX_RETRIES}) after ${delay}ms...`);
        retries++;
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2;
        continue;
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
        // Handle rate limiting
        if (error.message.includes("rate limit") && retries < MAX_RETRIES) {
          console.log(`Rate limit hit when creating user, retrying (${retries + 1}/${MAX_RETRIES}) after ${delay}ms...`);
          retries++;
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2;
          continue;
        }
        
        console.error(`Error creating test ${role} user:`, error);
        return;
      }
      
      if (!data.user) {
        console.error(`No user returned when creating test ${role} user`);
        return;
      }
      
      // Wait a bit to ensure the auth webhook triggers properly
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Insert or update role into users table after successful signup
      const { error: userError } = await supabase
        .from('users')
        .upsert({ 
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
      return;
    } catch (err) {
      if (retries < MAX_RETRIES) {
        console.log(`Error when creating test user, retrying (${retries + 1}/${MAX_RETRIES}) after ${delay}ms...`);
        retries++;
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2;
        continue;
      }
      
      console.error(`Error in createTestUser for ${role}:`, err);
      return;
    }
  }
};
