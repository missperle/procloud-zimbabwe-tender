
import React from "react";
import { 
  Clock, 
  AlertTriangle, 
  Eye, 
  CheckCircle, 
  X, 
  PenTool
} from "lucide-react";
import { cn } from "@/lib/utils";

export type BriefStatus = 
  | 'draft' 
  | 'submitted' 
  | 'changes_requested' 
  | 'published' 
  | 'awarded' 
  | 'completed' 
  | 'cancelled';

interface BriefStatusBadgeProps {
  status: BriefStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const BriefStatusBadge: React.FC<BriefStatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
  className
}) => {
  const getStatusConfig = (status: BriefStatus) => {
    switch(status) {
      case 'draft':
        return {
          label: "Draft",
          icon: <Clock className="h-4 w-4" />,
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-800"
        };
      case 'submitted':
        return {
          label: "Submitted for Review",
          icon: <Clock className="h-4 w-4" />,
          bgColor: "bg-blue-100",
          textColor: "text-blue-800"
        };
      case 'changes_requested':
        return {
          label: "Changes Requested",
          icon: <AlertTriangle className="h-4 w-4" />,
          bgColor: "bg-orange-100",
          textColor: "text-orange-800"
        };
      case 'published':
        return {
          label: "Published",
          icon: <Eye className="h-4 w-4" />,
          bgColor: "bg-green-100",
          textColor: "text-green-800"
        };
      case 'awarded':
        return {
          label: "Awarded",
          icon: <CheckCircle className="h-4 w-4" />,
          bgColor: "bg-indigo-100",
          textColor: "text-indigo-800"
        };
      case 'completed':
        return {
          label: "Completed",
          icon: <CheckCircle className="h-4 w-4" />,
          bgColor: "bg-teal-100",
          textColor: "text-teal-800"
        };
      case 'cancelled':
        return {
          label: "Cancelled",
          icon: <X className="h-4 w-4" />,
          bgColor: "bg-red-100",
          textColor: "text-red-800"
        };
      default:
        return {
          label: status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' '),
          icon: <PenTool className="h-4 w-4" />,
          bgColor: "bg-gray-100",
          textColor: "text-gray-800"
        };
    }
  };

  const sizeClasses = {
    sm: "text-xs py-0.5 px-2",
    md: "text-sm py-1 px-2.5",
    lg: "text-base py-1.5 px-3"
  };

  const statusConfig = getStatusConfig(status);

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium gap-1.5",
        sizeClasses[size],
        statusConfig.bgColor,
        statusConfig.textColor,
        className
      )}
    >
      {showIcon && statusConfig.icon}
      {statusConfig.label}
    </span>
  );
};

export default BriefStatusBadge;
