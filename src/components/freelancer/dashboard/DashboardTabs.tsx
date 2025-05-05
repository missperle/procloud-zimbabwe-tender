
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import StatsCards from "./StatsCards";
import ProfileCompletion from "./ProfileCompletion";
import QuickLinks from "./QuickLinks";
import GettingStarted from "./GettingStarted";
import EmptyState from "./EmptyState";
import ProfileView from "./ProfileView";

interface DashboardTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  profileCompletion: number;
  profileData: any | null;
}

const DashboardTabs = ({
  activeTab,
  setActiveTab,
  profileCompletion,
  profileData
}: DashboardTabsProps) => {
  return (
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
            <ProfileCompletion profileCompletion={profileCompletion} />
            <StatsCards />
          </div>
          
          <div>
            <QuickLinks />
          </div>
        </div>
        
        <GettingStarted />
      </TabsContent>
      
      <TabsContent value="projects">
        <EmptyState 
          title="No Active Projects" 
          description="You don't have any active projects yet. Browse available jobs and submit proposals to get started."
          actionText="Browse Jobs"
          actionLink="/jobs"
        />
      </TabsContent>
      
      <TabsContent value="proposals">
        <EmptyState 
          title="No Proposals Submitted" 
          description="You haven't submitted any proposals yet. Find jobs that match your skills and start submitting proposals."
          actionText="Find Jobs"
          actionLink="/jobs"
        />
      </TabsContent>
      
      <TabsContent value="earnings">
        <EmptyState 
          title="No Earnings Yet" 
          description="Complete projects to start earning money. Your earnings and payment history will appear here."
          actionText="Find Jobs"
          actionLink="/jobs"
        />
      </TabsContent>
      
      <TabsContent value="profile">
        <ProfileView profileData={profileData} />
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
  );
};

export default DashboardTabs;
