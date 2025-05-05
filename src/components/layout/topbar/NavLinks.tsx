
import { Link, useLocation } from 'react-router-dom';

interface NavLinkProps {
  to: string;
  label: string;
  mobileOnly?: boolean;
}

const NavLink = ({ to, label, mobileOnly = false }: NavLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`text-sm font-medium transition-colors ${mobileOnly ? 'hidden md:block' : ''} ${
        isActive ? 'text-procloud-green' : 'hover:text-procloud-green'
      }`}
    >
      {label}
    </Link>
  );
};

interface NavLinksProps {
  userRole?: string | null;
  isLoggedIn: boolean;
}

const NavLinks = ({ userRole, isLoggedIn }: NavLinksProps) => {
  return (
    <nav className="flex items-center space-x-6">
      <NavLink to="/explore" label="Explore" />
      {isLoggedIn && (
        <>
          <NavLink to="/client-dashboard" label="Dashboard" mobileOnly />
          <NavLink to="/pricing" label="Your Plan" mobileOnly />
          {userRole === "agency" && (
            <NavLink to="/agency/review" label="Agency Review" mobileOnly />
          )}
        </>
      )}
      {!isLoggedIn && (
        <>
          <NavLink to="/jobs" label="Jobs" />
        </>
      )}
    </nav>
  );
};

export default NavLinks;
