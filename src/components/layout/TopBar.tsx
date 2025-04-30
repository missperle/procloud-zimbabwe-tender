
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, ChevronDown, CreditCard, LogOut, Search, Settings, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import LogoutButton from '@/components/auth/LogoutButton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const TopBar = () => {
  const { currentUser } = useAuth();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const getUserInitials = () => {
    if (!currentUser?.email) return "U";
    
    const emailParts = currentUser.email.split('@');
    const namePart = emailParts[0];
    
    if (namePart.includes('.')) {
      // If email has format like "first.last@example.com"
      const parts = namePart.split('.');
      return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase();
    }
    
    return namePart.substring(0, 2).toUpperCase();
  };
  
  return (
    <header className="top-bar sticky top-0 z-50 bg-white border-b border-procloud-gray-200 px-6 h-16 flex items-center justify-between">
      <div className="logo-area flex items-center">
        <Link to="/" className="font-montserrat font-extrabold text-lg">
          Proverb Digital
        </Link>
      </div>
      
      <div className="search-container flex-grow mx-8 max-w-xl relative">
        <div className="relative">
          <Input 
            type="search"
            placeholder="Search projects, freelancers..."
            className="pl-10 rounded-full border border-procloud-gray-300 h-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-procloud-gray-400" />
        </div>
      </div>
      
      <nav className="flex items-center space-x-6">
        {currentUser ? (
          <>
            <Link 
              to="/explore" 
              className={`text-sm font-medium transition-colors hidden md:block ${
                location.pathname === '/explore' ? 'text-procloud-green' : 'hover:text-procloud-green'
              }`}
            >
              Explore
            </Link>
            <Link 
              to="/dashboard" 
              className={`text-sm font-medium transition-colors hidden md:block ${
                location.pathname === '/dashboard' ? 'text-procloud-green' : 'hover:text-procloud-green'
              }`}
            >
              Dashboard
            </Link>
            <button className="relative">
              <Bell className="h-5 w-5 text-gray-600 hover:text-procloud-green transition-colors" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">3</span>
            </button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`} />
                    <AvatarFallback>{getUserInitials()}</AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-4 w-4 text-gray-600" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5 text-sm">
                  <p className="font-medium">{currentUser.email?.split('@')[0]}</p>
                  <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="flex cursor-pointer items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
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
          </>
        ) : (
          <div className="flex items-center space-x-3">
            <Link 
              to="/explore" 
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/explore' ? 'text-procloud-green' : 'hover:text-procloud-green'
              }`}
            >
              Explore
            </Link>
            <Link 
              to="/jobs" 
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/jobs' ? 'text-procloud-green' : 'hover:text-procloud-green'
              }`}
            >
              Jobs
            </Link>
            <Link to="/login" className="text-sm font-medium hover:text-procloud-green transition-colors">
              Log in
            </Link>
            <Link to="/signup">
              <button className="px-4 py-1.5 bg-procloud-black text-white rounded-full text-sm font-medium hover:bg-procloud-gray-800 transition-colors">
                Sign up
              </button>
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default TopBar;
