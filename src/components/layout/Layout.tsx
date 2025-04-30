
import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import SideNav from "./SideNav";
import TopBar from "./TopBar";
import CategoryNav from "./CategoryNav";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="app-wrapper flex">
      <SideNav />
      <div className="main-content flex-grow">
        <TopBar />
        <CategoryNav />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
