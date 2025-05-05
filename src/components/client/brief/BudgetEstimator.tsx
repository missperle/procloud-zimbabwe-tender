
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getApp } from "firebase/app";
import { useToast } from "@/hooks/use-toast";

interface BudgetEstimatorProps {
  title: string;
  description: string;
  onEstimateGenerated: (budget: string, timeline: string) => void;
}

const BudgetEstimator = ({ title, description, onEstimateGenerated }: BudgetEstimatorProps) => {
  const [estimating, setEstimating] = useState(false);
  const [budgetEstimate, setBudgetEstimate] = useState("");
  const [timelineEstimate, setTimelineEstimate] = useState("");
  const { toast } = useToast();

  const handleEstimate = async () => {
    if (!title || !description) {
      toast({
        title: "Missing information",
        description: "Please provide both title and description for an estimate",
        variant: "destructive",
      });
      return;
    }

    setEstimating(true);
    setBudgetEstimate("");
    setTimelineEstimate("");

    try {
      const functions = getFunctions(getApp("proverb-digital-client"));
      const suggestBudgetTimeline = httpsCallable(functions, 'suggestBudgetTimeline');
      
      const result = await suggestBudgetTimeline({ title, description });
      const data = result.data as { budget: string; timeline: string };
      
      setBudgetEstimate(data.budget);
      setTimelineEstimate(data.timeline);
      
      // Call the callback to update the parent component
      onEstimateGenerated(data.budget, data.timeline);
      
      toast({
        title: "Estimate generated",
        description: "Budget and timeline estimates have been added to your brief",
      });
    } catch (error) {
      console.error("Error generating estimates:", error);
      toast({
        title: "Estimation failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setEstimating(false);
    }
  };

  return (
    <div className="col-span-4">
      <div className="border-t pt-4 mb-2 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          <h4 className="font-medium">Get Estimates</h4>
        </div>
        <Button 
          type="button" 
          onClick={handleEstimate} 
          disabled={estimating || !title || !description}
          variant="outline" 
          size="sm"
        >
          {estimating ? "Estimating..." : "Suggest Budget & Timeline"}
        </Button>
      </div>
      
      {(budgetEstimate || timelineEstimate) && (
        <div className="bg-muted p-3 rounded-md mb-4 text-sm space-y-1">
          {budgetEstimate && (
            <div className="flex justify-between">
              <span className="font-medium">Suggested Budget:</span>
              <span>${budgetEstimate}</span>
            </div>
          )}
          {timelineEstimate && (
            <div className="flex justify-between">
              <span className="font-medium">Estimated Timeline:</span>
              <span>{timelineEstimate}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BudgetEstimator;
