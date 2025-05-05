import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import BriefTableList, { Brief } from "./BriefTableList";
import BriefCreationForm, { BriefFormData } from "./BriefCreationForm";
import { useBriefs } from "@/hooks/useBriefs";
import { format } from "date-fns";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import BriefDetailView from "./brief/BriefDetailView";
import BriefRevisionForm from "./brief/BriefRevisionForm";
import { BriefStatus } from "./brief/BriefStatusBadge";

// Mock feedback data for demonstration
const mockFeedback = [
  {
    message: "Please provide more specific details about your project requirements. What specific deliverables do you expect?",
    createdAt: new Date('2025-04-30'),
    fromAdmin: "Sarah from Proverb Digital"
  },
  {
    message: "Your budget seems low for the scope of work. Consider adjusting it to attract higher quality proposals.",
    createdAt: new Date('2025-05-01'),
    fromAdmin: "Michael from Proverb Digital"
  }
];

const MyBriefs = () => {
  const [briefs, setBriefs] = useState<Brief[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedBriefId, setSelectedBriefId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { getClientBriefs, submitBrief } = useBriefs();

  useEffect(() => {
    const fetchBriefs = async () => {
      setLoading(true);
      const data = await getClientBriefs();
      
      // Convert data to Brief format
      const formattedBriefs: Brief[] = data.map((brief: any) => ({
        id: brief.id,
        title: brief.title,
        budget: brief.budget,
        deadline: new Date(brief.deadline),
        status: brief.status as BriefStatus,
        attachment_url: brief.attachment_url
      }));
      
      setBriefs(formattedBriefs);
      setLoading(false);
    };
    
    fetchBriefs();
  }, []);

  const handleStatusChange = (id: string) => {
    // In a real implementation, this would update the brief status in the database
    setBriefs(
      briefs.map((brief) =>
        brief.id === id
          ? { ...brief, status: brief.status === "published" ? "draft" as BriefStatus : "published" as BriefStatus }
          : brief
      )
    );
  };

  const handleSubmitBrief = (data: BriefFormData) => {
    // The brief is already submitted to the database in the form
    // Here we just need to add it to our local state
    const newBrief = {
      id: Math.random().toString(), // This will be replaced when we re-fetch
      title: data.title,
      budget: data.budget,
      deadline: new Date(data.deadline),
      status: "draft" as BriefStatus,
      attachment_url: data.attachment_url
    };
    
    setBriefs([newBrief, ...briefs]);
    setDialogOpen(false);
  };

  const handleViewBrief = (id: string) => {
    setSelectedBriefId(id);
    setIsEditing(false);
  };

  const handleEditBrief = (id: string) => {
    setSelectedBriefId(id);
    setIsEditing(true);
  };

  const handleBackToBriefs = () => {
    setSelectedBriefId(null);
    setIsEditing(false);
  };

  const handleRevisionSubmit = async (data: BriefFormData) => {
    // In a real implementation, this would update the brief in the database
    // and change the status back to 'submitted'
    const updatedBriefs = briefs.map((brief) => 
      brief.id === selectedBriefId ? 
        { 
          ...brief, 
          title: data.title,
          budget: data.budget,
          deadline: new Date(data.deadline),
          status: "submitted" as BriefStatus,
          attachment_url: data.attachment_url
        } : brief
    );
    
    setBriefs(updatedBriefs);
    setSelectedBriefId(null);
    setIsEditing(false);
  };

  const getStatusDescription = (status: string) => {
    switch(status) {
      case 'draft':
        return "Your brief is being prepared. You can still edit it before submission.";
      case 'submitted':
        return "Your brief is under review by Proverb Digital.";
      case 'changes_requested':
        return "Proverb Digital has requested changes to your brief.";
      case 'published':
        return "Your brief is now visible to creators who can submit proposals.";
      case 'awarded':
        return "This brief has been awarded to a creator and is now in progress.";
      case 'completed':
        return "This brief has been completed successfully.";
      case 'cancelled':
        return "This brief has been cancelled.";
      default:
        return "";
    }
  };

  // Render the brief detail view or revision form if a brief is selected
  if (selectedBriefId) {
    const selectedBrief = briefs.find(brief => brief.id === selectedBriefId);
    
    if (!selectedBrief) return null;
    
    if (isEditing && selectedBrief.status === 'changes_requested') {
      const briefData: BriefFormData = {
        title: selectedBrief.title,
        original_description: "This is sample description content", // Would come from the real brief
        budget: selectedBrief.budget,
        deadline: format(selectedBrief.deadline, "yyyy-MM-dd"),
        category: "design", // Would come from the real brief
        attachment_url: selectedBrief.attachment_url
      };
      
      return (
        <BriefRevisionForm 
          briefId={selectedBrief.id}
          initialData={briefData}
          feedback={mockFeedback}
          onSubmit={handleRevisionSubmit}
          onCancel={handleBackToBriefs}
        />
      );
    }
    
    return (
      <BriefDetailView 
        brief={selectedBrief} 
        onBack={handleBackToBriefs}
        feedback={selectedBrief.status === 'changes_requested' ? mockFeedback : []}
      />
    );
  }

  // Otherwise, render the brief list
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">My Briefs</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>New Brief</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[650px]">
            <DialogHeader>
              <DialogTitle>Create New Brief</DialogTitle>
              <DialogDescription>
                Fill in the details for your new project brief. Your brief will be reviewed by Proverb Digital before being shared with creators.
              </DialogDescription>
            </DialogHeader>
            <BriefCreationForm 
              onSubmit={handleSubmitBrief} 
              onClose={() => setDialogOpen(false)} 
            />
          </DialogContent>
        </Dialog>
      </div>

      <Alert className="mb-4 bg-blue-50 border-blue-200">
        <AlertCircle className="h-5 w-5 text-blue-600" />
        <AlertTitle className="text-blue-700">
          How Briefs Work
        </AlertTitle>
        <AlertDescription className="text-blue-600">
          <p className="mb-2">Your briefs go through several stages:</p>
          <ol className="list-decimal pl-5 space-y-1">
            <li><strong>Draft:</strong> Initial creation, editable by you</li>
            <li><strong>Submitted:</strong> Under review by Proverb Digital</li>
            <li><strong>Changes Requested:</strong> Needs revisions</li>
            <li><strong>Published:</strong> Visible to creators (anonymized)</li>
            <li><strong>Awarded:</strong> Project assigned to selected creator</li>
          </ol>
        </AlertDescription>
      </Alert>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="h-8 w-8 border-4 border-t-accent rounded-full animate-spin"></div>
        </div>
      ) : briefs.length > 0 ? (
        <BriefTableList 
          briefs={briefs} 
          onStatusChange={handleStatusChange}
          onViewBrief={handleViewBrief}
          onEditBrief={handleEditBrief}
        />
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No briefs available yet. Get started by creating your first brief.</p>
          <Button 
            onClick={() => setDialogOpen(true)}
            variant="outline" 
            className="mt-4"
          >
            Create Your First Brief
          </Button>
        </div>
      )}
      
      {briefs.length > 0 && (
        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-medium">Brief Status Guide</h3>
          <div className="grid gap-2">
            {['draft', 'submitted', 'changes_requested', 'published', 'awarded', 'completed', 'cancelled'].map(status => (
              <div key={status} className="flex items-start gap-2 text-sm">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    status === 'published' || status === 'awarded'
                      ? 'bg-green-100 text-green-800'
                      : status === 'draft' || status === 'submitted'
                      ? 'bg-yellow-100 text-yellow-800'
                      : status === 'changes_requested'
                      ? 'bg-orange-100 text-orange-800'
                      : status === 'completed'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ')}
                </span>
                <span className="text-gray-600">{getStatusDescription(status)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBriefs;
