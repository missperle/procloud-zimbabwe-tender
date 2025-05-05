
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProfileCompletionProps {
  profileCompletion: number;
}

const ProfileCompletion = ({ profileCompletion }: ProfileCompletionProps) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Profile Completion</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-2">
          <div className="h-2 flex-1 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-procloud-green rounded-full" 
              style={{ width: `${profileCompletion}%` }}
            ></div>
          </div>
          <span className="ml-4 font-medium">{profileCompletion}%</span>
        </div>
        
        {profileCompletion < 100 && (
          <Link to="/freelancer-profile-edit">
            <Button variant="outline" size="sm" className="mt-2">
              Complete Your Profile
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileCompletion;
