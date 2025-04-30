
import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, X } from "lucide-react";

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
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "all") {
      setFilteredProposals(mockProposals);
    } else {
      setFilteredProposals(mockProposals.filter(p => p.briefId === value));
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
          {filteredProposals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProposals.map((proposal) => (
                <Card key={proposal.id} className="overflow-hidden hover:shadow-md transition-shadow">
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
              ))}
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
