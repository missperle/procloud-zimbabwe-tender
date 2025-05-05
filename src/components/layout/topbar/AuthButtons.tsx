
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const AuthButtons = () => {
  const location = useLocation();
  
  return (
    <div className="flex items-center space-x-3">
      <Link to="/login" className="text-sm font-medium hover:text-procloud-green transition-colors">
        Log in
      </Link>
      <Link to="/role-selection" state={{ from: location.pathname }}>
        <button className="px-4 py-1.5 bg-procloud-black text-white rounded-full text-sm font-medium hover:bg-procloud-gray-800 transition-colors">
          Sign up
        </button>
      </Link>
    </div>
  );
};

export default AuthButtons;
