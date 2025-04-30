
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { CheckCircle, Clock, User } from "lucide-react";

interface SubmissionCardProps {
  id: string;
  freelancerName: string;
  freelancerId: string;
  submittedAt: string;
  files: string[];
  note: string;
  status: "pending" | "selected" | "rejected";
  onSelect: () => void;
  onView: () => void;
}

const SubmissionCard = ({
  id,
  freelancerName,
  freelancerId,
  submittedAt,
  files,
  note,
  status,
  onSelect,
  onView,
}: SubmissionCardProps) => {
  return (
    <Card className={`h-full flex flex-col transition-colors ${status === "selected" ? "border-procloud-green bg-procloud-green/5" : ""}`}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-procloud-gray-200 mr-3 flex items-center justify-center">
              <User className="h-5 w-5 text-procloud-gray-500" />
            </div>
            <div>
              <h3 className="font-bold">{freelancerName}</h3>
              <div className="flex items-center text-sm text-procloud-gray-600">
                <Clock className="h-3 w-3 mr-1" />
                <span>Submitted {submittedAt}</span>
              </div>
            </div>
          </div>
          
          <Badge
            className={`
              ${status === "selected" ? "bg-procloud-green text-black" : 
                status === "rejected" ? "bg-procloud-gray-300 text-procloud-gray-600" : 
                "bg-procloud-gray-200 text-procloud-gray-800"}
            `}
          >
            {status === "selected" ? "Selected" : 
             status === "rejected" ? "Not Selected" : "Pending"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-1">Submission Files</h4>
          <div className="flex flex-wrap gap-2">
            {files.map((file, index) => (
              <Badge key={index} variant="outline" className="border-procloud-gray-300">
                File {index + 1}
              </Badge>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-1">Notes</h4>
          <p className="text-sm text-procloud-gray-600 line-clamp-3">{note}</p>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col gap-2">
        <Button
          onClick={onView}
          variant="outline"
          className="w-full"
        >
          View Submission
        </Button>
        
        {status === "pending" && (
          <Button
            onClick={onSelect}
            className="w-full bg-procloud-green hover:bg-procloud-green-dark text-black"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Select This Submission
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default SubmissionCard;
