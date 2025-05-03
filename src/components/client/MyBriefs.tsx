
import { useState } from "react";
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

// Mock data for briefs
const mockBriefs = [
  {
    id: "1",
    title: "Logo Design",
    budget: "$500",
    deadline: new Date("2025-05-15"),
    status: "Open",
  },
  {
    id: "2",
    title: "Website Redesign",
    budget: "$3000",
    deadline: new Date("2025-05-30"),
    status: "Open",
  },
  {
    id: "3",
    title: "Mobile App UI",
    budget: "$2500",
    deadline: new Date("2025-05-20"),
    status: "Closed",
  },
  {
    id: "4",
    title: "Brochure Design",
    budget: "$350",
    deadline: new Date("2025-06-05"),
    status: "Open",
  },
  {
    id: "5",
    title: "SEO Consulting",
    budget: "$800",
    deadline: new Date("2025-05-10"),
    status: "Closed",
  },
];

const MyBriefs = () => {
  const [briefs, setBriefs] = useState<Brief[]>(mockBriefs);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleStatusChange = (id: string) => {
    setBriefs(
      briefs.map((brief) =>
        brief.id === id
          ? { ...brief, status: brief.status === "Open" ? "Closed" : "Open" }
          : brief
      )
    );
  };

  const handleSubmitBrief = (data: BriefFormData) => {
    // In a real app, this would send data to an API or database
    const newBrief = {
      id: (briefs.length + 1).toString(),
      title: data.title,
      budget: data.budget,
      deadline: new Date(data.deadline),
      status: "Open",
    };
    
    setBriefs([...briefs, newBrief]);
    setDialogOpen(false);
  };

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
                Fill in the details for your new project brief. Click post when you're done.
              </DialogDescription>
            </DialogHeader>
            <BriefCreationForm 
              onSubmit={handleSubmitBrief} 
              onClose={() => setDialogOpen(false)} 
            />
          </DialogContent>
        </Dialog>
      </div>

      <BriefTableList 
        briefs={briefs} 
        onStatusChange={handleStatusChange} 
      />
    </div>
  );
};

export default MyBriefs;
