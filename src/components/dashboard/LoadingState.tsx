
import Layout from "@/components/layout/Layout";

interface LoadingStateProps {
  message?: string;
}

const LoadingState = ({ message = "Loading..." }: LoadingStateProps) => {
  return (
    <Layout>
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">{message}</p>
        </div>
      </div>
    </Layout>
  );
};

export default LoadingState;
