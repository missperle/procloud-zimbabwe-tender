
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Example job/submission data - this would come from an API in a real app
const jobStatuses = [
  { id: 1, title: "Logo Design for Tech Startup", status: "in_progress", dueDate: "2023-12-15" },
  { id: 2, title: "Social Media Campaign", status: "completed", dueDate: "2023-11-30" },
  { id: 3, title: "Website Redesign", status: "pending_review", dueDate: "2023-12-20" },
];

const submissions = [
  { id: 101, jobId: 1, submittedDate: "2023-12-10", status: "pending_review" },
  { id: 102, jobId: 2, submittedDate: "2023-11-25", status: "approved", feedback: "Great work!" },
];

const JobsSection = () => {
  return (
    <div className="w-full md:w-2/3">
      <Tabs defaultValue="active_jobs">
        <TabsList className="mb-4">
          <TabsTrigger value="active_jobs">Active Jobs</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
          <TabsTrigger value="past_jobs">Completed Jobs</TabsTrigger>
        </TabsList>

        <TabsContent value="active_jobs" className="space-y-4">
          {jobStatuses
            .filter(job => job.status === "in_progress")
            .map(job => (
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
          {jobStatuses.filter(job => job.status === "in_progress").length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              You don't have any active jobs at the moment.
            </p>
          )}
        </TabsContent>

        <TabsContent value="submissions" className="space-y-4">
          {submissions.map(submission => {
            const job = jobStatuses.find(j => j.id === submission.jobId);
            return (
              <Card key={submission.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{job?.title}</CardTitle>
                  <CardDescription>Submitted: {new Date(submission.submittedDate).toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardFooter className="pt-2">
                  <div className="flex justify-between w-full">
                    <span className="text-sm text-muted-foreground">
                      Status: 
                      {submission.status === "pending_review" && (
                        <span className="text-amber-500 font-medium"> Pending Review</span>
                      )}
                      {submission.status === "approved" && (
                        <span className="text-green-500 font-medium"> Approved</span>
                      )}
                    </span>
                    <Button variant="outline" size="sm">View Submission</Button>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
          {submissions.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              You haven't made any submissions yet.
            </p>
          )}
        </TabsContent>

        <TabsContent value="past_jobs" className="space-y-4">
          {jobStatuses
            .filter(job => job.status === "completed")
            .map(job => (
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
          {jobStatuses.filter(job => job.status === "completed").length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              You don't have any completed jobs yet.
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JobsSection;
