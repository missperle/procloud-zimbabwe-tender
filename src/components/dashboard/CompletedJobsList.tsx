
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Example job data - this would come from an API in a real app
const jobStatuses = [
  { id: 1, title: "Logo Design for Tech Startup", status: "in_progress", dueDate: "2023-12-15" },
  { id: 2, title: "Social Media Campaign", status: "completed", dueDate: "2023-11-30" },
  { id: 3, title: "Website Redesign", status: "pending_review", dueDate: "2023-12-20" },
];

const CompletedJobsList = () => {
  const completedJobs = jobStatuses.filter(job => job.status === "completed");
  
  return (
    <div className="space-y-4">
      {completedJobs.map(job => (
        <Card key={job.id}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{job.title}</CardTitle>
            <CardDescription>Completed: {new Date(job.dueDate).toLocaleDateString()}</CardDescription>
          </CardHeader>
          <CardFooter className="pt-2">
            <div className="flex justify-between w-full">
              <span className="text-sm text-muted-foreground">
                Status: <span className="text-green-500 font-medium">Completed</span>
              </span>
              <Button variant="outline" size="sm">View Details</Button>
            </div>
          </CardFooter>
        </Card>
      ))}
      {completedJobs.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8">
          You don't have any completed jobs yet.
        </p>
      )}
    </div>
  );
};

export default CompletedJobsList;
