
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, DollarSign, Building, Clock } from "lucide-react";

// Import the mock jobs data
import { mockJobs } from "@/data/mockJobs";

const JobDetailsPage = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real implementation, you would fetch the job details from an API
    // For now, we'll use the mock data
    const foundJob = mockJobs.find((job) => job.id === jobId);
    
    if (foundJob) {
      setJob(foundJob);
    }
    
    setLoading(false);
  }, [jobId]);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <div className="flex justify-center items-center h-64">
            <p>Loading job details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!job) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <div className="flex flex-col items-center h-64 justify-center">
            <h2 className="text-2xl font-bold mb-4">Job Not Found</h2>
            <p className="mb-4">The job you're looking for doesn't exist or has been removed.</p>
            <Link to="/jobs">
              <Button>Back to Jobs</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-procloud-gray-100 py-8 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Link to="/jobs" className="text-procloud-green hover:underline mb-4 inline-flex items-center">
              <span className="mr-2">←</span> Back to Jobs
            </Link>
          </div>

          <Card className="mb-6 shadow-md">
            <CardHeader className="pb-0">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-2">{job.title}</h1>
                  <p className="text-procloud-gray-600 flex items-center">
                    <Building className="h-4 w-4 mr-2" /> {job.company}
                  </p>
                </div>
                <Badge className="bg-procloud-green text-white hover:bg-procloud-green-dark self-start">
                  Open
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 border-b border-procloud-gray-200 pb-6">
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-procloud-green" />
                  <div>
                    <p className="text-sm text-procloud-gray-600">Budget</p>
                    <p className="font-medium">{job.budget}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-procloud-green" />
                  <div>
                    <p className="text-sm text-procloud-gray-600">Deadline</p>
                    <p className="font-medium">{job.deadline}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-procloud-green" />
                  <div>
                    <p className="text-sm text-procloud-gray-600">Posted</p>
                    <p className="font-medium">1 week ago</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-3">Job Description</h2>
                <p className="text-procloud-gray-700 whitespace-pre-line">{job.brief}</p>
              </div>
              
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-3">Skills Required</h2>
                <div className="flex flex-wrap gap-2">
                  {job.categories.map((category: string) => (
                    <Badge key={category} variant="outline" className="border-procloud-gray-300">
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="mt-8 flex justify-center">
                <Link to={`/jobs/${jobId}/submit-proposal`} className="w-full max-w-md">
                  <Button className="w-full bg-procloud-green hover:bg-procloud-green-dark text-white py-6">
                    Submit Proposal
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default JobDetailsPage;
