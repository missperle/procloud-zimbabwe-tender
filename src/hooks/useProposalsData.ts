
import { useState, useEffect } from "react";
import { getFirestore, doc, getDoc, query, collection, where, getDocs } from "firebase/firestore";
import { getApp } from "firebase/app";
import { ProposalData } from "@/components/client/proposals/ProposalCard";
import { toast } from "@/hooks/use-toast";

// Mock data for briefs with proposals
const mockBriefs = [
  { id: "all", name: "All Briefs" },
  { id: "1", name: "Logo Design" },
  { id: "2", name: "Website Redesign" },
  { id: "3", name: "Mobile App UI" },
  { id: "4", name: "Brochure Design" },
];

// Mock proposals data
const mockProposals = [
  {
    id: "p1",
    briefId: "1",
    freelancer: {
      id: "f1",
      alias: "Design Expert",
      rating: 4.9,
      skills: ["Logo Design", "Branding", "Illustrator"],
      successRate: 98,
      projectsCompleted: 43,
      verified: true
    },
    bidAmount: "$450",
    text: "I'm a logo design specialist with 7 years of experience. My designs have won multiple awards and I specialize in creating memorable brand identities. I'll provide 3 initial concepts and unlimited revisions until you're completely satisfied with the final design.",
    timeline: "7 days",
    adminReview: {
      score: 5,
      comment: "Excellent proposal with clear deliverables and timeline. This creator has consistently delivered high-quality logos for similar projects."
    }
  },
  {
    id: "p2",
    briefId: "1",
    freelancer: {
      id: "f2",
      alias: "Creative Studio",
      rating: 4.8,
      skills: ["Logo Design", "Visual Identity", "Print Design"],
      successRate: 95,
      projectsCompleted: 37,
      verified: true
    },
    bidAmount: "$480",
    text: "Professional graphic designer with experience working with Fortune 500 companies. I focus on creating logos that tell your brand's story and resonate with your target audience. My process is collaborative, ensuring that your vision is brought to life while incorporating best practices in design.",
    timeline: "8 days",
    adminReview: {
      score: 4,
      comment: "Strong proposal with good understanding of the brief. Past work shows consistent quality and attention to detail."
    }
  },
  {
    id: "p3",
    briefId: "2",
    freelancer: {
      id: "f3",
      alias: "Web Wizard",
      rating: 4.7,
      skills: ["Web Development", "UI Design", "React", "Responsive Design"],
      successRate: 92,
      projectsCompleted: 28,
      verified: false
    },
    bidAmount: "$2,800",
    text: "Full-stack developer with expertise in responsive web design. I can redesign your website with modern aesthetics and improved user experience. I'll implement best practices for performance and SEO, ensuring your site loads quickly and ranks well in search engines.",
    timeline: "21 days"
  },
  {
    id: "p4",
    briefId: "3",
    freelancer: {
      id: "f4",
      alias: "UX Innovator",
      rating: 4.9,
      skills: ["UI/UX Design", "Mobile App Design", "Figma", "Prototyping"],
      successRate: 97,
      projectsCompleted: 52,
      verified: true
    },
    bidAmount: "$2,300",
    text: "UI/UX specialist focusing on mobile applications. My designs are intuitive, accessible, and follow the latest design principles. I'll create wireframes, mockups, and interactive prototypes that can be easily implemented by your development team.",
    timeline: "14 days",
    adminReview: {
      score: 5,
      comment: "Outstanding proposal with comprehensive approach to mobile UI design. Highly recommended for this project."
    }
  },
  {
    id: "p5",
    briefId: "4",
    freelancer: {
      id: "f5",
      alias: "Print Pro",
      rating: 4.6,
      skills: ["Print Design", "Brochure Design", "Layout Design"],
      successRate: 94,
      projectsCompleted: 31,
      verified: false
    },
    bidAmount: "$320",
    text: "Print design expert with 10+ years of experience. I create brochures that effectively communicate your message and attract customers. I'll handle everything from concept to print-ready files, ensuring your brochure stands out from the competition.",
    timeline: "10 days"
  },
];

type FreelancerRecommendation = {
  id: string;
  name: string;
  avatar?: string;
  skills: string[];
  rating: number;
};

export function useProposalsData() {
  const [activeTab, setActiveTab] = useState("all");
  const [filteredProposals, setFilteredProposals] = useState<ProposalData[]>(mockProposals);
  const [recommendedFreelancers, setRecommendedFreelancers] = useState<FreelancerRecommendation[]>([]);
  const [recommendedProposals, setRecommendedProposals] = useState<string[]>(["p1", "p4"]);

  useEffect(() => {
    if (activeTab !== "all") {
      loadRecommendations(activeTab);
    } else {
      setRecommendedFreelancers([]);
    }
  }, [activeTab]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "all") {
      setFilteredProposals(mockProposals);
    } else {
      setFilteredProposals(mockProposals.filter(p => p.briefId === value));
    }
  };

  const loadRecommendations = async (briefId: string) => {
    try {
      const db = getFirestore(getApp("proverb-digital-client"));
      
      // Get the job document with recommendations
      const jobSnap = await getDoc(doc(db, 'jobs', briefId));
      
      if (!jobSnap.exists()) {
        console.log("No job document found");
        return;
      }
      
      const recommendations = jobSnap.data()?.recommendations || [];
      
      if (recommendations.length === 0) {
        console.log("No recommendations found");
        return;
      }
      
      // Fetch recommended freelancer profiles
      const recommendedFreelancersData = [];
      
      for (let uid of recommendations) {
        try {
          const userSnap = await getDoc(doc(db, 'users', uid));
          if (userSnap.exists()) {
            const userData = userSnap.data();
            recommendedFreelancersData.push({
              id: uid,
              name: userData.name || 'Unknown',
              avatar: userData.avatar || `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 50) + 1}.jpg`,
              skills: userData.skills || [],
              rating: userData.rating || 0
            });
          }
        } catch (error) {
          console.error(`Error fetching user ${uid}:`, error);
        }
      }
      
      setRecommendedFreelancers(recommendedFreelancersData);
      
    } catch (error) {
      console.error("Error loading recommendations:", error);
    }
  };
  
  const handleRequestCreator = (proposalId: string) => {
    // In a real app, this would send an API request to accept the proposal
    toast({
      title: "Creator requested",
      description: "Proverb Digital has been notified of your request and will facilitate the introduction.",
    });
  };

  const handleMessageCreator = (proposalId: string) => {
    // In a real app, this would open a message dialog
    toast({
      title: "Message sent",
      description: "Your message will be forwarded to the creator via Proverb Digital.",
    });
  };

  return {
    briefs: mockBriefs,
    activeTab,
    filteredProposals,
    recommendedFreelancers,
    recommendedProposals,
    handleTabChange,
    handleRequestCreator,
    handleMessageCreator
  };
}

export type { FreelancerRecommendation };
