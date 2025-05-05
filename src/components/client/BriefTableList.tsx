
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
import { Edit, X, Eye, Clock, Check, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export interface Brief {
  id: string;
  title: string;
  budget: string;
  deadline: Date;
  status: string;
}

interface BriefTableListProps {
  briefs: Brief[];
  onStatusChange: (id: string) => void;
}

const BriefTableList = ({ briefs, onStatusChange }: BriefTableListProps) => {
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'draft':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'submitted':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'changes_requested':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'published':
        return <Eye className="h-4 w-4 text-green-600" />;
      case 'awarded':
        return <Check className="h-4 w-4 text-green-600" />;
      case 'completed':
        return <Check className="h-4 w-4 text-green-600" />;
      case 'cancelled':
        return <X className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'draft':
        return "bg-yellow-100 text-yellow-800";
      case 'submitted':
        return "bg-blue-100 text-blue-800";
      case 'changes_requested':
        return "bg-orange-100 text-orange-800";
      case 'published':
        return "bg-green-100 text-green-800";
      case 'awarded':
        return "bg-green-100 text-green-800";
      case 'completed':
        return "bg-green-100 text-green-800";
      case 'cancelled':
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const canEdit = (status: string) => {
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
                  <div className="flex items-center gap-1.5">
                    {getStatusIcon(brief.status)}
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(brief.status)}`}
                    >
                      {brief.status.charAt(0).toUpperCase() + brief.status.slice(1)}
                    </span>
                  </div>
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
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
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
