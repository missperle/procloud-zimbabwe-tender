
import React from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brief } from "../BriefTableList";
import BriefStatusBadge from "./BriefStatusBadge";
import BriefStatusTimeline from "./BriefStatusTimeline";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageSquare, Clock } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface BriefDetailViewProps {
  brief: Brief;
  onBack: () => void;
  onClose?: () => void; // Added onClose prop as optional
  feedback?: {
    message: string;
    createdAt: Date;
    fromAdmin: string;
  }[];
}

const BriefDetailView: React.FC<BriefDetailViewProps> = ({ 
  brief, 
  onBack,
  onClose, // Added onClose to the destructuring
  feedback = []
}) => {
  // Use onClose if provided, otherwise fall back to onBack
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      onBack();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to briefs
        </Button>
        
        <BriefStatusBadge status={brief.status} size="lg" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{brief.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-3 text-sm">
                <Badge variant="outline" className="px-3 py-1 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  Deadline: {format(brief.deadline, "PPP")}
                </Badge>
                <Badge variant="outline" className="px-3 py-1">
                  Budget: {brief.budget}
                </Badge>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-gray-700">
                  {/* This would come from the brief data */}
                  This is a placeholder for the brief description. In a real implementation, 
                  this would display the full description of the brief from the database.
                </p>
              </div>
              
              {/* Attachments section */}
              <div>
                <h3 className="font-medium mb-2">Attachments</h3>
                {brief.attachment_url ? (
                  <div className="border rounded-md p-2 bg-gray-50 inline-flex items-center">
                    <img 
                      src={brief.attachment_url} 
                      alt="Brief attachment" 
                      className="h-16 w-16 object-cover rounded"
                    />
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No attachments</p>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Feedback card */}
          {feedback.length > 0 && (
            <Card className="bg-orange-50 border-orange-200">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-orange-600" />
                  Feedback from Proverb Digital
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {feedback.map((item, index) => (
                  <div key={index} className="bg-white p-3 rounded-md border border-orange-100">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">{item.fromAdmin}</span>
                      <span className="text-xs text-gray-500">
                        {format(item.createdAt, "PPP p")}
                      </span>
                    </div>
                    <p className="text-sm">{item.message}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Status timeline card */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Brief Status</CardTitle>
            </CardHeader>
            <CardContent>
              <BriefStatusTimeline currentStatus={brief.status} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BriefDetailView;
