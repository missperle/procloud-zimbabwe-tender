
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Calendar, DollarSign, FileText, Users } from "lucide-react";
import { Link } from "react-router-dom";

export interface JobStatusCardProps {
  id: string;
  title: string;
  status: "active" | "completed" | "expired";
  budget: string;
  deadline: string;
  submissionsCount: number;
  daysLeft?: number;
}

const JobStatusCard = ({
  id,
  title,
  status,
  budget,
  deadline,
  submissionsCount,
  daysLeft,
}: JobStatusCardProps) => {
  return (
    <Card className="h-full flex flex-col shadow-card">
      <CardHeader>
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-lg line-clamp-2 font-montserrat">{title}</h3>
          <Badge
            className={`
              ${status === "active" ? "bg-procloud-green text-white" : 
                status === "completed" ? "bg-procloud-gray-800 text-white" : 
                "bg-procloud-gray-300 text-procloud-gray-800"}
            `}
          >
            {status === "active" ? "Active" : 
             status === "completed" ? "Completed" : "Expired"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-sm text-procloud-gray-600 mb-1 flex items-center">
              <DollarSign className="h-3.5 w-3.5 mr-1" />
              Budget
            </div>
            <div className="font-medium">{budget}</div>
          </div>
          <div>
            <div className="text-sm text-procloud-gray-600 mb-1 flex items-center">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              Deadline
            </div>
            <div className="font-medium">{deadline}</div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-1 text-procloud-green" />
              <span className="text-sm font-medium">Submissions</span>
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              <span>{submissionsCount}</span>
            </div>
          </div>
          
          {status === "active" && daysLeft !== undefined && (
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Time Remaining</span>
                <span>{daysLeft} {daysLeft === 1 ? "day" : "days"} left</span>
              </div>
              <Progress 
                value={(daysLeft / 14) * 100} // Assuming 14 days is total
                className={daysLeft < 3 ? "bg-red-200" : "bg-procloud-gray-200"} 
              />
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter>
        <Link to={`/dashboard/jobs/${id}`} className="w-full">
          <Button className="w-full bg-procloud-green hover:bg-procloud-green-dark text-white">
            {status === "active" ? "View Submissions" : 
             status === "completed" ? "View Results" : 
             "View Details"}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default JobStatusCard;
