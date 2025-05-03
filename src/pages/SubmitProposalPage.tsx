
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import SubmitProposal from "@/components/proposals/SubmitProposal";

const SubmitProposalPage = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const [jobTitle, setJobTitle] = useState("Job Title");
  
  useEffect(() => {
    // In a real implementation, you would fetch the job details here
    // For example:
    // const fetchJobDetails = async () => {
    //   const jobDoc = await getDoc(doc(db, "jobs", jobId));
    //   if (jobDoc.exists()) {
    //     setJobTitle(jobDoc.data().title);
    //   }
    // };
    // fetchJobDetails();
    
    // For demo purposes, we're setting a placeholder title
    setJobTitle("Web Development Project");
  }, [jobId]);

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Submit Proposal for: {jobTitle}</h1>
        <SubmitProposal jobTitle={jobTitle} jobId={jobId || ""} />
      </div>
    </Layout>
  );
};

export default SubmitProposalPage;
