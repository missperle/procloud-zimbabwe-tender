
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { getUserStatus, UserStatus } from "@/utils/authRedirect";

interface AuthContextType {
  currentUser: User | null;
  session: Session | null;
  loading: boolean;
  userStatus: UserStatus | null;
  refreshUserStatus: () => Promise<void>;
  signup: (email: string, password: string, metadata?: any) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userStatus, setUserStatus] = useState<UserStatus | null>(null);
  const { toast } = useToast();

  const refreshUserStatus = async () => {
    if (!currentUser) {
      setUserStatus(null);
      return;
    }
    
    try {
      const status = await getUserStatus(currentUser.id);
      setUserStatus(status);
    } catch (error) {
      console.error("Error refreshing user status:", error);
    }
  };

  useEffect(() => {
    console.log("Setting up auth state listener");
    
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession ? `User: ${currentSession.user?.email}` : "No user");
        setSession(currentSession);
        setCurrentUser(currentSession?.user ?? null);
        
        if (event === 'SIGNED_IN') {
          toast({
            title: "Welcome back!",
            description: "You have been logged in successfully.",
          });
          
          // When signed in, update user status
          if (currentSession?.user) {
            getUserStatus(currentSession.user.id).then(status => {
              setUserStatus(status);
            });
          }
        } else if (event === 'SIGNED_OUT') {
          setUserStatus(null);
          toast({
            title: "Logged out",
            description: "You have been logged out successfully.",
          });
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log("Initial session:", currentSession ? `User: ${currentSession.user?.email}` : "No session");
      setSession(currentSession);
      setCurrentUser(currentSession?.user ?? null);
      
      // Get initial user status if logged in
      if (currentSession?.user) {
        getUserStatus(currentSession.user.id).then(status => {
          setUserStatus(status);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  const signup = async (email: string, password: string, metadata?: any) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });
      
      if (error) throw error;
      
      // Don't add a toast here - we'll let the onAuthStateChange listener handle that
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast({
        title: "Error creating account",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    console.log("Login attempt with:", email);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast({
        title: "Error logging out",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const value = {
    currentUser,
    session,
    loading,
    userStatus,
    refreshUserStatus,
    signup,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
