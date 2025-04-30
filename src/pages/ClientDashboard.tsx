
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import JobStatusCard from "@/components/dashboard/JobStatusCard";
import SubmissionCard from "@/components/dashboard/SubmissionCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";

// Define the allowed status types to match component props
type JobStatusType = "active" | "completed" | "expired";
type SubmissionStatusType = "selected" | "pending" | "rejected";

// Mock data with proper type annotations
const mockJobs = [
  {
    id: "job1",
    title: "Brand Identity Design for Local Restaurant",
    status: "active" as JobStatusType,
    budget: "$150-200",
    deadline: "May 15, 2025",
    submissionsCount: 5,
    daysLeft: 7,
  },
  {
    id: "job2",
    title: "E-commerce Website Development",
    status: "active" as JobStatusType,
    budget: "$300-500",
    deadline: "May 20, 2025",
    submissionsCount: 3,
    daysLeft: 12,
  },
  {
    id: "job3",
    title: "Social Media Content Creation",
    status: "completed" as JobStatusType,
    budget: "$100-150",
    deadline: "April 10, 2025",
    submissionsCount: 8,
  },
  {
    id: "job4",
    title: "Copywriting for Company Website",
    status: "expired" as JobStatusType,
    budget: "$80-120",
    deadline: "April 5, 2025",
    submissionsCount: 2,
  }
];

const mockSubmissions = [
  {
    id: "sub1",
    jobId: "job1",
    freelancerName: "Tatenda M.",
    freelancerId: "user1",
    submittedAt: "2 days ago",
    files: ["logo.png", "brand-guide.pdf"],
    note: "I've created a modern identity that reflects the restaurant's fusion concept while maintaining a connection to local traditions.",
    status: "pending" as SubmissionStatusType,
  },
  {
    id: "sub2",
    jobId: "job1",
    freelancerName: "Kudzai R.",
    freelancerId: "user3",
    submittedAt: "3 days ago",
    files: ["logo-concepts.pdf"],
    note: "Here are 3 concepts to choose from. I focused on creating a warm, inviting brand identity that would appeal to your target audience.",
    status: "pending" as SubmissionStatusType,
  },
  {
    id: "sub3",
    jobId: "job1",
    freelancerName: "Rudo M.",
    freelancerId: "user5",
    submittedAt: "4 days ago",
    files: ["branding-package.zip"],
    note: "I've developed a comprehensive brand identity package including logo variations, color palette, typography, and application examples.",
    status: "pending" as SubmissionStatusType,
  }
];

const ClientDashboard = () => {
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [viewingSubmissions, setViewingSubmissions] = useState(false);
  
  // Filter jobs by status
  const filterJobsByStatus = (status: JobStatusType) => {
    return mockJobs.filter(job => job.status === status);
  };
  
  // Get submissions for a specific job
  const getJobSubmissions = (jobId: string) => {
    return mockSubmissions.filter(submission => submission.jobId === jobId);
  };
  
  const handleSelectSubmission = (submissionId: string) => {
    // In a real app, this would update the status in the database
    console.log(`Selected submission: ${submissionId}`);
    alert("Submission selected! In a real app, this would trigger payment from escrow.");
  };
  
  const handleViewSubmission = (submissionId: string) => {
    // In a real app, this would open a detailed view
    console.log(`Viewing submission: ${submissionId}`);
    alert("Viewing submission details!");
  };
  
  return (
    <Layout>
      <div className="bg-procloud-gray-100 py-8 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1>Client Dashboard</h1>
            <Link to="/post-job">
              <Button className="bg-procloud-green hover:bg-procloud-green-dark text-black">
                Post New Brief
              </Button>
            </Link>
          </div>
          
          {viewingSubmissions && selectedJob ? (
            <>
              <div className="mb-6">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setViewingSubmissions(false);
                    setSelectedJob(null);
                  }} 
                  className="bg-white"
                >
                  ← Back to Dashboard
                </Button>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-procloud-gray-200 p-6 mb-8">
                <h2 className="text-xl font-bold mb-4">
                  Submissions for "{mockJobs.find(j => j.id === selectedJob)?.title}"
                </h2>
                
                {getJobSubmissions(selectedJob).length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {getJobSubmissions(selectedJob).map((submission) => (
                      <SubmissionCard 
                        key={submission.id}
                        {...submission}
                        onSelect={() => handleSelectSubmission(submission.id)}
                        onView={() => handleViewSubmission(submission.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-lg text-procloud-gray-600">No submissions yet</p>
                    <p className="text-procloud-gray-500">Check back later as freelancers submit their work.</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Tabs defaultValue="active" className="w-full">
              <TabsList className="bg-white border border-procloud-gray-200 rounded-lg w-full justify-start mb-6 p-1">
                <TabsTrigger value="active" className="flex-1">Active Briefs</TabsTrigger>
                <TabsTrigger value="completed" className="flex-1">Completed</TabsTrigger>
                <TabsTrigger value="expired" className="flex-1">Expired</TabsTrigger>
              </TabsList>
              
              <TabsContent value="active" className="mt-0">
                {filterJobsByStatus("active").length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filterJobsByStatus("active").map((job) => (
                      <div key={job.id} onClick={() => {
                        setSelectedJob(job.id);
                        setViewingSubmissions(true);
                      }}>
                        <JobStatusCard {...job} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-sm border border-procloud-gray-200 p-8 text-center">
                    <h3 className="text-xl font-bold mb-2">No active briefs</h3>
                    <p className="text-procloud-gray-600 mb-6">
                      Post your first brief to start receiving submissions from freelancers.
                    </p>
                    <Link to="/post-job">
                      <Button className="bg-procloud-green hover:bg-procloud-green-dark text-black">
                        Post a Brief
                      </Button>
                    </Link>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="completed" className="mt-0">
                {filterJobsByStatus("completed").length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filterJobsByStatus("completed").map((job) => (
                      <JobStatusCard key={job.id} {...job} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-sm border border-procloud-gray-200 p-8 text-center">
                    <h3 className="text-xl font-bold mb-2">No completed briefs</h3>
                    <p className="text-procloud-gray-600">
                      When you select a freelancer's submission and release payment, your briefs will appear here.
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="expired" className="mt-0">
                {filterJobsByStatus("expired").length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filterJobsByStatus("expired").map((job) => (
                      <JobStatusCard key={job.id} {...job} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-sm border border-procloud-gray-200 p-8 text-center">
                    <h3 className="text-xl font-bold mb-2">No expired briefs</h3>
                    <p className="text-procloud-gray-600">
                      Briefs that reach their deadline without you selecting a submission will appear here.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ClientDashboard;
