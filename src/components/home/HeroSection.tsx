
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import FloatingShapes from "../ui/floating-shapes";

const HeroSection = () => {
  return <section className="relative overflow-hidden py-20 md:py-32 bg-procloud-black text-white">
      {/* Rotating Halo Effect */}
      <div className="absolute inset-0 w-[200%] h-[200%] top-[-50%] left-[-50%] animate-spin-slow">
        <div className="w-full h-full rounded-full bg-gradient-radial from-[rgba(30,58,138,0.15)] to-transparent" />
      </div>
      
      <FloatingShapes density="medium" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="mb-6 leading-tight">
            <span className="inline-block text-9xl text-indigo-500">Zimbabwe's Premier</span>
            <br />
            <span className="text-outline-white text-slate-50">Digital Tender</span>
            <span className="inline-block"> Platform</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-procloud-gray-300 max-w-2xl mx-auto text-balance">
            Connecting talented local freelancers with businesses through a transparent, no-bid platform.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
            <Link to="/post-job">
              <Button size="lg" className="text-lg w-full sm:w-auto bg-procloud-green hover:bg-procloud-gold hover:text-black font-medium">
                Post a Brief
              </Button>
            </Link>
            <Link to="/jobs">
              <Button size="lg" className="text-lg w-full sm:w-auto border-2 border-procloud-green text-procloud-green bg-white hover:bg-procloud-green hover:text-white transition-colors font-medium">
                Browse Jobs
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
    </section>;
};

export default HeroSection;// src/components/home/HeroSection.tsx
import React from 'react';

const HeroSection = () => (
  <div className="hero">            {/* ← add this */}
    <div className="hero-content">  {/* ← and wrap your existing content in this */}
      {/* Your existing H1, subheading, buttons, etc. */}
    </div>
  </div>
);

export default HeroSection;

