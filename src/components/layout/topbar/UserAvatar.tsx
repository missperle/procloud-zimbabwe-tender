
import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";

interface UserAvatarProps {
  userId: string | undefined;
  email: string | undefined;
  size?: "sm" | "md" | "lg";
}

const UserAvatar = ({ userId, email, size = "md" }: UserAvatarProps) => {
  const [role, setRole] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchUserRole = async () => {
      if (!userId) return;
      
      try {
        const { data, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', userId)
          .single();
        
        if (error) {
          console.error("Error fetching user role:", error);
        } else if (data) {
          setRole(data.role);
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };
    
    fetchUserRole();
  }, [userId]);

  const getUserInitials = () => {
    if (!email) return "U";
    
    const emailParts = email.split('@');
    const namePart = emailParts[0];
    
    if (namePart.includes('.')) {
      // If email has format like "first.last@example.com"
      const parts = namePart.split('.');
      return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase();
    }
    
    return namePart.substring(0, 2).toUpperCase();
  };

  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10"
  };

  return (
    <Avatar className={sizeClasses[size]}>
      <AvatarImage src={`https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`} />
      <AvatarFallback>{getUserInitials()}</AvatarFallback>
    </Avatar>
  );
};

export { UserAvatar, type UserAvatarProps };
export default UserAvatar;
