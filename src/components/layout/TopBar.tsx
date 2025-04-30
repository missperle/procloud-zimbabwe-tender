
import { Link, useLocation } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import LogoutButton from '@/components/auth/LogoutButton';

const TopBar = () => {
  const { currentUser } = useAuth();
  const location = useLocation();

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
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-procloud-gray-400" />
        </div>
      </div>
      
      <nav className="flex items-center space-x-6">
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
        
        {currentUser ? (
          <div className="flex items-center space-x-3">
            <div className="text-sm font-medium">
              {currentUser.email}
            </div>
            <LogoutButton />
          </div>
        ) : (
          <div className="flex items-center space-x-3">
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
