
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import SubmitProposal from "@/components/proposals/SubmitProposal";
import { mockJobs } from "@/data/mockJobs";
import { Button } from "@/components/ui/button";

const SubmitProposalPage = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const [jobTitle, setJobTitle] = useState("Job Title");
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Find the job from mock data
    const job = mockJobs.find(job => job.id === jobId);
    
    if (job) {
      setJobTitle(job.title);
    }
    
    setLoading(false);
  }, [jobId]);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <Link to={`/jobs/${jobId}`} className="text-procloud-green hover:underline mb-4 inline-flex items-center">
            <span className="mr-2">←</span> Back to Job Details
          </Link>
        </div>
        
        <h1 className="text-2xl font-bold mb-6">Submit Proposal for: {jobTitle}</h1>
        <SubmitProposal jobTitle={jobTitle} jobId={jobId || ""} />
      </div>
    </Layout>
  );
};

export default SubmitProposalPage;
