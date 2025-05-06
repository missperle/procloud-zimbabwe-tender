
import { useState, useEffect } from "react";
import { Brief } from "./BriefTableList";
import BriefTableList from "./BriefTableList";
import { useBriefs } from "@/hooks/useBriefs";
import { useAuth } from "@/contexts/AuthContext";
import { BriefFormData } from "./BriefCreationForm";
import CreateBriefDialog from "./brief/CreateBriefDialog";
import BriefDetailDialog from "./brief/BriefDetailDialog";
import BriefRevisionDialog from "./brief/BriefRevisionDialog";
import AuthenticationWall from "./brief/AuthenticationWall";
import BriefHeaderActions from "./brief/BriefHeaderActions";

const MyBriefs = () => {
  const [briefs, setBriefs] = useState<Brief[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isRevisionOpen, setIsRevisionOpen] = useState(false);
  const [selectedBrief, setSelectedBrief] = useState<Brief | null>(null);
  const [loading, setLoading] = useState(true);
  const { getClientBriefs } = useBriefs();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      fetchBriefs();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const fetchBriefs = async () => {
    setLoading(true);
    try {
      const briefsData = await getClientBriefs();
      if (briefsData) {
        // Ensure all brief status values are of type BriefStatus and convert deadline to Date
        const typedBriefs = briefsData.map(brief => ({
          ...brief,
          deadline: new Date(brief.deadline),
          status: brief.status as BriefStatus
        }));
        setBriefs(typedBriefs as Brief[]);
      }
    } catch (error) {
      console.error("Error fetching briefs:", error);
    } finally {
      setLoading(false);
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

  if (!currentUser) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">My Briefs</h2>
        </div>
        
        <AuthenticationWall />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">My Briefs</h2>
        <BriefHeaderActions onCreateBriefClick={() => setIsFormOpen(true)} />
      </div>

      <BriefTableList 
        briefs={briefs} 
        onStatusChange={handleStatusChange} 
        onViewBrief={handleViewBrief}
        onEditBrief={handleEditBrief}
        loading={loading}
      />

      <CreateBriefDialog
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleBriefFormSubmit}
        onClose={handleBriefFormClose}
      />

      <BriefDetailDialog
        isOpen={isViewOpen}
        onOpenChange={setIsViewOpen}
        brief={selectedBrief}
      />

      <BriefRevisionDialog
        isOpen={isRevisionOpen}
        onOpenChange={setIsRevisionOpen}
        brief={selectedBrief}
        onSubmit={handleRevisionSubmit}
      />
    </div>
  );
};

export default MyBriefs;

// Add missing import
import { BriefStatus } from "./brief/BriefStatusBadge";
