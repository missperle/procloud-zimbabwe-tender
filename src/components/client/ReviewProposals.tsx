import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, X } from "lucide-react";
import { getFirestore, doc, getDoc, query, collection, where, getDocs, onSnapshot } from "firebase/firestore";
import { getApp } from "firebase/app";

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

const ReviewProposals = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [filteredProposals, setFilteredProposals] = useState(mockProposals);
  const [recommendedFreelancers, setRecommendedFreelancers] = useState<Array<{
    id: string;
    name: string;
    avatar?: string;
    skills: string[];
    rating: number;
  }>>([]);
  const [sentimentData, setSentimentData] = useState<Record<string, { 
    clarity: number; 
    enthusiasm: number 
  }>>({});
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "all") {
      setFilteredProposals(mockProposals);
    } else {
      setFilteredProposals(mockProposals.filter(p => p.briefId === value));
      
      // Load recommendations when a specific brief is selected
      if (value !== "all") {
        loadRecommendations(value);
      } else {
        setRecommendedFreelancers([]);
      }
    }
  };

  useEffect(() => {
    // Watch for sentiment updates on proposals
    const watchProposals = async () => {
      try {
        const db = getFirestore(getApp("proverb-digital-client"));
        
        // Setup listeners for each proposal
        filteredProposals.forEach(proposal => {
          const proposalRef = doc(db, 'proposals', proposal.id);
          
          onSnapshot(proposalRef, (snap) => {
            if (snap.exists()) {
              const data = snap.data();
              if (data && data.sentiment) {
                setSentimentData(prev => ({
                  ...prev,
                  [proposal.id]: data.sentiment
                }));
              }
            }
          });
        });
      } catch (error) {
        console.error("Error setting up proposal listeners:", error);
      }
    };
    
    watchProposals();
  }, [filteredProposals]);

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

  // Helper function to get sentiment display classes
  const getSentimentClasses = (proposalId: string) => {
    const sentiment = sentimentData[proposalId];
    
    if (!sentiment) return {};
    
    const classes = {
      card: "",
      enthusiasmBadge: ""
    };
    
    // Low clarity - highlight card
    if (sentiment.clarity < 0.5) {
      classes.card = "border-2 border-red-400";
    }
    
    // High enthusiasm - show badge
    if (sentiment.enthusiasm > 0.8) {
      classes.enthusiasmBadge = "ml-2 bg-amber-400 text-black";
    }
    
    return classes;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Review Proposals</h2>
      
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="mb-6 flex flex-wrap">
          {mockBriefs.map((brief) => (
            <TabsTrigger key={brief.id} value={brief.id}>
              {brief.name}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-0">
          {/* AI Recommended Freelancers Section */}
          {activeTab !== "all" && recommendedFreelancers.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">Recommended Freelancers</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedFreelancers.map((freelancer) => (
                  <Card key={freelancer.id} className="overflow-hidden hover:shadow-md transition-shadow border-2 border-indigo-100">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <Avatar>
                          <AvatarImage src={freelancer.avatar} alt={freelancer.name} />
                          <AvatarFallback>
                            {freelancer.name.substr(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{freelancer.name}</h3>
                          <div className="flex items-center">
                            <span className="text-xs text-amber-burst mr-1">★</span>
                            <span className="text-xs">{freelancer.rating}/5</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <p className="text-xs text-muted-foreground mb-2">Skills:</p>
                        <div className="flex flex-wrap gap-2">
                          {freelancer.skills.map((skill, index) => (
                            <span 
                              key={index} 
                              className="text-xs bg-slate-100 px-2 py-1 rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <Button variant="link" className="px-0 text-xs mt-4">
                        View Full Profile
                      </Button>
                    </CardContent>
                    
                    <CardFooter className="bg-gray-50 p-4 flex justify-between">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Invite
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        Message
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          )}
          
          {/* Regular Proposals Section */}
          <h3 className="text-lg font-medium mb-4">{activeTab === "all" ? "All Proposals" : "Submitted Proposals"}</h3>
          {filteredProposals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProposals.map((proposal) => {
                const sentimentClasses = getSentimentClasses(proposal.id);
                
                return (
                  <Card 
                    key={proposal.id} 
                    className={`overflow-hidden hover:shadow-md transition-shadow ${sentimentClasses.card}`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <Avatar>
                          <AvatarImage src={proposal.freelancer.avatar} alt={proposal.freelancer.name} />
                          <AvatarFallback>
                            {proposal.freelancer.name.substr(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{proposal.freelancer.name}</h3>
                          <div className="flex items-center">
                            <span className="text-xs text-amber-burst mr-1">★</span>
                            <span className="text-xs">{proposal.freelancer.rating}/5</span>
                          </div>
                        </div>
                        <div className="ml-auto font-bold text-indigo-ink">
                          {proposal.bidAmount}
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 line-clamp-4 mb-4">
                        {proposal.text}
                      </p>
                      
                      {sentimentData[proposal.id] && (
                        <div className="flex items-center mt-2 mb-2 text-xs text-gray-600">
                          <div className="flex items-center">
                            <span className="font-semibold mr-1">Clarity:</span>
                            <span>{(sentimentData[proposal.id].clarity * 100).toFixed(0)}%</span>
                          </div>
                          <div className="mx-2">•</div>
                          <div className="flex items-center">
                            <span className="font-semibold mr-1">Enthusiasm:</span>
                            <span>{(sentimentData[proposal.id].enthusiasm * 100).toFixed(0)}%</span>
                            {sentimentClasses.enthusiasmBadge && (
                              <Badge className={sentimentClasses.enthusiasmBadge}>🔥</Badge>
                            )}
                          </div>
                        </div>
                      )}
                      
                      <Button variant="link" className="px-0 text-xs">
                        View Full Proposal
                      </Button>
                    </CardContent>
                    
                    <CardFooter className="bg-gray-50 p-4 flex justify-between">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleAccept(proposal.id)}
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Accept
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleReject(proposal.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No proposals available for this brief yet.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReviewProposals;
