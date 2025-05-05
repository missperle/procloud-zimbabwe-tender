
import React from "react";
import { CheckCircle, Clock, AlertTriangle, Eye, PenTool, X } from "lucide-react";
import { BriefStatus } from "./BriefStatusBadge";
import { cn } from "@/lib/utils";

const steps: { status: BriefStatus; label: string }[] = [
  { status: 'draft', label: 'Draft' },
  { status: 'submitted', label: 'Submitted for Review' },
  { status: 'published', label: 'Published to Creators' },
  { status: 'awarded', label: 'Awarded' },
  { status: 'completed', label: 'Completed' }
];

interface BriefStatusTimelineProps {
  currentStatus: BriefStatus;
  className?: string;
}

export const BriefStatusTimeline: React.FC<BriefStatusTimelineProps> = ({ 
  currentStatus,
  className 
}) => {
  const getStatusIcon = (status: BriefStatus) => {
    switch(status) {
      case 'draft':
        return <PenTool className="h-5 w-5" />;
      case 'submitted':
        return <Clock className="h-5 w-5" />;
      case 'changes_requested':
        return <AlertTriangle className="h-5 w-5" />;
      case 'published':
        return <Eye className="h-5 w-5" />;
      case 'awarded':
      case 'completed':
        return <CheckCircle className="h-5 w-5" />;
      case 'cancelled':
        return <X className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const getCurrentStepIndex = (): number => {
    if (currentStatus === 'changes_requested') return 1; // Same position as submitted
    if (currentStatus === 'cancelled') return -1; // Special case

    return steps.findIndex(step => step.status === currentStatus);
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className={cn("py-4", className)}>
      {currentStatus === 'cancelled' ? (
        <div className="flex items-center justify-center p-4 bg-red-50 rounded-lg">
          <X className="h-5 w-5 text-red-600 mr-2" />
          <span className="text-red-800">This brief has been cancelled</span>
        </div>
      ) : currentStatus === 'changes_requested' ? (
        <div className="mb-4 p-4 bg-orange-50 rounded-lg">
          <div className="flex items-center mb-2">
            <AlertTriangle className="h-5 w-5 text-orange-600 mr-2" />
            <span className="text-orange-800 font-medium">Changes have been requested by Proverb Digital</span>
          </div>
          <p className="text-sm text-orange-700">
            Please review the feedback and update your brief accordingly.
          </p>
        </div>
      ) : null}

      <ol className="relative border-l border-gray-200 ml-3">
        {steps.map((step, index) => {
          const isActive = index <= currentStepIndex;
          const isPassed = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;

          return (
            <li key={step.status} className="mb-10 ml-6">
              <span 
                className={cn(
                  "absolute flex items-center justify-center w-8 h-8 rounded-full -left-4 ring-4 ring-white",
                  isPassed ? "bg-blue-600" : 
                  isCurrent ? "bg-blue-500" : "bg-gray-200"
                )}
              >
                {getStatusIcon(step.status)}
              </span>
              <h3 
                className={cn(
                  "font-medium mb-1",
                  isActive ? 
                    (isCurrent ? "text-blue-800" : "text-gray-900") : 
                    "text-gray-400"
                )}
              >
                {step.label}
              </h3>
              {isCurrent && (
                <p className="text-sm text-blue-700">
                  {step.status === 'draft' ? "Complete your brief and submit for review." :
                    step.status === 'submitted' ? "Proverb Digital is reviewing your brief." :
                    step.status === 'published' ? "Creators can now see and submit proposals for your brief." :
                    step.status === 'awarded' ? "A creator has been selected and is working on your brief." :
                    "The work has been completed successfully."}
                </p>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default BriefStatusTimeline;
