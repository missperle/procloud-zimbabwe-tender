
import { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Calendar, DollarSign, File, FileText, Edit } from "lucide-react";

const FreelancerDashboard = () => {
  const { currentUser, loading: authLoading } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [freelancerAlias, setFreelancerAlias] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    const checkUserInfo = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }
      
      try {
        console.log("Fetching user info for:", currentUser.id);
        
        // Get user role and alias
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role, alias')
          .eq('id', currentUser.id)
          .maybeSingle();
        
        if (userError) {
          console.error("Error fetching user role:", userError);
        } else if (userData) {
          console.log("User data retrieved:", userData);
          setUserRole(userData.role);
          setFreelancerAlias(userData.alias);
        }
        
        // Get freelancer profile
        const { data: profileData, error: profileError } = await supabase
          .from('freelancer_profiles')
          .select('*')
          .eq('id', currentUser.id)
          .maybeSingle();
          
        if (profileError && profileError.code !== "PGRST116") {
          console.error("Error fetching freelancer profile:", profileError);
        } else if (profileData) {
          console.log("Profile data retrieved:", profileData);
          setProfileData(profileData);
        }
      } catch (error) {
        console.error("Error in checkUserInfo:", error);
      } finally {
        setLoading(false);
      }
    };
    
    checkUserInfo();
  }, [currentUser]);

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-64 mb-6" />
          <div className="grid gap-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </Layout>
    );
  }
  
  // Redirect if not logged in or not a freelancer
  if (!currentUser) {
    console.log("No current user, redirecting to login");
    return <Navigate to="/login" replace />;
  }
  
  if (userRole !== "freelancer" && userRole !== null) {
    console.log("User is not a freelancer, redirecting to appropriate dashboard");
    return <Navigate to={userRole === "client" ? "/client-dashboard" : "/login"} replace />;
  }

  const profileCompletion = profileData ? calculateProfileCompletion(profileData) : 0;
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">Freelancer Dashboard</h1>
            {freelancerAlias && (
              <p className="text-gray-500">Your alias: {freelancerAlias}</p>
            )}
          </div>
          
          <Link to="/freelancer-profile-edit">
            <Button className="mt-4 md:mt-0">
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </Link>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="proposals">Proposals</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-3">
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Profile Completion</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center mb-2">
                      <div className="h-2 flex-1 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-procloud-green rounded-full" 
                          style={{ width: `${profileCompletion}%` }}
                        ></div>
                      </div>
                      <span className="ml-4 font-medium">{profileCompletion}%</span>
                    </div>
                    
                    {profileCompletion < 100 && (
                      <Link to="/freelancer-profile-edit">
                        <Button variant="outline" size="sm" className="mt-2">
                          Complete Your Profile
                        </Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500">
                        Active Projects
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center">
                        <Calendar className="h-6 w-6 text-procloud-green mr-2" />
                        <span className="text-2xl font-bold">0</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500">
                        Pending Proposals
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center">
                        <FileText className="h-6 w-6 text-amber-500 mr-2" />
                        <span className="text-2xl font-bold">0</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500">
                        Total Earnings
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center">
                        <DollarSign className="h-6 w-6 text-green-500 mr-2" />
                        <span className="text-2xl font-bold">$0</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Links</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Link to="/jobs">
                        <Button variant="outline" className="w-full justify-start">
                          <File className="mr-2 h-4 w-4" />
                          Browse Jobs
                        </Button>
                      </Link>
                      <Link to="/freelancer-profile-edit">
                        <Button variant="outline" className="w-full justify-start">
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Profile
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div className="mt-6">
              <h2 className="text-xl font-bold mb-4">Getting Started</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center mb-4">
                      <div className="bg-procloud-green rounded-full p-2 mr-4">
                        <CheckCircle className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-medium">Create Your Profile</h3>
                    </div>
                    <p className="text-sm text-gray-500">
                      Complete your professional profile to attract clients.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center mb-4">
                      <div className="bg-gray-200 rounded-full p-2 mr-4">
                        <FileText className="h-6 w-6 text-gray-600" />
                      </div>
                      <h3 className="font-medium">Submit Proposals</h3>
                    </div>
                    <p className="text-sm text-gray-500">
                      Browse jobs and submit proposals to clients.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center mb-4">
                      <div className="bg-gray-200 rounded-full p-2 mr-4">
                        <DollarSign className="h-6 w-6 text-gray-600" />
                      </div>
                      <h3 className="font-medium">Get Paid</h3>
                    </div>
                    <p className="text-sm text-gray-500">
                      Complete projects and receive payment.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="projects">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold mb-2">No Active Projects</h3>
                  <p className="text-gray-500 mb-6">
                    You don't have any active projects yet. Browse available jobs and submit proposals to get started.
                  </p>
                  <Link to="/jobs">
                    <Button>Browse Jobs</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="proposals">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold mb-2">No Proposals Submitted</h3>
                  <p className="text-gray-500 mb-6">
                    You haven't submitted any proposals yet. Find jobs that match your skills and start submitting proposals.
                  </p>
                  <Link to="/jobs">
                    <Button>Find Jobs</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="earnings">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold mb-2">No Earnings Yet</h3>
                  <p className="text-gray-500 mb-6">
                    Complete projects to start earning money. Your earnings and payment history will appear here.
                  </p>
                  <Link to="/jobs">
                    <Button>Find Jobs</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="profile">
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold">Your Freelancer Profile</h3>
                  <Link to="/freelancer-profile-edit">
                    <Button>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Button>
                  </Link>
                </div>
                
                {profileData ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-500 mb-1">Professional Title</h4>
                        <p>{profileData.title || "Not specified"}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-500 mb-1">Location</h4>
                        <p>{profileData.location || "Not specified"}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-500 mb-1">Bio</h4>
                      <p>{profileData.bio || "No bio provided yet."}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-500 mb-1">Hourly Rate</h4>
                        <p>{profileData.hourly_rate ? `$${profileData.hourly_rate}/hr` : "Not specified"}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-500 mb-1">Years of Experience</h4>
                        <p>{profileData.years_experience || "Not specified"}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-500 mb-1">Education</h4>
                      <p>{profileData.education || "Not specified"}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">You haven't completed your profile yet.</p>
                    <Link to="/freelancer-profile-edit">
                      <Button>Complete Your Profile</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="documents">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-4">My Documents</h3>
                <p className="text-gray-500 mb-6">This is where you can view and manage your uploaded documents.</p>
                
                <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                  <p className="text-gray-500 mb-4">No documents uploaded yet.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

// Helper function to calculate profile completion percentage
const calculateProfileCompletion = (profile: any): number => {
  const fields = [
    { name: 'title', weight: 15 },
    { name: 'bio', weight: 15 },
    { name: 'location', weight: 10 },
    { name: 'hourly_rate', weight: 10 },
    { name: 'years_experience', weight: 10 },
    { name: 'education', weight: 10 },
    { name: 'profile_image_url', weight: 10 },
  ];
  
  // Calculate completed fields weight sum
  const completedWeight = fields.reduce((sum, field) => {
    return sum + (profile[field.name] ? field.weight : 0);
  }, 0);
  
  // 30% is awarded for just having an account, remaining 70% from completing fields
  return Math.min(30 + completedWeight, 100);
};

export default FreelancerDashboard;
