
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check } from "lucide-react";

type FreelancerRecommendation = {
  id: string;
  name: string;
  avatar?: string;
  skills: string[];
  rating: number;
};

interface RecommendedFreelancersProps {
  recommendations: FreelancerRecommendation[];
}

const RecommendedFreelancers = ({ recommendations }: RecommendedFreelancersProps) => {
  if (recommendations.length === 0) return null;

  return (
    <div className="mb-8">
      <h3 className="text-lg font-medium mb-4">Recommended Freelancers</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((freelancer) => (
          <Card key={freelancer.id} className="overflow-hidden hover:shadow-md transition-shadow border-2 border-indigo-100">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <Avatar>
                  <AvatarImage src={freelancer.avatar} alt={freelancer.name} />
                  <AvatarFallback>
                    {freelancer.name.substr(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{freelancer.name}</h3>
                  <div className="flex items-center">
                    <span className="text-xs text-amber-burst mr-1">★</span>
                    <span className="text-xs">{freelancer.rating}/5</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-3">
                <p className="text-xs text-muted-foreground mb-2">Skills:</p>
                <div className="flex flex-wrap gap-2">
                  {freelancer.skills.map((skill, index) => (
                    <span 
                      key={index} 
                      className="text-xs bg-slate-100 px-2 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <Button variant="link" className="px-0 text-xs mt-4">
                View Full Profile
              </Button>
            </CardContent>
            
            <CardFooter className="bg-gray-50 p-4 flex justify-between">
              <Button 
                variant="outline" 
                size="sm"
                className="text-green-600 hover:text-green-700 hover:bg-green-50"
              >
                <Check className="h-4 w-4 mr-1" />
                Invite
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                Message
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RecommendedFreelancers;
