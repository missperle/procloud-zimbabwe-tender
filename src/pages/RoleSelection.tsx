
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Users } from "lucide-react";

const RoleSelection = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<"client" | "freelancer" | null>(null);

  const handleSelection = (role: "client" | "freelancer") => {
    setSelectedRole(role);
    navigate(`/auth?role=${role}`);
  };

  return (
    <Layout>
      <div className="container mx-auto py-12 flex flex-col items-center">
        <div className="max-w-4xl w-full text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">Join Proverb Digital Cloud Agency</h1>
          <p className="text-gray-600 text-lg mb-6">
            Select how you would like to use our platform
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <Card 
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedRole === "client" ? "border-2 border-indigo-ink" : ""
              }`}
              onClick={() => handleSelection("client")}
            >
              <CardHeader className="text-center">
                <CardTitle className="flex justify-center">
                  <Briefcase className="h-12 w-12 text-indigo-ink mb-2" />
                </CardTitle>
                <CardTitle>I need to hire talent</CardTitle>
                <CardDescription>Join as a Client</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  Post jobs, find top freelancers, and manage your projects in one place.
                </p>
                <Button 
                  className="w-full"
                  onClick={() => handleSelection("client")}
                >
                  Continue as Client
                </Button>
              </CardContent>
            </Card>
            
            <Card 
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedRole === "freelancer" ? "border-2 border-indigo-ink" : ""
              }`}
              onClick={() => handleSelection("freelancer")}
            >
              <CardHeader className="text-center">
                <CardTitle className="flex justify-center">
                  <Users className="h-12 w-12 text-indigo-ink mb-2" />
                </CardTitle>
                <CardTitle>I want to find work</CardTitle>
                <CardDescription>Join as a Freelancer</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  Find jobs, showcase your skills, and get paid for your work.
                </p>
                <Button 
                  className="w-full"
                  onClick={() => handleSelection("freelancer")}
                >
                  Continue as Freelancer
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RoleSelection;
