
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Edit, X } from "lucide-react";
import { format } from "date-fns";

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

// Form type for new brief
type BriefFormData = {
  title: string;
  description: string;
  budget: string;
  deadline: string;
  category: string;
};

const MyBriefs = () => {
  const [briefs, setBriefs] = useState(mockBriefs);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const { register, handleSubmit, reset } = useForm<BriefFormData>();

  const onSubmit = (data: BriefFormData) => {
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
    reset();
  };

  const handleStatusChange = (id: string) => {
    setBriefs(
      briefs.map((brief) =>
        brief.id === id
          ? { ...brief, status: brief.status === "Open" ? "Closed" : "Open" }
          : brief
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">My Briefs</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>New Brief</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <form onSubmit={handleSubmit(onSubmit)}>
              <DialogHeader>
                <DialogTitle>Create New Brief</DialogTitle>
                <DialogDescription>
                  Fill in the details for your new project brief. Click post when you're done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="title"
                    className="col-span-3"
                    {...register("title", { required: true })}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <textarea
                    id="description"
                    className="col-span-3 flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...register("description", { required: true })}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="budget" className="text-right">
                    Budget
                  </Label>
                  <Input
                    id="budget"
                    placeholder="$1000"
                    className="col-span-3"
                    {...register("budget", { required: true })}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="deadline" className="text-right">
                    Deadline
                  </Label>
                  <Input
                    id="deadline"
                    type="date"
                    className="col-span-3"
                    {...register("deadline", { required: true })}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Category
                  </Label>
                  <select
                    id="category"
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    {...register("category", { required: true })}
                  >
                    <option value="design">Design</option>
                    <option value="development">Development</option>
                    <option value="marketing">Marketing</option>
                    <option value="writing">Writing & Translation</option>
                    <option value="video">Video & Animation</option>
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="attachments" className="text-right">
                    Attachments
                  </Label>
                  <Input
                    id="attachments"
                    type="file"
                    multiple
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Post Brief</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {briefs.map((brief) => (
                <TableRow key={brief.id}>
                  <TableCell className="font-medium">{brief.title}</TableCell>
                  <TableCell>{brief.budget}</TableCell>
                  <TableCell>{format(brief.deadline, "PP")}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        brief.status === "Open"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {brief.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusChange(brief.id)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        {brief.status === "Open" ? "Close" : "Reopen"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyBriefs;
