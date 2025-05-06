
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronUp, UserPlus, Briefcase } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const HeroSection = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Handle scroll events to update our progress and animations
  useEffect(() => {
    const scrollContainer = document.querySelector('.scroll-container');
    if (!scrollContainer) return;
    
    const handleScroll = () => {
      const scrollPosition = scrollContainer.scrollTop;
      const maxScroll = window.innerHeight;
      const progress = Math.min(100, (scrollPosition / maxScroll) * 100);
      
      setScrollProgress(progress);
      
      if (scrollPosition > 20 && !hasScrolled) {
        setHasScrolled(true);
      } else if (scrollPosition <= 20 && hasScrolled) {
        setHasScrolled(false);
      }
    };
    
    scrollContainer.addEventListener('scroll', handleScroll);
    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, [hasScrolled]);
  
  return (
    <section className="hero-section full-height-section">
      <div className="section-content hero-panel">
        {/* Hero Content */}
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
          
          {/* Main Hero Content with Pin-and-Transform Effect */}
          <div className="container mx-auto px-4 relative z-10">
            <div className="hero-content max-w-4xl mx-auto text-center">
              {/* Pinned Header that slides out on scroll */}
              <div className={`sticky-header ${scrollProgress > 0 ? 'transforming' : ''}`} 
                   style={{ 
                     transform: `scale(${Math.max(0.8, 1 - scrollProgress/100*0.2)}) 
                                translateY(${-scrollProgress}px)`,
                     opacity: Math.max(0, 1 - scrollProgress/50)
                   }}>
                <h1 className="shiny font-montserrat font-extrabold text-4xl md:text-5xl lg:text-6xl mb-6 text-[#111]">
                  Zimbabwe's <span>Best Creators</span> Are On ProCloud
                </h1>
              </div>
              
              <p className="subhead text-lg md:text-xl text-[#555] max-w-2xl mx-auto mb-10"
                 style={{ 
                   transform: `translateY(${scrollProgress * 0.5}px)`,
                   opacity: Math.max(0, 1 - scrollProgress/40)
                 }}>
                A comprehensive platform to connect local freelancers with businesses.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10"
                   style={{ 
                     transform: `translateY(${scrollProgress * 0.6}px)`,
                     opacity: Math.max(0, 1 - scrollProgress/30)
                   }}>
                <Link to="/signup/client">
                  <Button 
                    size="lg" 
                    className="btn-primary text-lg font-medium bg-indigo-ink text-white hover:opacity-90 hover:bg-indigo-ink flex items-center gap-2"
                  >
                    <Briefcase size={20} />
                    Sign up as a Client
                  </Button>
                </Link>
                <Link to="/signup/freelancer">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="text-lg font-medium border-2 border-indigo-ink text-indigo-ink bg-white hover:opacity-90 hover:bg-white flex items-center gap-2"
                  >
                    <UserPlus size={20} />
                    Join as a Freelancer
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Scroll Indicator */}
          <div className={`scroll-indicator ${hasScrolled ? 'fade-out' : ''}`}>
            <div className="flex flex-col items-center">
              <span className="text-sm mb-2 text-gray-500">Swipe Up</span>
              <ChevronUp size={24} className="animate-bounce text-indigo-ink" />
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="progress-container">
            <Progress value={scrollProgress} className="w-16 h-1" />
          </div>
          
          {/* Section Indicator Dots */}
          <div className="section-dots">
            <div className={`dot ${scrollProgress < 50 ? 'active' : ''}`}></div>
            <div className={`dot ${scrollProgress >= 50 ? 'active' : ''}`}></div>
          </div>
        </div>
      </div>
      
      {/* Gradient Mask That Reveals on Scroll */}
      <div className="section-mask" 
           style={{ 
             height: `${scrollProgress}%`,
             background: `linear-gradient(135deg, #1E3A8A ${100-scrollProgress}%, #3949AB ${Math.min(100, 120-scrollProgress)}%)` 
           }}>
      </div>
    </section>
  );
};

export default HeroSection;
