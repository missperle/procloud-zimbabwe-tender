
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const AuthButtons = () => {
  const location = useLocation();
  
  return (
    <div className="flex items-center space-x-3">
      <div className="flex gap-2">
        <Link to="/client-login" className="text-sm font-medium hover:text-procloud-green transition-colors">
          Client Login
        </Link>
        <span className="text-gray-400">|</span>
        <Link to="/freelancer-login" className="text-sm font-medium hover:text-procloud-green transition-colors">
          Freelancer Login
        </Link>
      </div>
      <Link to="/role-selection" state={{ from: location.pathname }}>
        <button className="px-4 py-1.5 bg-procloud-black text-white rounded-full text-sm font-medium hover:bg-procloud-gray-800 transition-colors">
          Sign up
        </button>
      </Link>
    </div>
  );
};

export default AuthButtons;
