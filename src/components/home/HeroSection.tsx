
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLayoutEffect, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register the ScrollTrigger plugin with GSAP
gsap.registerPlugin(ScrollTrigger);

// Create a custom hook to handle GSAP useEffect with SSR concerns
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const HeroSection = () => {
  // Set up GSAP scroll trigger effect
  useIsomorphicLayoutEffect(() => {
    // Get all sections within the hero-scroll-container
    const sections = gsap.utils.toArray(".hero-scroll-container section");
    
    // Set up scroll animations for each section
    sections.forEach((sec, i) => {
      const mask = sec.querySelector(".section-mask");
      const panel = sec.querySelector(".section-content");

      // Skip if any elements are missing or if it's the last section
      if (!mask || !panel || i === sections.length - 1) return;
      
      const next = sections[i + 1] as HTMLElement;
      const nextPanel = next?.querySelector(".section-content");
      
      // Skip if next panel doesn't exist
      if (!nextPanel) return;
      
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
      .fromTo(mask,
        { height: 0 },
        { height: "100%", ease: "power2.out" }
      )
      // Slide the next section's content from y:100% to 0
      .fromTo(nextPanel,
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
    <div className="hero-scroll-container">
      <section className="hero-section full-height-section">
        <div className="section-content hero-panel">
          <div className="hero relative overflow-hidden py-20 md:py-32 bg-white min-h-screen flex items-center">
            {/* Floating Thumbnails */}
            <div className="absolute inset-0 overflow-hidden">
              {/* Top-left thumbnail */}
              <div className="absolute -top-10 -left-10 w-48 h-48 rounded-lg shadow-lg transform -rotate-6 bg-cover bg-center" 
                style={{ backgroundImage: "url('/src/assets/images/placeholder-1.jpg')" }}>
              </div>
              
              {/* Top-right thumbnail */}
              <div className="absolute top-20 -right-10 w-56 h-40 rounded-lg shadow-lg transform rotate-8 bg-cover bg-center" 
                style={{ backgroundImage: "url('/src/assets/images/placeholder-2.jpg')" }}>
              </div>
              
              {/* Bottom-left thumbnail */}
              <div className="absolute -bottom-10 left-40 w-52 h-52 rounded-lg shadow-lg transform rotate-12 bg-cover bg-center" 
                style={{ backgroundImage: "url('/src/assets/images/placeholder-3.jpg')" }}>
              </div>
              
              {/* Bottom-right thumbnail */}
              <div className="absolute bottom-40 -right-20 w-64 h-48 rounded-lg shadow-lg transform -rotate-10 bg-cover bg-center" 
                style={{ backgroundImage: "url('/src/assets/images/placeholder-4.jpg')" }}>
              </div>
              
              {/* Middle-left thumbnail */}
              <div className="absolute top-1/2 -left-16 w-48 h-36 rounded-lg shadow-lg transform rotate-3 bg-cover bg-center" 
                style={{ backgroundImage: "url('/src/assets/images/placeholder-5.jpg')" }}>
              </div>
            </div>
            
            <div className="container mx-auto px-4 relative z-10">
              <div className="hero-content max-w-4xl mx-auto text-center">
                <h1 className="font-montserrat font-extrabold text-4xl md:text-5xl lg:text-6xl mb-6 text-[#111]">
                  Zimbabwe's <span className="highlight text-indigo-ink">Best Creators</span> Are On ProCloud
                </h1>
                
                <p className="subhead text-lg md:text-xl text-[#555] max-w-2xl mx-auto mb-10">
                  A comprehensive platform to connect local freelancers with businesses.
                </p>
                
                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
                  <Link to="/post-job">
                    <Button 
                      size="lg" 
                      className="btn-primary text-lg font-medium bg-indigo-ink text-white hover:opacity-90 hover:bg-indigo-ink"
                    >
                      Hire a Freelancer
                    </Button>
                  </Link>
                  <Link to="/jobs">
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="text-lg font-medium border-2 border-indigo-ink text-indigo-ink bg-white hover:opacity-90 hover:bg-white"
                    >
                      Try Pro Features
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="section-mask"></div>
      </section>
    </div>
  );
};

export default HeroSection;
