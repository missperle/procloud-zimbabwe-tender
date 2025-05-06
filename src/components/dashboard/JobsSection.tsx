
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ActiveJobsList from "./ActiveJobsList";
import SubmissionsList from "./SubmissionsList";
import CompletedJobsList from "./CompletedJobsList";

const JobsSection = () => {
  return (
    <div className="w-full md:w-2/3">
      <Tabs defaultValue="active_jobs">
        <TabsList className="mb-4">
          <TabsTrigger value="active_jobs">Active Jobs</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
          <TabsTrigger value="past_jobs">Completed Jobs</TabsTrigger>
        </TabsList>

        <TabsContent value="active_jobs">
          <ActiveJobsList />
        </TabsContent>

        <TabsContent value="submissions">
          <SubmissionsList />
        </TabsContent>

        <TabsContent value="past_jobs">
          <CompletedJobsList />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JobsSection;
