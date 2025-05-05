
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, X, Eye, MessageSquare, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import BriefStatusBadge, { BriefStatus } from "./brief/BriefStatusBadge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface Brief {
  id: string;
  title: string;
  budget: string;
  deadline: Date;
  status: BriefStatus;
  attachment_url?: string;
  original_description?: string;
  category?: string;
}

interface BriefTableListProps {
  briefs: Brief[];
  onStatusChange: (id: string) => void;
  onViewBrief: (id: string) => void;
  onEditBrief: (id: string) => void;
  loading?: boolean;
}

const BriefTableList = ({ 
  briefs, 
  onStatusChange, 
  onViewBrief, 
  onEditBrief, 
  loading = false 
}: BriefTableListProps) => {
  const { toast } = useToast();
  const [cancellingBrief, setCancellingBrief] = useState<string | null>(null);

  const canEdit = (status: BriefStatus) => {
    return ['draft', 'changes_requested'].includes(status);
  };

  const canCancel = (status: BriefStatus) => {
    return ['draft', 'submitted', 'under_review'].includes(status);
  };

  const handleCancelBrief = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this brief? This action cannot be undone.")) {
      return;
    }
    
    setCancellingBrief(id);
    
    try {
      const { error } = await supabase
        .from('client_briefs')
        .update({ status: 'cancelled' })
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Brief cancelled",
        description: "Your brief has been cancelled successfully.",
      });
      
      onStatusChange(id);
    } catch (error) {
      console.error("Error cancelling brief:", error);
      toast({
        title: "Error cancelling brief",
        description: "Could not cancel your brief. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCancellingBrief(null);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 flex justify-center items-center min-h-[200px]">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
            <p className="text-gray-500">Loading your briefs...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (briefs.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500 mb-2">You don't have any briefs yet.</p>
          <p className="text-gray-400 text-sm">Create your first brief to start receiving proposals from creators.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {briefs.map((brief) => (
              <TableRow key={brief.id}>
                <TableCell className="font-medium">{brief.title}</TableCell>
                <TableCell>{brief.budget}</TableCell>
                <TableCell>{format(brief.deadline, "PP")}</TableCell>
                <TableCell>
                  <BriefStatusBadge status={brief.status} />
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span>
                            <Button 
                              variant="outline" 
                              size="sm"
                              disabled={!canEdit(brief.status)}
                              onClick={() => onEditBrief(brief.id)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          </span>
                        </TooltipTrigger>
                        {!canEdit(brief.status) && (
                          <TooltipContent>
                            <p>Briefs can only be edited in 'draft' or 'changes requested' status</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewBrief(brief.id)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>

                    {brief.status === 'changes_requested' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Feedback
                      </Button>
                    )}
                    
                    {canCancel(brief.status) && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleCancelBrief(brief.id)}
                        disabled={cancellingBrief === brief.id}
                      >
                        {cancellingBrief === brief.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <X className="h-4 w-4 mr-1" />
                            Cancel
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default BriefTableList;
