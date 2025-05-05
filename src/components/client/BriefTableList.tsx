
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
import { Edit, X, Eye, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import BriefStatusBadge, { BriefStatus } from "./brief/BriefStatusBadge";

export interface Brief {
  id: string;
  title: string;
  budget: string;
  deadline: Date;
  status: BriefStatus;
  attachment_url?: string; // Added to fix TypeScript error
}

interface BriefTableListProps {
  briefs: Brief[];
  onStatusChange: (id: string) => void;
  onViewBrief: (id: string) => void;
  onEditBrief: (id: string) => void;
}

const BriefTableList = ({ briefs, onStatusChange, onViewBrief, onEditBrief }: BriefTableListProps) => {
  const canEdit = (status: BriefStatus) => {
    return ['draft', 'changes_requested'].includes(status);
  };

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
