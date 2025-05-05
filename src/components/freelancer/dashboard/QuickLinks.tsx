
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { File, Edit } from "lucide-react";

const QuickLinks = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Links</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Link to="/jobs">
            <Button variant="outline" className="w-full justify-start">
              <File className="mr-2 h-4 w-4" />
              Browse Jobs
            </Button>
          </Link>
          <Link to="/freelancer-profile-edit">
            <Button variant="outline" className="w-full justify-start">
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickLinks;
