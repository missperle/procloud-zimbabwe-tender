
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

interface ProfileViewProps {
  profileData: any | null;
}

const ProfileView = ({ profileData }: ProfileViewProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Your Freelancer Profile</h3>
          <Link to="/freelancer-profile-edit">
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </Link>
        </div>
        
        {profileData ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-500 mb-1">Professional Title</h4>
                <p>{profileData.title || "Not specified"}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-500 mb-1">Location</h4>
                <p>{profileData.location || "Not specified"}</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-500 mb-1">Bio</h4>
              <p>{profileData.bio || "No bio provided yet."}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-500 mb-1">Hourly Rate</h4>
                <p>{profileData.hourly_rate ? `$${profileData.hourly_rate}/hr` : "Not specified"}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-500 mb-1">Years of Experience</h4>
                <p>{profileData.years_experience || "Not specified"}</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-500 mb-1">Education</h4>
              <p>{profileData.education || "Not specified"}</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">You haven't completed your profile yet.</p>
            <Link to="/freelancer-profile-edit">
              <Button>Complete Your Profile</Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileView;
