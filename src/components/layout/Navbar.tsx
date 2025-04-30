
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-procloud-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo has been removed */}
          
          <nav className="hidden md:flex items-center space-x-3 navbar">
            <Link to="/jobs" className="text-sm font-medium hover:text-procloud-green transition-colors px-6">
              Find Jobs
            </Link>
            <Link to="/freelancers" className="text-sm font-medium hover:text-procloud-green transition-colors px-6">
              Freelancers
            </Link>
            <Link to="/how-it-works" className="text-sm font-medium hover:text-procloud-green transition-colors px-6">
              How It Works
            </Link>
          </nav>
          
          <div className="hidden md:flex items-center space-x-3">
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
                to="/jobs" 
                className="px-4 py-2 text-sm font-medium hover:bg-procloud-gray-100 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Find Jobs
              </Link>
              <Link 
                to="/freelancers" 
                className="px-4 py-2 text-sm font-medium hover:bg-procloud-gray-100 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Freelancers
              </Link>
              <Link 
                to="/how-it-works" 
                className="px-4 py-2 text-sm font-medium hover:bg-procloud-gray-100 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                How It Works
              </Link>
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
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
