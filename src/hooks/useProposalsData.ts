
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProposalData } from "@/components/client/proposals/ProposalCard";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

type FreelancerRecommendation = {
  id: string;
  name: string;
  avatar?: string;
  skills: string[];
  rating: number;
};

export function useProposalsData() {
  const [activeTab, setActiveTab] = useState("all");
  const [briefs, setBriefs] = useState<{id: string, name: string}[]>([{ id: "all", name: "All Briefs" }]);
  const [filteredProposals, setFilteredProposals] = useState<ProposalData[]>([]);
  const [recommendedFreelancers, setRecommendedFreelancers] = useState<FreelancerRecommendation[]>([]);
  const [recommendedProposals, setRecommendedProposals] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const { toast } = useToast();

  // Fetch briefs when component mounts
  useEffect(() => {
    fetchClientBriefs();
  }, [currentUser]);

  // Fetch proposals when tab changes
  useEffect(() => {
    fetchProposals(activeTab);
  }, [activeTab]);

  // Get client briefs from Supabase
  const fetchClientBriefs = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('client_briefs')
        .select('id, title')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform data for the briefs tabs
      const briefsData = [
        { id: "all", name: "All Briefs" },
        ...(data || []).map(brief => ({ 
          id: brief.id, 
          name: brief.title 
        }))
      ];
      
      setBriefs(briefsData);
    } catch (error) {
      console.error("Error fetching briefs:", error);
      toast({
        title: "Error fetching briefs",
        description: "Could not load your briefs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Get proposals for the selected brief
  const fetchProposals = async (briefId: string) => {
    if (!currentUser) return;
    
    try {
      setLoading(true);

      // For now, we'll use the mock data but transform it to match what would come from Supabase
      // This can be replaced with actual Supabase queries once the tables are set up
      const mockProposals = [
        {
          id: "p1",
          brief_id: "1",
          freelancer: {
            id: "f1",
            alias: "Design Expert",
            rating: 4.9,
            skills: ["Logo Design", "Branding", "Illustrator"],
            successRate: 98,
            projectsCompleted: 43,
            verified: true
          },
          price: "$450",
          content: "I'm a logo design specialist with 7 years of experience. My designs have won multiple awards and I specialize in creating memorable brand identities. I'll provide 3 initial concepts and unlimited revisions until you're completely satisfied with the final design.",
          timeline: "7 days",
          admin_review: {
            score: 5,
            comment: "Excellent proposal with clear deliverables and timeline. This creator has consistently delivered high-quality logos for similar projects."
          }
        },
        {
          id: "p2",
          brief_id: "1",
          freelancer: {
            id: "f2",
            alias: "Creative Studio",
            rating: 4.8,
            skills: ["Logo Design", "Visual Identity", "Print Design"],
            successRate: 95,
            projectsCompleted: 37,
            verified: true
          },
          price: "$480",
          content: "Professional graphic designer with experience working with Fortune 500 companies. I focus on creating logos that tell your brand's story and resonate with your target audience. My process is collaborative, ensuring that your vision is brought to life while incorporating best practices in design.",
          timeline: "8 days",
          admin_review: {
            score: 4,
            comment: "Strong proposal with good understanding of the brief. Past work shows consistent quality and attention to detail."
          }
        },
        {
          id: "p3",
          brief_id: "2",
          freelancer: {
            id: "f3",
            alias: "Web Wizard",
            rating: 4.7,
            skills: ["Web Development", "UI Design", "React", "Responsive Design"],
            successRate: 92,
            projectsCompleted: 28,
            verified: false
          },
          price: "$2,800",
          content: "Full-stack developer with expertise in responsive web design. I can redesign your website with modern aesthetics and improved user experience. I'll implement best practices for performance and SEO, ensuring your site loads quickly and ranks well in search engines.",
          timeline: "21 days"
        },
        {
          id: "p4",
          brief_id: "3",
          freelancer: {
            id: "f4",
            alias: "UX Innovator",
            rating: 4.9,
            skills: ["UI/UX Design", "Mobile App Design", "Figma", "Prototyping"],
            successRate: 97,
            projectsCompleted: 52,
            verified: true
          },
          price: "$2,300",
          content: "UI/UX specialist focusing on mobile applications. My designs are intuitive, accessible, and follow the latest design principles. I'll create wireframes, mockups, and interactive prototypes that can be easily implemented by your development team.",
          timeline: "14 days",
          admin_review: {
            score: 5,
            comment: "Outstanding proposal with comprehensive approach to mobile UI design. Highly recommended for this project."
          }
        },
        {
          id: "p5",
          brief_id: "4",
          freelancer: {
            id: "f5",
            alias: "Print Pro",
            rating: 4.6,
            skills: ["Print Design", "Brochure Design", "Layout Design"],
            successRate: 94,
            projectsCompleted: 31,
            verified: false
          },
          price: "$320",
          content: "Print design expert with 10+ years of experience. I create brochures that effectively communicate your message and attract customers. I'll handle everything from concept to print-ready files, ensuring your brochure stands out from the competition.",
          timeline: "10 days"
        },
      ];

      // Filter proposals if a specific brief is selected
      const proposals = briefId === "all" 
        ? mockProposals 
        : mockProposals.filter(p => p.brief_id === briefId);

      // Transform mock data to match ProposalData interface
      const transformedProposals: ProposalData[] = proposals.map(item => ({
        id: item.id,
        briefId: item.brief_id,
        bidAmount: item.price,
        text: item.content,
        timeline: item.timeline,
        freelancer: item.freelancer,
        adminReview: item.admin_review
      }));

      setFilteredProposals(transformedProposals);
      
      // If a specific brief is selected, fetch recommendations
      if (briefId !== "all") {
        await loadRecommendations(briefId);
      } else {
        setRecommendedFreelancers([]);
        setRecommendedProposals([]);
      }
    } catch (error) {
      console.error("Error fetching proposals:", error);
      toast({
        title: "Error fetching proposals",
        description: "Could not load proposals. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadRecommendations = async (briefId: string) => {
    // For now we'll use static recommendations
    // This will be replaced with actual Supabase queries
    if (briefId === "1") {
      setRecommendedProposals(["p1", "p4"]);
      setRecommendedFreelancers([
        {
          id: "rec1",
          name: "DesignMaster",
          avatar: "https://randomuser.me/api/portraits/men/32.jpg",
          skills: ["Logo Design", "Branding"],
          rating: 4.9
        },
        {
          id: "rec2",
          name: "CreativeGenius",
          avatar: "https://randomuser.me/api/portraits/women/44.jpg",
          skills: ["Visual Identity", "Illustration"],
          rating: 4.8
        }
      ]);
    } else if (briefId === "3") {
      setRecommendedProposals(["p4"]);
      setRecommendedFreelancers([
        {
          id: "rec3",
          name: "UX_Pioneer",
          avatar: "https://randomuser.me/api/portraits/men/22.jpg",
          skills: ["UI/UX", "Mobile Apps"],
          rating: 5.0
        }
      ]);
    } else {
      setRecommendedProposals([]);
      setRecommendedFreelancers([]);
    }
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
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
    briefs,
    activeTab,
    filteredProposals,
    recommendedFreelancers,
    recommendedProposals,
    loading,
    handleTabChange,
    handleRequestCreator,
    handleMessageCreator
  };
}

export type { FreelancerRecommendation };
