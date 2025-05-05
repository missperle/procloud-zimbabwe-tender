
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, LogOut, Settings, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from 'lucide-react';
import LogoutButton from '@/components/auth/LogoutButton';
import UserAvatar from './UserAvatar';
import { useAuth } from '@/contexts/SupabaseAuthContext';

interface UserMenuProps {
  userRole?: string | null;
}

const UserMenu = ({ userRole }: UserMenuProps) => {
  const { currentUser } = useAuth();
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center space-x-2">
          <UserAvatar userId={currentUser?.id} email={currentUser?.email} />
          <ChevronDown className="h-4 w-4 text-gray-600" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5 text-sm">
          <p className="font-medium">{currentUser?.email?.split('@')[0]}</p>
          <p className="text-xs text-muted-foreground">{currentUser?.email}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/client-dashboard" className="flex cursor-pointer items-center">
            <User className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/pricing" className="flex cursor-pointer items-center">
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Your Plan</span>
          </Link>
        </DropdownMenuItem>
        {userRole === "agency" && (
          <DropdownMenuItem asChild>
            <Link to="/agency/review" className="flex cursor-pointer items-center">
              <User className="mr-2 h-4 w-4" />
              <span>Agency Review</span>
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
          <Link to="/dashboard?tab=payments" className="flex cursor-pointer items-center">
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Payments</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/dashboard?tab=profile" className="flex cursor-pointer items-center">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex cursor-pointer items-center text-red-600 focus:bg-red-50">
          <LogOut className="mr-2 h-4 w-4" />
          <LogoutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
