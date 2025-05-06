
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const AuthenticationWall: React.FC = () => {
  return (
    <Card className="p-8 text-center">
      <h3 className="text-lg font-medium mb-2">Authentication Required</h3>
      <p className="text-gray-500 mb-4">
        Please log in to view and manage your briefs.
      </p>
      <Link to="/login">
        <Button>
          Log In
        </Button>
      </Link>
    </Card>
  );
};

export default AuthenticationWall;
