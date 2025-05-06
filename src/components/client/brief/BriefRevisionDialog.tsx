
import { 
  Dialog, 
  DialogContent
} from "@/components/ui/dialog";
import BriefRevisionForm from "./BriefRevisionForm";
import { Brief } from "../BriefTableList";
import { BriefFormData } from "../BriefCreationForm";

interface BriefRevisionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  brief: Brief | null;
  onSubmit: (data: BriefFormData) => void;
}

const BriefRevisionDialog: React.FC<BriefRevisionDialogProps> = ({
  isOpen,
  onOpenChange,
  brief,
  onSubmit
}) => {
  if (!brief) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <BriefRevisionForm
          briefId={brief.id}
          initialData={{
            title: brief.title,
            original_description: brief.original_description || "",
            budget: brief.budget,
            deadline: new Date(brief.deadline).toISOString().split('T')[0],
            category: brief.category || "design",
            attachment_url: brief.attachment_url
          }}
          feedback={[
            {
              message: "Please provide more details about your target audience and specific deliverables you expect.",
              createdAt: new Date(),
              fromAdmin: "Project Manager"
            }
          ]}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default BriefRevisionDialog;
