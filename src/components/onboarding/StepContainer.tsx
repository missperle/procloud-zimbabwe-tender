
import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface StepContainerProps {
  title: string;
  description?: string;
  children: ReactNode;
}

const StepContainer = ({ title, description, children }: StepContainerProps) => {
  return (
    <Card className="w-full">
      <CardContent className="pt-6 space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">{title}</h3>
          {description && (
            <p className="text-gray-500 mb-4">{description}</p>
          )}
        </div>
        {children}
      </CardContent>
    </Card>
  );
};

export default StepContainer;
