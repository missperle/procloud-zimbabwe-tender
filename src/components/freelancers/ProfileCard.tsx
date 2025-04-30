
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

interface ProfileCardProps {
  id: string;
  name: string;
  title: string;
  avatar: string;
  verified: boolean;
  rating: number;
  skills: string[];
  completedJobs: number;
}

const ProfileCard = ({
  id,
  name,
  title,
  avatar,
  verified,
  rating,
  skills,
  completedJobs,
}: ProfileCardProps) => {
  return (
    <Card className="h-full flex flex-col hover:border-procloud-green transition-colors">
      <CardHeader className="text-center pb-0">
        <div className="relative inline-block mx-auto">
          <div className="w-24 h-24 rounded-full bg-procloud-gray-200 mb-2 overflow-hidden mx-auto">
            {avatar ? (
              <img 
                src={avatar} 
                alt={name} 
                className="w-full h-full object-cover" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-procloud-gray-300 text-procloud-gray-600 text-xl font-bold">
                {name.charAt(0)}
              </div>
            )}
          </div>
          
          {verified && (
            <div className="absolute bottom-1 right-0 bg-procloud-green rounded-full p-1 border-2 border-white">
              <CheckCircle className="h-4 w-4 text-black" />
            </div>
          )}
        </div>
        
        <h3 className="font-bold text-lg mt-2">{name}</h3>
        <p className="text-procloud-gray-600 text-sm">{title}</p>
        
        <div className="flex justify-center items-center mt-2">
          <div className="flex items-center space-x-1 text-sm">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={i < rating ? "text-yellow-500" : "text-procloud-gray-300"}>★</span>
            ))}
            <span className="ml-1 text-procloud-gray-600">({rating.toFixed(1)})</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-2 flex-grow">
        <div className="flex flex-wrap gap-2 justify-center mb-3">
          {skills.slice(0, 3).map((skill) => (
            <Badge key={skill} variant="outline" className="border-procloud-gray-300">
              {skill}
            </Badge>
          ))}
          {skills.length > 3 && (
            <Badge variant="outline" className="border-procloud-gray-300">
              +{skills.length - 3}
            </Badge>
          )}
        </div>
        
        <div className="text-center text-sm text-procloud-gray-600">
          <span className="font-medium">{completedJobs}</span> projects completed
        </div>
      </CardContent>
      
      <CardFooter>
        <Link to={`/freelancers/${id}`} className="w-full">
          <Button className="w-full bg-black hover:bg-procloud-gray-800 text-white">
            View Profile
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ProfileCard;
