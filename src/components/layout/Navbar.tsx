import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import LogoutButton from '@/components/auth/LogoutButton';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser } = useAuth();
  const location = useLocation();
  
  return (
    <header className="bg-white border-b border-procloud-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center px-4">
            {/* Logo Image */}
            <img 
              src="/logo.svg" 
              alt="Proverb Digital Cloud Agency" 
              className="navbar-logo h-8 md:h-10" 
            />
          </Link>
          
          <nav className="hidden md:flex items-center space-x-3 navbar">
            <Link 
              to="/explore" 
              className={`text-sm font-medium transition-colors px-6 ${
                location.pathname === '/explore' ? 'text-procloud-green' : 'hover:text-procloud-green'
              }`}
            >
              Explore
            </Link>
            <Link 
              to="/jobs" 
              className={`text-sm font-medium transition-colors px-6 ${
                location.pathname === '/jobs' ? 'text-procloud-green' : 'hover:text-procloud-green'
              }`}
            >
              Jobs
            </Link>
          </nav>
          
          <div className="hidden md:flex items-center space-x-3">
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium">
                  {currentUser.email}
                </span>
                <LogoutButton />
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Log in
                  </Button>
                </Link>
                
                <Link to="/signup">
                  <Button size="sm" className="text-white">
                    Sign up
                  </Button>
                </Link>
              </>
            )}
          </div>
          
          <button 
            className="md:hidden p-2" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-procloud-gray-200">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/explore" 
                className={`px-4 py-2 text-sm font-medium hover:bg-procloud-gray-100 rounded-md ${
                  location.pathname === '/explore' ? 'text-procloud-green' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Explore
              </Link>
              <Link 
                to="/jobs" 
                className={`px-4 py-2 text-sm font-medium hover:bg-procloud-gray-100 rounded-md ${
                  location.pathname === '/jobs' ? 'text-procloud-green' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Jobs
              </Link>
              
              {currentUser ? (
                <div className="pt-2 flex flex-col space-y-2">
                  <div className="px-4 py-2 text-sm font-medium">
                    {currentUser.email}
                  </div>
                  <div onClick={() => setIsMenuOpen(false)}>
                    <LogoutButton />
                  </div>
                </div>
              ) : (
                <div className="pt-2 flex flex-col space-y-2">
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Log in
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full text-white">
                      Sign up
                    </Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
