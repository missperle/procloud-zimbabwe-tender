
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface FloatingShapesProps {
  className?: string;
  density?: "low" | "medium" | "high";
}

const FloatingShapes = ({ className, density = "medium" }: FloatingShapesProps) => {
  const [shapes, setShapes] = useState<JSX.Element[]>([]);
  
  useEffect(() => {
    const shapesCount = density === "low" ? 5 : density === "medium" ? 10 : 20;
    const shapeTypes = ["circle", "square", "triangle"];
    
    const generateShapes = () => {
      const newShapes = [];
      
      for (let i = 0; i < shapesCount; i++) {
        const size = Math.random() * 60 + 20;
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const animationDelay = Math.random() * 5;
        const animationDuration = 15 + Math.random() * 30;
        const opacity = Math.random() * 0.15 + 0.05;
        const rotation = Math.random() * 360;
        const shapeType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
        
        let shapeElement;
        if (shapeType === "circle") {
          shapeElement = (
            <div 
              key={i}
              className="absolute rounded-full bg-procloud-gray-800"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${left}%`,
                top: `${top}%`,
                opacity: opacity,
                transform: `rotate(${rotation}deg)`,
                animationDelay: `${animationDelay}s`,
                animationDuration: `${animationDuration}s`,
              }}
            />
          );
        } else if (shapeType === "square") {
          shapeElement = (
            <div 
              key={i}
              className="absolute bg-procloud-gray-800"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${left}%`,
                top: `${top}%`,
                opacity: opacity,
                transform: `rotate(${rotation}deg)`,
                animationDelay: `${animationDelay}s`,
                animationDuration: `${animationDuration}s`,
              }}
            />
          );
        } else {
          shapeElement = (
            <div 
              key={i}
              className="absolute"
              style={{
                width: 0,
                height: 0,
                borderLeft: `${size/2}px solid transparent`,
                borderRight: `${size/2}px solid transparent`,
                borderBottom: `${size}px solid rgba(38, 38, 38, ${opacity})`,
                left: `${left}%`,
                top: `${top}%`,
                transform: `rotate(${rotation}deg)`,
                animationDelay: `${animationDelay}s`,
                animationDuration: `${animationDuration}s`,
              }}
            />
          );
        }
        
        newShapes.push(shapeElement);
      }
      
      return newShapes;
    };
    
    setShapes(generateShapes());
  }, [density]);

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {shapes.map((shape, index) => (
        <div key={index} className="animate-float">{shape}</div>
      ))}
    </div>
  );
};

export default FloatingShapes;
