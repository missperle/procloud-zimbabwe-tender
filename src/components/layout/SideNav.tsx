
import { Link } from 'react-router-dom';
import { LayoutGrid, Instagram, Mail } from 'lucide-react';

const SideNav = () => {
  return (
    <div className="sidenav">
      <div className="pt-6">
        <Link to="/">
          <LayoutGrid size={24} className="sidenav-icon text-procloud-black hover:text-procloud-green transition-colors" />
        </Link>
      </div>
      
      <div className="sidenav-logo py-8">
        Proverb Digital Cloud Agency
      </div>
      
      <div className="sidenav-footer">
        <Link to="/subscribe" className="hover:text-procloud-gold transition-colors">
          Subscribe
        </Link>
        <a href="https://instagram.com/proverbdigital" target="_blank" rel="noopener noreferrer" className="sidenav-icon hover:text-procloud-gold transition-colors">
          <Instagram size={18} className="inline mr-1" />
          <span className="sr-only">Instagram</span>
        </a>
      </div>
    </div>
  );
};

export default SideNav;
