
import React, { useEffect, useRef } from 'react';

const HeroBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Wireframe sphere parameters
    const points: [number, number, number][] = [];
    const numPoints = 300;
    const radius = Math.min(canvas.width, canvas.height) * 0.4;
    
    // Generate points on a sphere
    for (let i = 0; i < numPoints; i++) {
      // Fibonacci sphere distribution for even point spacing
      const phi = Math.acos(1 - 2 * (i + 0.5) / numPoints);
      const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      points.push([x, y, z]);
    }
    
    // Animation loop
    let rotation = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      rotation += 0.002;
      
      // Draw connections between points
      ctx.strokeStyle = 'rgba(30, 58, 138, 0.15)';
      ctx.lineWidth = 0.5;
      
      for (let i = 0; i < points.length; i++) {
        const [x1, y1, z1] = points[i];
        
        // Apply rotation
        const x1r = x1 * Math.cos(rotation) - z1 * Math.sin(rotation);
        const z1r = x1 * Math.sin(rotation) + z1 * Math.cos(rotation);
        
        // Project 3D to 2D
        const scale = 800 / (800 + z1r);
        const projX1 = x1r * scale + canvas.width / 2;
        const projY1 = y1 * scale + canvas.height / 2;
        
        // Connect to nearest points
        for (let j = i + 1; j < points.length; j++) {
          const [x2, y2, z2] = points[j];
          
          // Apply rotation
          const x2r = x2 * Math.cos(rotation) - z2 * Math.sin(rotation);
          const z2r = x2 * Math.sin(rotation) + z2 * Math.cos(rotation);
          
          // Project 3D to 2D
          const scale2 = 800 / (800 + z2r);
          const projX2 = x2r * scale2 + canvas.width / 2;
          const projY2 = y2 * scale2 + canvas.height / 2;
          
          // Calculate distance
          const dx = projX2 - projX1;
          const dy = projY2 - projY1;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Only draw connections between nearby points
          if (distance < canvas.width * 0.15) {
            // Fade lines based on distance
            ctx.globalAlpha = 1 - distance / (canvas.width * 0.15);
            ctx.beginPath();
            ctx.moveTo(projX1, projY1);
            ctx.lineTo(projX2, projY2);
            ctx.stroke();
          }
        }
        
        // Draw point
        ctx.fillStyle = 'rgba(30, 58, 138, 0.2)';
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.arc(projX1, projY1, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.globalAlpha = 1;
      requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 z-0 w-full h-full"
    />
  );
};

export default HeroBackground;
