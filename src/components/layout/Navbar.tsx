
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import ClientLoginModal from '@/components/auth/ClientLoginModal';
import BusinessLoginModal from '@/components/auth/BusinessLoginModal';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDialog, setActiveDialog] = useState<'client' | 'business' | null>(null);

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
            <Dialog open={activeDialog === 'client'} onOpenChange={(open) => setActiveDialog(open ? 'client' : null)}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-indigo-ink text-white hover:bg-indigo-dark px-5 py-3 rounded-md"
                  aria-label="Client Login"
                >
                  Client Login
                </Button>
              </DialogTrigger>
              <DialogContent>
                <ClientLoginModal />
              </DialogContent>
            </Dialog>
            
            <Dialog open={activeDialog === 'business'} onOpenChange={(open) => setActiveDialog(open ? 'business' : null)}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-amber-burst text-black hover:bg-amber-burst/90 px-5 py-3 rounded-md"
                  aria-label="Business Login"
                >
                  Business Login
                </Button>
              </DialogTrigger>
              <DialogContent>
                <BusinessLoginModal />
              </DialogContent>
            </Dialog>
            
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
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full bg-indigo-ink text-white hover:bg-indigo-dark"
                      aria-label="Client Login"
                    >
                      Client Login
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <ClientLoginModal />
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full bg-amber-burst text-black hover:bg-amber-burst/90"
                      aria-label="Business Login"
                    >
                      Business Login
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <BusinessLoginModal />
                  </DialogContent>
                </Dialog>
                
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
