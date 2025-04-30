
import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import SideNav from "./SideNav";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="app-wrapper flex">
      <SideNav />
      <div className="main-content flex-grow">
        <Navbar />
        <main className="flex-grow pt-16">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
