
import { Skeleton } from "@/components/ui/skeleton";
import Layout from "@/components/layout/Layout";

export interface LoadingStateProps {
  message?: string;
  variant?: "spinner" | "skeleton";
  showLayout?: boolean;
  height?: string;
  items?: number;
  className?: string;
}

const LoadingState = ({ 
  message = "Loading...", 
  variant = "spinner",
  showLayout = true,
  height = "calc(100vh-200px)",
  items = 3,
  className = ""
}: LoadingStateProps) => {
  const content = variant === "spinner" ? (
    <div className={`flex items-center justify-center min-h-[${height}] ${className}`}>
      <div className="text-center">
        <div className="h-8 w-8 border-4 border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
        {message && <p className="text-gray-500">{message}</p>}
      </div>
    </div>
  ) : (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-20 w-full" />
        </div>
      ))}
    </div>
  );

  if (showLayout) {
    return <Layout>{content}</Layout>;
  }

  return content;
};

export default LoadingState;
