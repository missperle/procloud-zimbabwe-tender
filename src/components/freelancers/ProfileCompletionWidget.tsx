
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { useFreelancerProfile } from "@/hooks/useFreelancerProfile";
import { CheckCircle2, Circle, User } from "lucide-react";

const ProfileCompletionWidget = () => {
  const { profile, profileCompletionPercentage, isLoading } = useFreelancerProfile();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Profile Completion</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-12 animate-pulse bg-gray-200 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-500";
    if (percentage >= 40) return "text-amber-500";
    return "text-red-500";
  };

  const missingFields = () => {
    if (!profile) return [];
    
    const fields = [
      { name: 'Professional Title', key: 'title', completed: !!profile.title },
      { name: 'Biography', key: 'bio', completed: !!profile.bio },
      { name: 'Hourly Rate', key: 'hourly_rate', completed: !!profile.hourly_rate },
      { name: 'Location', key: 'location', completed: !!profile.location },
      { name: 'Profile Picture', key: 'profile_image_url', completed: !!profile.profile_image_url },
      { name: 'Education', key: 'education', completed: !!profile.education }
    ];
    
    return fields;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <User className="h-5 w-5" />
          Profile Completion
        </CardTitle>
        <CardDescription>
          A complete profile increases your chances of getting hired
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Profile Strength</span>
            <span className={`text-sm font-medium ${getStatusColor(profileCompletionPercentage)}`}>
              {profileCompletionPercentage}%
            </span>
          </div>
          <Progress value={profileCompletionPercentage} className="h-2 w-full" />
        </div>
        
        <div className="space-y-2 mt-4">
          <h4 className="text-sm font-medium">Profile Checklist:</h4>
          <ul className="space-y-1">
            {missingFields().map((field) => (
              <li key={field.key} className="flex items-center text-sm">
                {field.completed ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                ) : (
                  <Circle className="h-4 w-4 text-gray-300 mr-2" />
                )}
                <span className={field.completed ? "" : "text-gray-500"}>
                  {field.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link to="/freelancer-onboarding">
            {profileCompletionPercentage === 100 ? "Edit Profile" : "Complete Your Profile"}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileCompletionWidget;
