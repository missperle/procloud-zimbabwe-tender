
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import JobCard from "@/components/jobs/JobCard";
import JobsFilter from "@/components/jobs/JobsFilter";
import { mockJobs } from "@/data/mockJobs";

const Jobs = () => {
  const [filteredJobs, setFilteredJobs] = useState(mockJobs);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);
  
  const handleFilter = (filters: any) => {
    let results = [...mockJobs];
    
    if (filters.category) {
      results = results.filter(job => 
        job.categories.some(cat => cat.toLowerCase() === filters.category.toLowerCase())
      );
    }
    
    if (filters.budget) {
      // Simple budget filtering logic - could be improved
      const [min, max] = filters.budget.split('-').map((val: string) => parseInt(val));
      if (max) {
        results = results.filter(job => {
          const jobBudgetAvg = parseInt(job.budget.replace(/[^0-9-]/g, '').split('-').reduce((a: string, b: string) => String((parseInt(a) + parseInt(b)) / 2), '0'));
          return jobBudgetAvg >= min && jobBudgetAvg <= max;
        });
      } else {
        results = results.filter(job => {
          const jobBudgetAvg = parseInt(job.budget.replace(/[^0-9-]/g, '').split('-').reduce((a: string, b: string) => String((parseInt(a) + parseInt(b)) / 2), '0'));
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
                    <JobCard 
                      key={job.id} 
                      {...job} 
                    />
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
