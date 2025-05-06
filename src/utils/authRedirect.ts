
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type UserStatus = {
  role: string | null;
  onboardingCompleted: boolean;
  redirectPath: string;
};

/**
 * Centralized function to determine user status and appropriate redirect path
 */
export const getUserStatus = async (userId: string): Promise<UserStatus> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('role, onboarding_completed')
      .eq('id', userId)
      .single();
      
    if (error) {
      console.error("Error fetching user status:", error);
      return { role: null, onboardingCompleted: false, redirectPath: '/login' };
    }
    
    // Default path if role is not properly set
    let redirectPath = '/register';
    
    // Set role and onboardingCompleted status from data
    const role = data.role || null;
    const onboardingCompleted = !!data.onboarding_completed;
    
    // Determine redirect path based on role and onboarding status
    if (role === 'freelancer') {
      redirectPath = onboardingCompleted ? '/dashboard' : '/freelancer-onboarding';
    } else if (role === 'client') {
      redirectPath = onboardingCompleted ? '/client-dashboard' : '/client-onboarding';
    }
    
    return {
      role,
      onboardingCompleted,
      redirectPath
    };
  } catch (error) {
    console.error("Error in getUserStatus:", error);
    return { role: null, onboardingCompleted: false, redirectPath: '/login' };
  }
};

/**
 * Check if a user should be redirected based on their current status
 * and the allowed roles for a page
 */
export const shouldRedirect = (
  currentUser: User | null, 
  loading: boolean, 
  userRole: string | null,
  onboardingCompleted: boolean | null,
  allowedRoles: string[] = []
): string | null => {
  // If still loading, don't redirect
  if (loading) return null;
  
  // If not logged in, redirect to login
  if (!currentUser) return '/login';
  
  // If role is not allowed for this page, redirect to appropriate dashboard
  if (allowedRoles.length > 0 && userRole && !allowedRoles.includes(userRole)) {
    return userRole === 'freelancer' ? '/dashboard' : '/client-dashboard';
  }
  
  // If onboarding is required but not completed, redirect to appropriate onboarding
  if (onboardingCompleted === false) {
    return userRole === 'freelancer' ? '/freelancer-onboarding' : '/client-onboarding';
  }
  
  return null;
};
