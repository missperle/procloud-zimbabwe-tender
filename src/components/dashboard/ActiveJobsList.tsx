
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LoadingState from "@/components/dashboard/LoadingState";
import { useState, useEffect } from "react";

// Example job data - this would come from an API in a real app
const jobStatuses = [
  { id: 1, title: "Logo Design for Tech Startup", status: "in_progress", dueDate: "2023-12-15" },
  { id: 2, title: "Social Media Campaign", status: "completed", dueDate: "2023-11-30" },
  { id: 3, title: "Website Redesign", status: "pending_review", dueDate: "2023-12-20" },
];

const ActiveJobsList = () => {
  const [loading, setLoading] = useState(true);
  const [activeJobs, setActiveJobs] = useState<typeof jobStatuses>([]);
  
  // Simulate API fetch
  useEffect(() => {
    const fetchJobs = async () => {
      // In a real app, this would be an API call
      setTimeout(() => {
        setActiveJobs(jobStatuses.filter(job => job.status === "in_progress"));
        setLoading(false);
      }, 1000);
    };
    
    fetchJobs();
  }, []);
  
  if (loading) {
    return <LoadingState variant="skeleton" showLayout={false} items={2} />;
  }
  
  return (
    <div className="space-y-4">
      {activeJobs.map(job => (
        <Card key={job.id}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{job.title}</CardTitle>
            <CardDescription>Due: {new Date(job.dueDate).toLocaleDateString()}</CardDescription>
          </CardHeader>
          <CardFooter className="pt-2">
            <div className="flex justify-between w-full">
              <span className="text-sm text-muted-foreground">
                Status: <span className="text-amber-500 font-medium">In Progress</span>
              </span>
              <Button variant="outline" size="sm">View Details</Button>
            </div>
          </CardFooter>
        </Card>
      ))}
      {activeJobs.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8">
          You don't have any active jobs at the moment.
        </p>
      )}
    </div>
  );
};

export default ActiveJobsList;
