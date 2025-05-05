
import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import SideNav from "./SideNav";
import TopBar from "./TopBar";
import CategoryNav from "./CategoryNav";

interface LayoutProps {
  children: ReactNode;
  activeCategory?: string;
  onCategoryChange?: (category: string) => void;
}

const Layout = ({ children, activeCategory, onCategoryChange }: LayoutProps) => {
  const location = useLocation();
  const showCategoryNav = location.pathname === '/explore';
  
  return (
    <div className="app-wrapper flex">
      <SideNav />
      <div className="main-content flex-grow">
        <TopBar />
        {showCategoryNav && <CategoryNav activeCategory={activeCategory} onCategoryChange={onCategoryChange} />}
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
