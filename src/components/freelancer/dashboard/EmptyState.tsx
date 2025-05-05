
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  actionLink?: string;
}

const EmptyState = ({ title, description, actionText, actionLink }: EmptyStateProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-gray-500 mb-6">
            {description}
          </p>
          {actionText && actionLink && (
            <Link to={actionLink}>
              <Button>{actionText}</Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EmptyState;
