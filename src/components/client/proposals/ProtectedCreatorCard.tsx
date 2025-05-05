
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Shield, ThumbsUp, Award, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type Creator = {
  id: string;
  alias: string;
  rating: number;
  skills: string[];
  successRate: number;
  projectsCompleted: number;
  verified: boolean;
};

interface ProtectedCreatorCardProps {
  creator: Creator;
  recommended?: boolean;
  onRequestCreator: (creatorId: string) => void;
  onMessageCreator: (creatorId: string) => void;
}

const ProtectedCreatorCard: React.FC<ProtectedCreatorCardProps> = ({ 
  creator, 
  recommended = false,
  onRequestCreator,
  onMessageCreator
}) => {
  return (
    <Card className={`overflow-hidden hover:shadow-md transition-shadow ${
      recommended ? 'border-2 border-indigo-200' : ''
    }`}>
      <CardContent className="p-6">
        <div className="flex items-start space-x-4 mb-4">
          <Avatar className="h-12 w-12 border-2 border-gray-100">
            <AvatarFallback className="bg-indigo-100 text-indigo-800">
              {creator.alias.substr(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">
                  {creator.alias}
                </h3>
                {creator.verified && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
                          <Shield className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs max-w-xs">This creator has been verified by Proverb Digital and has a proven track record of quality work.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                {recommended && (
                  <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200">
                    <Award className="h-3 w-3 mr-1" />
                    Recommended
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex items-center mt-1">
              <span className="text-amber-500 mr-1">★</span>
              <span className="text-sm">{creator.rating}/5</span>
              <span className="mx-2 text-gray-300">|</span>
              <span className="text-sm text-gray-600">{creator.projectsCompleted} projects</span>
              <span className="mx-2 text-gray-300">|</span>
              <ThumbsUp className="h-3.5 w-3.5 text-green-600 mr-1" />
              <span className="text-sm text-gray-600">{creator.successRate}% success</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <h4 className="text-xs text-gray-500 mb-2">Skills</h4>
          <div className="flex flex-wrap gap-1.5">
            {creator.skills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="mt-4 text-sm text-gray-600 border-t pt-3">
          <p className="text-xs text-gray-400 mb-1">
            <Shield className="h-3.5 w-3.5 inline mr-1" />
            Identity protected by Proverb Digital
          </p>
          <p className="text-xs">
            Creator identities are protected until you choose to work with them. This ensures unbiased selection based on quality and fit.
          </p>
        </div>
      </CardContent>
      
      <CardFooter className="bg-gray-50 p-4 flex justify-between">
        <Button 
          onClick={() => onRequestCreator(creator.id)}
          className="text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100"
        >
          Request this creator
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onMessageCreator(creator.id)}
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
        >
          <MessageSquare className="h-4 w-4 mr-1" />
          Message
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProtectedCreatorCard;
