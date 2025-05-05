
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Wand2 } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger
} from "@/components/ui/dialog";
import BriefCreationForm from "./BriefCreationForm";
import BriefTableList from "./BriefTableList";
import BriefDetailView from "./brief/BriefDetailView";
import BriefRevisionForm from "./brief/BriefRevisionForm";
import { useBriefs } from "@/hooks/useBriefs";
import { Brief } from "./BriefTableList";
import { Link } from "react-router-dom";
import { BriefFormData } from "./BriefCreationForm";
import { Card } from "@/components/ui/card";

const MyBriefs = () => {
  const [briefs, setBriefs] = useState<Brief[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isRevisionOpen, setIsRevisionOpen] = useState(false);
  const [selectedBrief, setSelectedBrief] = useState<Brief | null>(null);
  const { getClientBriefs } = useBriefs();

  useEffect(() => {
    fetchBriefs();
  }, []);

  const fetchBriefs = async () => {
    const briefsData = await getClientBriefs();
    if (briefsData) {
      setBriefs(briefsData as Brief[]);
    }
  };

  const handleBriefFormSubmit = (data: BriefFormData) => {
    setIsFormOpen(false);
    fetchBriefs();
  };

  const handleBriefFormClose = () => {
    setIsFormOpen(false);
  };

  const handleViewBrief = (id: string) => {
    const brief = briefs.find(b => b.id === id);
    if (brief) {
      setSelectedBrief(brief);
      setIsViewOpen(true);
    }
  };

  const handleEditBrief = (id: string) => {
    const brief = briefs.find(b => b.id === id);
    if (brief) {
      setSelectedBrief(brief);
      setIsRevisionOpen(true);
    }
  };

  const handleStatusChange = (id: string) => {
    fetchBriefs();
  };

  const handleRevisionSubmit = (data: BriefFormData) => {
    setIsRevisionOpen(false);
    fetchBriefs();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">My Briefs</h2>
        <div className="flex space-x-2">
          <Link to="/create-brief">
            <Button variant="outline" className="flex items-center gap-1.5">
              <Wand2 className="h-4 w-4" />
              AI-Guided Brief
            </Button>
          </Link>
          
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
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
              <BriefCreationForm onSubmit={handleBriefFormSubmit} onClose={handleBriefFormClose} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {briefs.length > 0 ? (
        <BriefTableList 
          briefs={briefs} 
          onStatusChange={handleStatusChange} 
          onViewBrief={handleViewBrief}
          onEditBrief={handleEditBrief}
        />
      ) : (
        <Card className="p-8 text-center">
          <h3 className="text-lg font-medium mb-2">No briefs yet</h3>
          <p className="text-gray-500 mb-4">
            Start by creating your first brief to attract talented creators.
          </p>
          <div className="flex justify-center space-x-3">
            <Link to="/create-brief">
              <Button variant="outline" className="flex items-center gap-1.5">
                <Wand2 className="h-4 w-4" />
                Try AI-Guided Brief
              </Button>
            </Link>
            <Button onClick={() => setIsFormOpen(true)}>
              <PlusCircle className="h-4 w-4 mr-1.5" />
              Create Brief Manually
            </Button>
          </div>
        </Card>
      )}

      {selectedBrief && (
        <>
          <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <BriefDetailView 
                brief={selectedBrief}
                onClose={() => setIsViewOpen(false)}
              />
            </DialogContent>
          </Dialog>

          <Dialog open={isRevisionOpen} onOpenChange={setIsRevisionOpen}>
            <DialogContent className="max-w-3xl">
              <BriefRevisionForm
                briefId={selectedBrief.id}
                initialData={{
                  title: selectedBrief.title,
                  original_description: selectedBrief.original_description,
                  budget: selectedBrief.budget,
                  deadline: new Date(selectedBrief.deadline).toISOString().split('T')[0],
                  category: selectedBrief.category,
                  attachment_url: selectedBrief.attachment_url
                }}
                feedback={[
                  {
                    message: "Please provide more details about your target audience and specific deliverables you expect.",
                    createdAt: new Date(),
                    fromAdmin: "Project Manager"
                  }
                ]}
                onSubmit={handleRevisionSubmit}
                onCancel={() => setIsRevisionOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default MyBriefs;
