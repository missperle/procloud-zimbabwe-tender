
import React from 'react';

interface FloatingDotsProps {
  className?: string;
}

const FloatingDots = ({ className = "" }: FloatingDotsProps) => {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <div className="absolute h-2 w-2 rounded-full bg-procloud-green/30 animate-float animation-delay-200" style={{ top: '10%', left: '5%' }} />
      <div className="absolute h-3 w-3 rounded-full bg-procloud-green/20 animate-float animation-delay-400" style={{ top: '30%', left: '15%' }} />
      <div className="absolute h-2 w-2 rounded-full bg-procloud-green/30 animate-float" style={{ top: '50%', left: '8%' }} />
      <div className="absolute h-1.5 w-1.5 rounded-full bg-procloud-gold/40 animate-float animation-delay-200" style={{ top: '20%', right: '15%' }} />
      <div className="absolute h-3 w-3 rounded-full bg-procloud-green/20 animate-float animation-delay-400" style={{ top: '60%', right: '5%' }} />
      <div className="absolute h-2 w-2 rounded-full bg-procloud-gold/30 animate-float" style={{ top: '80%', right: '10%' }} />
    </div>
  );
};

export default FloatingDots;
