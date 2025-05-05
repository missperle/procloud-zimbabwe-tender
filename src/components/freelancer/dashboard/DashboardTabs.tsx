
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import ProfileCompletion from "./ProfileCompletion";
import StatsCards from "./StatsCards";
import QuickLinks from "./QuickLinks";
import GettingStarted from "./GettingStarted";
import ProfileView from "./ProfileView";
import EmptyState from "./EmptyState";

interface DashboardTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  profileCompletion: number;
  profileData: any;
}

const DashboardTabs = ({ 
  activeTab, 
  setActiveTab, 
  profileCompletion,
  profileData 
}: DashboardTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-3 mb-8">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="proposals">Proposals</TabsTrigger>
        <TabsTrigger value="earnings">Earnings</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Profile completion card */}
          <ProfileCompletion 
            profileCompletion={profileCompletion} 
          />
          
          {/* Quick links card */}
          <QuickLinks />
          
          {/* Stats cards: jobs, earnings, etc. */}
          <StatsCards />
        </div>
        
        <div className="mt-6">
          {!profileData || profileCompletion < 50 ? (
            <GettingStarted profileCompletion={profileCompletion} />
          ) : (
            <Card className="mt-6">
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-4">Your Active Proposals</h3>
                
                <EmptyState 
                  title="No Active Proposals" 
                  description="You don't have any active proposals yet. Browse available jobs and submit your first proposal."
                  actionText="Browse Jobs"
                  actionLink="/jobs"
                />
              </CardContent>
            </Card>
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="proposals">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-4">Your Proposals</h3>
            
            <EmptyState 
              title="No Proposals Yet" 
              description="You haven't submitted any proposals yet. Browse available jobs and start submitting proposals."
              actionText="Browse Jobs"
              actionLink="/jobs"
            />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="earnings">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-4">Your Earnings</h3>
            
            <EmptyState 
              title="No Earnings Yet" 
              description="You haven't earned any money yet. Complete jobs to see your earnings here."
              actionText="Browse Jobs"
              actionLink="/jobs"
            />
          </CardContent>
        </Card>
      </TabsContent>
      
      {profileData && (
        <TabsContent value="profile">
          <ProfileView profileData={profileData} />
        </TabsContent>
      )}
    </Tabs>
  );
};

export default DashboardTabs;
