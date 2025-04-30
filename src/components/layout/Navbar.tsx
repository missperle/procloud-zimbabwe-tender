
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-procloud-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center px-4">
            {/* Desktop Logo */}
            <div className="hidden md:block font-montserrat font-bold tracking-tight leading-none">
              <span className="text-black uppercase">PROVERB </span>
              <span className="text-teal-pulse uppercase">DIGITAL CLOUD AGENCY</span>
            </div>
            
            {/* Mobile Logo */}
            <div className="md:hidden font-montserrat font-bold tracking-tight text-xs leading-tight">
              <div className="text-black uppercase">PROVERB</div>
              <div className="text-teal-pulse uppercase">DIGITAL CLOUD</div>
              <div className="text-teal-pulse uppercase">AGENCY</div>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/jobs" className="text-sm font-medium hover:text-procloud-green transition-colors">
              Find Jobs
            </Link>
            <Link to="/freelancers" className="text-sm font-medium hover:text-procloud-green transition-colors">
              Freelancers
            </Link>
            <Link to="/how-it-works" className="text-sm font-medium hover:text-procloud-green transition-colors">
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
              <Button size="sm" className="bg-procloud-green hover:bg-procloud-green-dark text-black">
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
                  <Button className="w-full bg-procloud-green hover:bg-procloud-green-dark text-black">
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
