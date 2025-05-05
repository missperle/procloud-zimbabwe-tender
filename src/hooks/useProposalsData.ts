
import { useState, useEffect } from "react";
import { getFirestore, doc, getDoc, query, collection, where, getDocs } from "firebase/firestore";
import { getApp } from "firebase/app";
import { ProposalData } from "@/components/client/proposals/ProposalCard";

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
      name: "Alex Johnson",
      avatar: "https://randomuser.me/api/portraits/men/41.jpg",
      rating: 4.9,
    },
    bidAmount: "$450",
    text: "I'm a logo design specialist with 7 years of experience. My designs have won multiple awards and I specialize in creating memorable brand identities.",
  },
  {
    id: "p2",
    briefId: "1",
    freelancer: {
      id: "f2",
      name: "Sarah Williams",
      avatar: "https://randomuser.me/api/portraits/women/42.jpg",
      rating: 4.8,
    },
    bidAmount: "$480",
    text: "Professional graphic designer with experience working with Fortune 500 companies. I focus on creating logos that tell your brand's story.",
  },
  {
    id: "p3",
    briefId: "2",
    freelancer: {
      id: "f3",
      name: "Michael Brown",
      avatar: "https://randomuser.me/api/portraits/men/43.jpg",
      rating: 4.7,
    },
    bidAmount: "$2,800",
    text: "Full-stack developer with expertise in responsive web design. I can redesign your website with modern aesthetics and improved user experience.",
  },
  {
    id: "p4",
    briefId: "3",
    freelancer: {
      id: "f4",
      name: "Emily Wilson",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 4.9,
    },
    bidAmount: "$2,300",
    text: "UI/UX specialist focusing on mobile applications. My designs are intuitive, accessible, and follow the latest design principles.",
  },
  {
    id: "p5",
    briefId: "4",
    freelancer: {
      id: "f5",
      name: "David Miller",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
      rating: 4.6,
    },
    bidAmount: "$320",
    text: "Print design expert with 10+ years of experience. I create brochures that effectively communicate your message and attract customers.",
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
  
  const handleAccept = (proposalId: string) => {
    // In a real app, this would send an API request to accept the proposal
    console.log(`Accepted proposal ${proposalId}`);
    // Maybe show a toast notification
    // Then remove the proposal from the list or mark it as accepted
  };

  const handleReject = (proposalId: string) => {
    // In a real app, this would send an API request to reject the proposal
    console.log(`Rejected proposal ${proposalId}`);
    // Maybe show a toast notification
    // Then remove the proposal from the list or mark it as rejected
  };

  return {
    briefs: mockBriefs,
    activeTab,
    filteredProposals,
    recommendedFreelancers,
    handleTabChange,
    handleAccept,
    handleReject
  };
}

export type { FreelancerRecommendation };
