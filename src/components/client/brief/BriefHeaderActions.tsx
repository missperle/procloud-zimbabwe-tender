
import { Button } from "@/components/ui/button";
import { Wand2, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface BriefHeaderActionsProps {
  onCreateBriefClick: () => void;
}

const BriefHeaderActions: React.FC<BriefHeaderActionsProps> = ({
  onCreateBriefClick
}) => {
  return (
    <div className="flex space-x-2">
      <Link to="/create-brief">
        <Button variant="outline" className="flex items-center gap-1.5">
          <Wand2 className="h-4 w-4" />
          AI-Guided Brief
        </Button>
      </Link>
      
      <Button onClick={onCreateBriefClick}>
        <PlusCircle className="h-4 w-4 mr-1.5" />
        Create Brief
      </Button>
    </div>
  );
};

export default BriefHeaderActions;
