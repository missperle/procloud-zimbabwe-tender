
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, FileText, DollarSign } from "lucide-react";

interface GettingStartedProps {
  profileCompletion: number;
}

const GettingStarted = ({ profileCompletion }: GettingStartedProps) => {
  return (
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
  );
};

export default GettingStarted;
