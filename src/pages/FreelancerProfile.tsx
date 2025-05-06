
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import PortfolioItem from "@/components/freelancers/PortfolioItem";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, MapPin, User, Edit, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// Portfolio item type
interface PortfolioItem {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  image_url: string | null;
  project_url: string | null;
}

// Freelancer profile type
interface FreelancerProfileData {
  id: string;
  name: string;
  title: string | null;
  location: string | null;
  avatar: string | null;
  verified: boolean | null;
  bio: string | null;
  rating: number;
  skills: string[];
  completedJobs: number;
  email: string | null;
  isCurrentUser: boolean;
}

// Review type
interface Review {
  id: string;
  clientName: string;
  clientCompany: string;
  rating: number;
  date: string;
  comment: string;
}

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
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [freelancer, setFreelancer] = useState<FreelancerProfileData | null>(null);
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch freelancer profile and portfolio items
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!id) return;
      
      setIsLoading(true);
      
      try {
        // Fetch freelancer profile
        const { data: profileData, error: profileError } = await supabase
          .from("freelancer_profiles")
          .select(`
            id,
            title,
            bio,
            location,
            verified,
            profile_image_url,
            hourly_rate,
            years_experience
          `)
          .eq("id", id)
          .single();
          
        if (profileError) throw profileError;
        
        // Fetch user data
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("email, full_name, alias")
          .eq("id", id)
          .single();
          
        if (userError) throw userError;
        
        // Fetch portfolio items
        const { data: portfolioData, error: portfolioError } = await supabase
          .from("portfolio_items")
          .select("*")
          .eq("freelancer_id", id);
          
        if (portfolioError) throw portfolioError;
        
        // Set freelancer data
        setFreelancer({
          id: profileData.id,
          name: userData.full_name || userData.alias || userData.email?.split("@")[0] || "Anonymous",
          title: profileData.title,
          location: profileData.location,
          avatar: profileData.profile_image_url,
          verified: profileData.verified,
          bio: profileData.bio,
          rating: 4.8, // Placeholder
          skills: ["Logo Design", "Branding", "UI/UX Design", "Print Design"], // Placeholder
          completedJobs: 34, // Placeholder
          email: userData.email,
          isCurrentUser: currentUser?.id === id
        });
        
        // Set portfolio items
        setPortfolioItems(portfolioData || []);
      } catch (error) {
        console.error("Error fetching freelancer data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfileData();
  }, [id, currentUser]);

  const handleOpenModal = (item: PortfolioItem) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };

  const handleEditProfile = () => {
    navigate("/edit-profile");
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-accent" />
        </div>
      </Layout>
    );
  }

  if (!freelancer) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold">Freelancer not found</h2>
            <p className="mt-2 text-gray-600">The freelancer profile you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate("/freelancers")} className="mt-6">
              Browse Freelancers
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

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
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <h1 className="text-3xl font-bold mr-2">{freelancer.name}</h1>
                      {freelancer.verified && (
                        <div className="bg-procloud-green rounded-full p-1">
                          <CheckCircle className="h-5 w-5 text-black" />
                        </div>
                      )}
                    </div>
                    
                    {freelancer.isCurrentUser && (
                      <Button 
                        variant="outline" 
                        className="flex items-center gap-2"
                        onClick={handleEditProfile}
                      >
                        <Edit className="h-4 w-4" />
                        Edit Profile
                      </Button>
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
                  
                  {!freelancer.isCurrentUser && (
                    <Button className="bg-procloud-green hover:bg-procloud-green-dark text-black">
                      Contact Freelancer
                    </Button>
                  )}
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
              {portfolioItems.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {portfolioItems.map((item) => (
                    <PortfolioItem 
                      key={item.id} 
                      title={item.title} 
                      image={item.image_url || ""} 
                      category={item.category || "Other"} 
                      onClick={() => handleOpenModal(item)}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm border border-procloud-gray-200 p-8 text-center">
                  <h3 className="text-xl font-bold mb-2">No portfolio items yet</h3>
                  <p className="text-procloud-gray-600 mb-6">
                    {freelancer.isCurrentUser 
                      ? "Add some projects to your portfolio to showcase your work to potential clients."
                      : "This freelancer hasn't added any portfolio items yet."}
                  </p>
                  
                  {freelancer.isCurrentUser && (
                    <Button onClick={handleEditProfile}>
                      Add Portfolio Items
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="about" className="mt-0">
              <div className="bg-white rounded-lg shadow-sm border border-procloud-gray-200 p-6">
                <h3 className="text-xl font-bold mb-4">About Me</h3>
                <div className="space-y-4">
                  {freelancer.bio ? (
                    <p className="text-procloud-gray-700">{freelancer.bio}</p>
                  ) : (
                    <p className="text-procloud-gray-500 italic">
                      {freelancer.isCurrentUser 
                        ? "You haven't added a bio yet. Edit your profile to add one."
                        : "This freelancer hasn't added a bio yet."}
                    </p>
                  )}
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
                {selectedItem.image_url ? (
                  selectedItem.image_url.includes(".mp4") || selectedItem.image_url.includes(".webm") ? (
                    <video 
                      src={selectedItem.image_url} 
                      className="w-full h-full object-cover" 
                      controls
                    />
                  ) : (
                    <img 
                      src={selectedItem.image_url} 
                      alt={selectedItem.title} 
                      className="w-full h-full object-cover" 
                    />
                  )
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-procloud-gray-300 text-procloud-gray-600">
                    No Image Available
                  </div>
                )}
              </div>
              
              <div className="mb-4">
                {selectedItem.category && (
                  <Badge className="bg-procloud-green text-black hover:bg-procloud-green-dark">
                    {selectedItem.category}
                  </Badge>
                )}
              </div>
              
              <div className="text-procloud-gray-700">
                <p>{selectedItem.description || "No description available."}</p>
              </div>
              
              {selectedItem.project_url && (
                <div className="mt-4">
                  <a 
                    href={selectedItem.project_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    View Project
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default FreelancerProfile;
