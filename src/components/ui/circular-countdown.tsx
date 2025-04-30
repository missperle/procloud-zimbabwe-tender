
import { useEffect, useState } from 'react';

interface CircularCountdownProps {
  value: number;
  maxValue: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  bgColor?: string;
}

export const CircularCountdown = ({
  value,
  maxValue,
  size = 40,
  strokeWidth = 3,
  color = 'var(--accent)',
  bgColor = 'rgba(240, 90, 40, 0.1)',
}: CircularCountdownProps) => {
  const [progress, setProgress] = useState(0);
  
  // Animation effect
  useEffect(() => {
    // Calculate the percentage
    const percentage = (value / maxValue) * 100;
    
    // Animate from 0 to the actual percentage
    const timeoutId = setTimeout(() => {
      setProgress(percentage);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [value, maxValue]);
  
  // SVG parameters
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={bgColor}
          fill="none"
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={color}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          fill="none"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      
      {/* Clock icon in the middle */}
      <div 
        className="absolute inset-0 flex items-center justify-center"
        style={{ color }}
      >
        <svg
          width={size / 2.5}
          height={size / 2.5}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      </div>
    </div>
  );
};
