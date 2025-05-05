
import { ReactNode } from "react";
import SideNav from "./SideNav";
import TopBar from "./TopBar";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="app-wrapper flex">
      <SideNav />
      <div className="main-content flex-grow">
        <TopBar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
