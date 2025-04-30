
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import JobCard from "@/components/jobs/JobCard";
import JobsFilter from "@/components/jobs/JobsFilter";

// Mock data
const mockJobs = [
  {
    id: "job1",
    title: "Brand Identity Design for Local Restaurant",
    company: "Taste of Zim",
    budget: "$150-200",
    deadline: "May 15, 2025",
    categories: ["Design", "Branding"],
    brief: "Looking for a talented designer to create a brand identity for our new restaurant in Harare. We need a logo, color palette, and basic brand guidelines."
  },
  {
    id: "job2",
    title: "E-commerce Website Development",
    company: "Fashion Outlet",
    budget: "$300-500",
    deadline: "May 20, 2025",
    categories: ["Development", "Web"],
    brief: "Need a developer to build a simple e-commerce website for our fashion business. Should include product listings, cart functionality, and payment integration."
  },
  {
    id: "job3",
    title: "Social Media Content Creation",
    company: "Victoria Falls Tours",
    budget: "$100-150",
    deadline: "May 10, 2025",
    categories: ["Marketing", "Social Media"],
    brief: "Looking for a content creator to develop social media posts for our tourism company. Need 20 engaging posts with images for Instagram and Facebook."
  },
  {
    id: "job4",
    title: "Copywriting for Company Website",
    company: "ZimTech Solutions",
    budget: "$80-120",
    deadline: "May 25, 2025",
    categories: ["Writing", "Marketing"],
    brief: "We need compelling copy for our new tech company website. Approximately 5 pages including home, about, services, team, and contact."
  },
  {
    id: "job5",
    title: "Product Photography for Craft Business",
    company: "Handmade Zimbabwe",
    budget: "$70-100",
    deadline: "May 12, 2025",
    categories: ["Photography"],
    brief: "Need professional photos of our handmade crafts. Approximately 30 products need to be photographed with white background for our online shop."
  },
  {
    id: "job6",
    title: "Motion Graphics for Company Intro",
    company: "Green Energy Zimbabwe",
    budget: "$200-250",
    deadline: "May 30, 2025",
    categories: ["Video", "Animation"],
    brief: "Looking for a motion graphics designer to create a 30-second company introduction video explaining our solar energy solutions."
  },
];

const Jobs = () => {
  const [filteredJobs, setFilteredJobs] = useState(mockJobs);
  
  const handleFilter = (filters: any) => {
    let results = [...mockJobs];
    
    if (filters.category) {
      results = results.filter(job => 
        job.categories.some(cat => cat.toLowerCase() === filters.category.toLowerCase())
      );
    }
    
    if (filters.budget) {
      // Simple budget filtering logic - could be improved
      const [min, max] = filters.budget.split('-').map(Number);
      if (max) {
        results = results.filter(job => {
          const jobBudgetAvg = parseInt(job.budget.replace(/[^0-9-]/g, '').split('-').reduce((a, b) => (parseInt(a) + parseInt(b)) / 2, 0));
          return jobBudgetAvg >= min && jobBudgetAvg <= max;
        });
      } else {
        results = results.filter(job => {
          const jobBudgetAvg = parseInt(job.budget.replace(/[^0-9-]/g, '').split('-').reduce((a, b) => (parseInt(a) + parseInt(b)) / 2, 0));
          return jobBudgetAvg >= min;
        });
      }
    }
    
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      results = results.filter(job => 
        job.title.toLowerCase().includes(term) || 
        job.company.toLowerCase().includes(term) || 
        job.brief.toLowerCase().includes(term)
      );
    }
    
    setFilteredJobs(results);
  };

  return (
    <Layout>
      <div className="bg-procloud-gray-100 py-8 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h1 className="mb-4">Find Jobs</h1>
            <p className="text-lg text-procloud-gray-600 max-w-2xl mx-auto">
              Browse through available projects and submit your work directly.
              No bidding, no negotiations - just showcase your talent.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
              <JobsFilter onFilter={handleFilter} />
            </div>
            
            <div className="md:col-span-3">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-procloud-gray-200 mb-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold">Available Jobs</h2>
                  <span className="text-sm text-procloud-gray-600">
                    Showing {filteredJobs.length} jobs
                  </span>
                </div>
              </div>
              
              {filteredJobs.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredJobs.map((job) => (
                    <JobCard key={job.id} {...job} />
                  ))}
                </div>
              ) : (
                <div className="bg-white p-8 rounded-lg shadow-sm border border-procloud-gray-200 text-center">
                  <h3 className="text-xl font-bold mb-2">No jobs found</h3>
                  <p className="text-procloud-gray-600">
                    Try adjusting your filters or check back later for new opportunities.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Jobs;
