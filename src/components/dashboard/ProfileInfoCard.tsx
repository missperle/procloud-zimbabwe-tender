
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, DollarSign, Briefcase, Pencil } from "lucide-react";
import { useFreelancerProfile } from "@/hooks/useFreelancerProfile";
import ProfileCompletionWidget from "@/components/freelancers/ProfileCompletionWidget";

const ProfileInfoCard = () => {
  const { profile } = useFreelancerProfile();

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex justify-between items-center">
          <span>My Profile</span>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/edit-profile">
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit Profile</span>
            </Link>
          </Button>
        </CardTitle>
        <CardDescription>
          {profile?.title || "Freelancer"}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        {profile ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{profile.location || "Location not specified"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{profile.years_experience ? `${profile.years_experience} years experience` : "Experience not specified"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span>{profile.hourly_rate ? `$${profile.hourly_rate}/hr` : "Hourly rate not specified"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Briefcase className="h-4 w-4" />
              <span>{profile.education || "Education not specified"}</span>
            </div>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            Your profile is not complete. Please fill in your details.
          </div>
        )}
      </CardContent>
      <CardFooter>
        <ProfileCompletionWidget />
      </CardFooter>
    </Card>
  );
};

export default ProfileInfoCard;
