
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Example submissions data - this would come from an API in a real app
const submissions = [
  { id: 101, jobId: 1, submittedDate: "2023-12-10", status: "pending_review" },
  { id: 102, jobId: 2, submittedDate: "2023-11-25", status: "approved", feedback: "Great work!" },
];

// Example jobs data - this would come from an API in a real app
const jobStatuses = [
  { id: 1, title: "Logo Design for Tech Startup", status: "in_progress", dueDate: "2023-12-15" },
  { id: 2, title: "Social Media Campaign", status: "completed", dueDate: "2023-11-30" },
  { id: 3, title: "Website Redesign", status: "pending_review", dueDate: "2023-12-20" },
];

const SubmissionsList = () => {
  return (
    <div className="space-y-4">
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
    </div>
  );
};

export default SubmissionsList;
