
import { ReactNode, useEffect, useLayoutEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import SideNav from "./SideNav";
import TopBar from "./TopBar";
import CategoryNav from "./CategoryNav";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register the ScrollTrigger plugin with GSAP
gsap.registerPlugin(ScrollTrigger);

// Create a custom hook to handle GSAP useEffect with SSR concerns
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  // Set up GSAP scroll trigger effect
  useIsomorphicLayoutEffect(() => {
    // Get all sections
    const sections = gsap.utils.toArray("section.full-height-section");
    
    // Set up scroll animations for each section
    sections.forEach((sec: any, i) => {
      // Skip the last section as it doesn't need to transition to another
      if (i === sections.length - 1) return;
      
      const next = sections[i + 1] as HTMLElement;
      
      // Create a timeline for each section transition
      gsap.timeline({
        scrollTrigger: {
          trigger: sec,
          start: "bottom bottom",
          end: () => `+=${window.innerHeight}`,
          scrub: true,
          pin: true,
          // For debugging:
          // markers: true,
        }
      })
      // Animate the mask overlay from height 0 to 100%
      .fromTo(sec.querySelector(".section-mask"),
        { height: 0 },
        { height: "100%", ease: "power2.out" }
      )
      // Slide the next section's content from y:100% to 0
      .fromTo(next.querySelector(".section-content"),
        { y: "100%" },
        { y: "0%", ease: "power2.out" },
        0
      );
    });
    
    // Clean up on component unmount
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="app-wrapper flex">
      <SideNav />
      <div className="main-content flex-grow scroll-container">
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
