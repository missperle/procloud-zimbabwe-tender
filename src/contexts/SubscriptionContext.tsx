
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface SubscriptionContextType {
  userRole: string | null;
  isLoading: boolean;
  refreshUserRole: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  userRole: null,
  isLoading: true,
  refreshUserRole: async () => {}
});

export const useSubscription = () => useContext(SubscriptionContext);

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const { currentUser } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserRole = async () => {
    if (!currentUser) {
      setUserRole(null);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', currentUser.id)
        .single();

      if (error) {
        console.error("Error fetching user role:", error);
        setUserRole(null);
      } else {
        console.log("Fetched user role:", data?.role);
        setUserRole(data?.role || null);
      }
    } catch (error) {
      console.error("Error in role fetch operation:", error);
      setUserRole(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh user role on demand
  const refreshUserRole = async () => {
    setIsLoading(true);
    await fetchUserRole();
  };

  // Listen for auth changes and update role
  useEffect(() => {
    fetchUserRole();
  }, [currentUser]);

  return (
    <SubscriptionContext.Provider value={{ userRole, isLoading, refreshUserRole }}>
      {children}
    </SubscriptionContext.Provider>
  );
};
