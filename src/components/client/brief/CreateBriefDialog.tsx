
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger
} from "@/components/ui/dialog";
import BriefCreationForm from "../BriefCreationForm";
import { BriefFormData } from "../BriefCreationForm";

interface CreateBriefDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: BriefFormData) => void;
  onClose: () => void;
}

const CreateBriefDialog: React.FC<CreateBriefDialogProps> = ({
  isOpen,
  onOpenChange,
  onSubmit,
  onClose
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="h-4 w-4 mr-1.5" />
          Create Brief
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Create a New Brief</DialogTitle>
          <DialogDescription>
            Describe your project in detail to attract the best creators.
          </DialogDescription>
        </DialogHeader>
        <BriefCreationForm onSubmit={onSubmit} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateBriefDialog;
