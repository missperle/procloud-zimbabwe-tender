
import { useEffect, useRef } from 'react';

interface SparklineProps {
  data: number[];
  height?: number;
  width?: string;
  color?: string;
  lineWidth?: number;
  fillOpacity?: number;
}

export const Sparkline = ({
  data,
  height = 30,
  width = '100%',
  color = '#F05A28',
  lineWidth = 1.5,
  fillOpacity = 0.1
}: SparklineProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current || data.length === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set canvas dimensions to match its display size
    canvas.width = canvas.offsetWidth;
    canvas.height = height;
    
    // Calculate min and max values for scaling
    const minValue = Math.min(...data);
    const maxValue = Math.max(...data);
    const range = maxValue - minValue || 1; // Avoid division by zero
    
    // Calculate x step based on canvas width and data length
    const xStep = canvas.width / (data.length - 1);
    
    // Start the path for the line
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - ((data[0] - minValue) / range) * canvas.height);
    
    // Draw the line
    for (let i = 1; i < data.length; i++) {
      const x = i * xStep;
      const y = canvas.height - ((data[i] - minValue) / range) * canvas.height;
      ctx.lineTo(x, y);
    }
    
    // Line style
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.stroke();
    
    // Fill area under the line
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();
    ctx.fillStyle = `${color}${Math.round(fillOpacity * 255).toString(16).padStart(2, '0')}`;
    ctx.fill();
    
    // Add dots at each data point for emphasis
    for (let i = 0; i < data.length; i++) {
      const x = i * xStep;
      const y = canvas.height - ((data[i] - minValue) / range) * canvas.height;
      
      ctx.beginPath();
      ctx.arc(x, y, lineWidth + 0.5, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    }
    
    // Add a slightly larger dot at the last data point for emphasis
    const lastX = (data.length - 1) * xStep;
    const lastY = canvas.height - ((data[data.length - 1] - minValue) / range) * canvas.height;
    ctx.beginPath();
    ctx.arc(lastX, lastY, lineWidth + 1.5, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    
  }, [data, height, color, lineWidth, fillOpacity]);
  
  return (
    <div className="w-full sparkline-container">
      <canvas 
        ref={canvasRef} 
        style={{ width, height, display: 'block' }}
        className="sparkline"
      />
    </div>
  );
};
