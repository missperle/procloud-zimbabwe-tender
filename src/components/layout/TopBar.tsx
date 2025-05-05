
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import SearchBar from './topbar/SearchBar';
import NotificationButton from './topbar/NotificationButton';
import UserMenu from './topbar/UserMenu';
import NavLinks from './topbar/NavLinks';
import AuthButtons from './topbar/AuthButtons';
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

const TopBar = () => {
  const { currentUser } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!currentUser) return;
      
      try {
        const { data, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', currentUser.id)
          .single();
        
        if (error) {
          console.error("Error fetching user role:", error);
        } else if (data) {
          setUserRole(data.role);
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };
    
    fetchUserRole();
  }, [currentUser]);
  
  return (
    <header className="top-bar sticky top-0 z-50 bg-white border-b border-procloud-gray-200 px-6 h-16 flex items-center justify-between">
      <div className="logo-area flex items-center">
        <Link to="/" className="font-montserrat font-extrabold text-lg">
          Proverb Digital
        </Link>
      </div>
      
      <SearchBar 
        placeholder="Search projects, freelancers..." 
        className="flex-grow mx-8 max-w-xl"
      />
      
      <div className="flex items-center space-x-6">
        {currentUser ? (
          <>
            <NavLinks userRole={userRole} isLoggedIn={true} />
            <NotificationButton count={3} />
            <UserMenu userRole={userRole} />
          </>
        ) : (
          <div className="flex items-center space-x-3">
            <NavLinks isLoggedIn={false} />
            <AuthButtons />
          </div>
        )}
      </div>
    </header>
  );
};

export default TopBar;
