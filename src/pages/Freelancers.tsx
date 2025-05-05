import { useState } from "react";
import Layout from "@/components/layout/Layout";
import ProfileCard from "@/components/freelancers/ProfileCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Update mock data to use aliases instead of real names
const mockFreelancers = [
  {
    id: "user1",
    name: "creator_TND48M",
    title: "Graphic Designer",
    avatar: "",
    verified: true,
    rating: 4.8,
    skills: ["Logo Design", "UI/UX", "Branding"],
    completedJobs: 34,
  },
  {
    id: "user2",
    name: "creator_FRT29Z",
    title: "Web Developer",
    avatar: "",
    verified: true,
    rating: 4.9,
    skills: ["React", "Node.js", "WordPress"],
    completedJobs: 27,
  },
  {
    id: "user3",
    name: "creator_KDZ17X",
    title: "Content Writer",
    avatar: "",
    verified: false,
    rating: 4.5,
    skills: ["Copywriting", "Blogs", "SEO"],
    completedJobs: 18,
  },
  {
    id: "user4",
    name: "creator_TNR64Y",
    title: "Digital Marketer",
    avatar: "",
    verified: true,
    rating: 4.7,
    skills: ["Social Media", "Ads", "Analytics"],
    completedJobs: 23,
  },
  {
    id: "user5",
    name: "creator_RDC88P",
    title: "Video Editor",
    avatar: "",
    verified: false,
    rating: 4.3,
    skills: ["Motion Graphics", "After Effects", "Premier Pro"],
    completedJobs: 12,
  },
  {
    id: "user6",
    name: "creator_TKZ93M",
    title: "Full-Stack Developer",
    avatar: "",
    verified: true,
    rating: 5.0,
    skills: ["JavaScript", "Python", "React", "Django"],
    completedJobs: 41,
  },
];

const Freelancers = () => {
  const [filteredFreelancers, setFilteredFreelancers] = useState(mockFreelancers);
  const [searchTerm, setSearchTerm] = useState("");
  const [skill, setSkill] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const handleFilter = () => {
    let results = [...mockFreelancers];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(freelancer => 
        freelancer.name.toLowerCase().includes(term) || 
        freelancer.title.toLowerCase().includes(term)
      );
    }
    
    if (skill) {
      results = results.filter(freelancer => 
        freelancer.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
      );
    }
    
    if (verifiedOnly) {
      results = results.filter(freelancer => freelancer.verified);
    }
    
    setFilteredFreelancers(results);
  };

  const handleReset = () => {
    setSearchTerm("");
    setSkill("");
    setVerifiedOnly(false);
    setFilteredFreelancers(mockFreelancers);
  };

  return (
    <Layout>
      <div className="bg-procloud-gray-100 py-8 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h1 className="mb-4">Find Talented Creators</h1>
            <p className="text-lg text-procloud-gray-600 max-w-2xl mx-auto">
              Discover Zimbabwe's best talent for your next project, curated and managed by Proverb Digital.
            </p>
            <p className="text-sm text-procloud-gray-500 mt-2 max-w-2xl mx-auto">
              All creators use unique aliases to ensure fair selection based on quality of work alone.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-procloud-gray-200 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label htmlFor="search" className="block text-sm font-medium mb-1">
                  Search
                </label>
                <Input
                  id="search"
                  placeholder="Name or title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="skill" className="block text-sm font-medium mb-1">
                  Skill
                </label>
                <Select value={skill} onValueChange={setSkill}>
                  <SelectTrigger id="skill">
                    <SelectValue placeholder="Select skill" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="development">Development</SelectItem>
                    <SelectItem value="writing">Writing</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="video">Video & Animation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="verified"
                    checked={verifiedOnly}
                    onChange={(e) => setVerifiedOnly(e.target.checked)}
                    className="rounded text-procloud-green focus:ring-procloud-green mr-2"
                  />
                  <label htmlFor="verified" className="text-sm">
                    Verified Only
                  </label>
                </div>
                
                <div className="flex gap-2 ml-auto">
                  <Button onClick={handleFilter} className="bg-procloud-green hover:bg-procloud-green-dark text-black">
                    Filter
                  </Button>
                  <Button onClick={handleReset} variant="outline" className="border-procloud-gray-300">
                    Reset
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {filteredFreelancers.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFreelancers.map((freelancer) => (
                <ProfileCard key={freelancer.id} {...freelancer} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-sm border border-procloud-gray-200 text-center">
              <h3 className="text-xl font-bold mb-2">No creators found</h3>
              <p className="text-procloud-gray-600">
                Try adjusting your filters to find the talent you're looking for.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Freelancers;
