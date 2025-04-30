
import { useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import PortfolioItem from "@/components/freelancers/PortfolioItem";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, MapPin, User } from "lucide-react";

// Mock data
const mockPortfolio = [
  {
    id: "p1",
    title: "Brand Identity for Local Café",
    image: "",
    category: "Branding",
    description: "Complete brand identity for a specialty coffee shop in Harare."
  },
  {
    id: "p2",
    title: "E-commerce Website for Fashion Brand",
    image: "",
    category: "Development",
    description: "Fully functional online store built with React and Node.js."
  },
  {
    id: "p3",
    title: "Social Media Campaign for Tourism",
    image: "",
    category: "Marketing",
    description: "Strategic social media campaign to promote tourism in Zimbabwe."
  },
  {
    id: "p4",
    title: "Corporate Video Production",
    image: "",
    category: "Video",
    description: "Professional company introduction video for a tech startup."
  },
  {
    id: "p5",
    title: "Mobile App UI Design",
    image: "",
    category: "UI/UX",
    description: "Clean, modern user interface design for a fitness tracking app."
  },
  {
    id: "p6",
    title: "Product Photography",
    image: "",
    category: "Photography",
    description: "High-quality product photography for an online jewelry store."
  }
];

const mockReviews = [
  {
    id: "r1",
    clientName: "Victoria M.",
    clientCompany: "Taste of Zim",
    rating: 5,
    date: "March 15, 2025",
    comment: "Tatenda delivered exceptional work for our brand identity project. The logo and brand guidelines exceeded our expectations!"
  },
  {
    id: "r2",
    clientName: "Samuel C.",
    clientCompany: "Tech Solutions",
    rating: 4,
    date: "February 20, 2025",
    comment: "Great communication and quality work. Would definitely hire again for future design projects."
  },
  {
    id: "r3",
    clientName: "Grace N.",
    clientCompany: "Local Boutique",
    rating: 5,
    date: "January 10, 2025",
    comment: "Incredibly talented designer with a keen eye for detail. Delivered the project ahead of schedule."
  }
];

const FreelancerProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);
  
  // In a real app, we would fetch the freelancer data based on the id
  // For now, we'll use static data
  const freelancer = {
    id: "user1",
    name: "Tatenda M.",
    title: "Graphic Designer",
    location: "Harare, Zimbabwe",
    avatar: "",
    verified: true,
    bio: "Experienced graphic designer with over 5 years of professional experience working with local and international clients. Specializing in branding, print design, and digital media. Bachelor's degree in Graphic Design from University of Zimbabwe.",
    rating: 4.8,
    skills: ["Logo Design", "Branding", "UI/UX Design", "Print Design", "Illustration", "Typography"],
    completedJobs: 34,
  };

  const handleOpenModal = (item: any) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };

  return (
    <Layout>
      <div className="bg-procloud-gray-100 py-8 md:py-16">
        <div className="container mx-auto px-4">
          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow-sm border border-procloud-gray-200 mb-8">
            <div className="p-8">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="w-32 h-32 rounded-full bg-procloud-gray-200 overflow-hidden flex-shrink-0">
                  {freelancer.avatar ? (
                    <img 
                      src={freelancer.avatar} 
                      alt={freelancer.name} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-procloud-gray-300 text-procloud-gray-600 text-4xl font-bold">
                      {freelancer.name.charAt(0)}
                    </div>
                  )}
                </div>
                
                <div className="flex-grow">
                  <div className="flex items-center mb-2">
                    <h1 className="text-3xl font-bold mr-2">{freelancer.name}</h1>
                    {freelancer.verified && (
                      <div className="bg-procloud-green rounded-full p-1">
                        <CheckCircle className="h-5 w-5 text-black" />
                      </div>
                    )}
                  </div>
                  
                  <h2 className="text-xl text-procloud-gray-600 mb-2">{freelancer.title}</h2>
                  
                  <div className="flex items-center mb-4">
                    <MapPin className="h-4 w-4 mr-1 text-procloud-gray-500" />
                    <span className="text-sm text-procloud-gray-600">{freelancer.location}</span>
                  </div>
                  
                  <div className="flex items-center mb-4">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < Math.round(freelancer.rating) ? "text-yellow-500" : "text-procloud-gray-300"}>★</span>
                      ))}
                      <span className="ml-1 text-procloud-gray-600">{freelancer.rating.toFixed(1)} ({freelancer.completedJobs} jobs)</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {freelancer.skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="border-procloud-gray-300">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  
                  <Button className="bg-procloud-green hover:bg-procloud-green-dark text-black">
                    Contact Freelancer
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tabs Section */}
          <Tabs defaultValue="portfolio" className="w-full">
            <TabsList className="bg-white border border-procloud-gray-200 rounded-lg w-full justify-start mb-6 p-1">
              <TabsTrigger value="portfolio" className="flex-1">Portfolio</TabsTrigger>
              <TabsTrigger value="about" className="flex-1">About</TabsTrigger>
              <TabsTrigger value="reviews" className="flex-1">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="portfolio" className="mt-0">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockPortfolio.map((item) => (
                  <PortfolioItem 
                    key={item.id} 
                    title={item.title} 
                    image={item.image} 
                    category={item.category} 
                    onClick={() => handleOpenModal(item)}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="about" className="mt-0">
              <div className="bg-white rounded-lg shadow-sm border border-procloud-gray-200 p-6">
                <h3 className="text-xl font-bold mb-4">About Me</h3>
                <div className="space-y-4">
                  <p className="text-procloud-gray-700">{freelancer.bio}</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-0">
              <div className="bg-white rounded-lg shadow-sm border border-procloud-gray-200 p-6">
                <h3 className="text-xl font-bold mb-6">Client Reviews</h3>
                <div className="space-y-6">
                  {mockReviews.map((review) => (
                    <div key={review.id} className="border-b border-procloud-gray-200 pb-6 last:border-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-medium">{review.clientName}</div>
                          <div className="text-sm text-procloud-gray-600">{review.clientCompany}</div>
                        </div>
                        <div className="text-sm text-procloud-gray-600">{review.date}</div>
                      </div>
                      
                      <div className="flex items-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < review.rating ? "text-yellow-500" : "text-procloud-gray-300"}>★</span>
                        ))}
                      </div>
                      
                      <p className="text-procloud-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Portfolio Item Modal */}
      {showModal && selectedItem && (
        <div className="fixed inset-0 bg-procloud-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">{selectedItem.title}</h3>
                <Button variant="ghost" onClick={handleCloseModal} className="h-8 w-8 p-0">
                  ✕
                </Button>
              </div>
              
              <div className="aspect-video bg-procloud-gray-200 mb-4 rounded-md overflow-hidden">
                {selectedItem.image ? (
                  <img 
                    src={selectedItem.image} 
                    alt={selectedItem.title} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-procloud-gray-300 text-procloud-gray-600">
                    No Image Available
                  </div>
                )}
              </div>
              
              <div className="mb-4">
                <Badge className="bg-procloud-green text-black hover:bg-procloud-green-dark">
                  {selectedItem.category}
                </Badge>
              </div>
              
              <div className="text-procloud-gray-700">
                <p>{selectedItem.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default FreelancerProfile;
