
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, MessageSquare, Award, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

interface OnboardingGuideProps {
  onClose: () => void;
}

const OnboardingGuide: React.FC<OnboardingGuideProps> = ({ onClose }) => {
  const { toast } = useToast();

  const steps = [
    {
      title: "Create your brief",
      icon: <Clock className="h-5 w-5 text-blue-600" />,
      description: "Define your project requirements. Proverb Digital will review to ensure clarity and effectiveness.",
    },
    {
      title: "Review proposals",
      icon: <Award className="h-5 w-5 text-indigo-600" />,
      description: "Evaluate anonymous creator proposals. Proverb Digital highlights the best matches for your needs.",
    },
    {
      title: "Communicate safely",
      icon: <MessageSquare className="h-5 w-5 text-green-600" />,
      description: "Interact with creators through our platform. Your identity remains protected until you're ready.",
    },
    {
      title: "Work with confidence",
      icon: <Shield className="h-5 w-5 text-purple-600" />,
      description: "Proverb Digital handles contracts, payments, and delivery milestones for a smooth working relationship.",
    },
  ];

  const handleStarted = () => {
    toast({
      title: "Welcome to Proverb Digital!",
      description: "You're all set to start creating briefs and finding the perfect creative talent.",
    });
    onClose();
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-2xl">Welcome to Proverb Digital</CardTitle>
        <p className="text-gray-500 mt-2">
          Your creative talent matchmaker with built-in identity protection
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
          {steps.map((step, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex-shrink-0 bg-gray-100 p-3 rounded-full h-12 w-12 flex items-center justify-center">
                {step.icon}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{step.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <Separator className="my-4" />
        
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h3 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Our Identity Protection Promise
          </h3>
          <p className="text-sm text-blue-700">
            Proverb Digital acts as an intermediary between clients and creators. Both parties remain anonymous until a mutual agreement is reached. This eliminates biases and ensures decisions are based on skills and quality, not personal connections.
          </p>
        </div>
        
        <div className="pt-4 flex justify-end">
          <Button onClick={handleStarted}>
            I'm Ready to Get Started
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OnboardingGuide;
