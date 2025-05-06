import { useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useNavigate, Link } from "react-router-dom";
import { useFreelancerProfile } from "@/hooks/useFreelancerProfile";
import ProfileCompletionWidget from "@/components/freelancers/ProfileCompletionWidget";
import { Briefcase, Clock, DollarSign, MapPin, Pencil } from "lucide-react";

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

const Dashboard = () => {
  const { currentUser, loading } = useAuth();
  const { userRole } = useSubscription();
  const navigate = useNavigate();
  const { profile, profileCompletionPercentage } = useFreelancerProfile();

  useEffect(() => {
    if (!loading && !currentUser) {
      navigate("/login");
    }
  }, [currentUser, loading, navigate]);

  // Redirect to role-specific dashboard if available
  useEffect(() => {
    if (!loading && currentUser) {
      if (userRole === "client") {
        navigate("/client-dashboard");
      }
    }
  }, [currentUser, loading, userRole, navigate]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
          <div className="text-center">
            <div className="h-8 w-8 border-4 border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          {/* Profile Section */}
          <div className="w-full md:w-1/3 space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex justify-between items-center">
                  <span>My Profile</span>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/edit-profile">
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit Profile</span>
                    </Link>
                  </Button>
                </CardTitle>
                <CardDescription>
                  {profile?.title || "Freelancer"}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                {profile ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{profile.location || "Location not specified"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{profile.years_experience ? `${profile.years_experience} years experience` : "Experience not specified"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      <span>{profile.hourly_rate ? `$${profile.hourly_rate}/hr` : "Hourly rate not specified"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Briefcase className="h-4 w-4" />
                      <span>{profile.education || "Education not specified"}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    Your profile is not complete. Please fill in your details.
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <ProfileCompletionWidget />
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Portfolio</CardTitle>
                <CardDescription>Showcase your best work</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Add portfolio items to increase your visibility to potential clients.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" asChild className="w-full">
                  <Link to="/edit-profile?tab=portfolio">Manage Portfolio</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Jobs & Submissions Section */}
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
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
