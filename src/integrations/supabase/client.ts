
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yfzitleumutyjktcpyac.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlmeml0bGV1bXV0eWprdGNweWFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzNTkzNzYsImV4cCI6MjA2MTkzNTM3Nn0.MKgWio8uliATmh1TnmevdmR5A45hLEaG9u1OY2ymXw4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: localStorage
  }
});
