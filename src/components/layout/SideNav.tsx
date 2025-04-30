
import { Link } from 'react-router-dom';
import { LayoutGrid } from 'lucide-react';

const SideNav = () => {
  return (
    <div className="sidenav">
      <div className="pt-6">
        <Link to="/">
          <LayoutGrid size={24} className="text-procloud-black hover:text-procloud-green transition-colors" />
        </Link>
      </div>
      
      <div className="sidenav-logo py-8">
        Proverb Digital Cloud Agency
      </div>
      
      <div className="pb-6 flex flex-col gap-4 items-center">
        <Link to="/subscribe" className="text-sm font-medium hover:text-procloud-green transition-colors">
          Subscribe
        </Link>
        <Link to="/instagram" className="text-sm font-medium hover:text-procloud-green transition-colors">
          IG
        </Link>
      </div>
    </div>
  );
};

export default SideNav;
