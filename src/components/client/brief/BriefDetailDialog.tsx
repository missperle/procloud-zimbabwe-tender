
import { 
  Dialog, 
  DialogContent
} from "@/components/ui/dialog";
import BriefDetailView from "./BriefDetailView";
import { Brief } from "../BriefTableList";

interface BriefDetailDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  brief: Brief | null;
}

const BriefDetailDialog: React.FC<BriefDetailDialogProps> = ({
  isOpen,
  onOpenChange,
  brief
}) => {
  if (!brief) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <BriefDetailView 
          brief={brief}
          onBack={() => onOpenChange(false)}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default BriefDetailDialog;
