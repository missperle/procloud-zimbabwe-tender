
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
import { Edit, X } from "lucide-react";
import { format } from "date-fns";

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
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      brief.status === "Open"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {brief.status}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onStatusChange(brief.id)}
                    >
                      <X className="h-4 w-4 mr-1" />
                      {brief.status === "Open" ? "Close" : "Reopen"}
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
