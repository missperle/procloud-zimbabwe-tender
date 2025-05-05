
import React from "react";
import { toast } from "@/hooks/use-toast";
import ProtectedCreatorCard from "./ProtectedCreatorCard";

type FreelancerRecommendation = {
  id: string;
  name: string;
  avatar?: string;
  skills: string[];
  rating: number;
};

interface RecommendedFreelancersProps {
  recommendations: FreelancerRecommendation[];
}

const RecommendedFreelancers = ({ recommendations }: RecommendedFreelancersProps) => {
  if (recommendations.length === 0) {
    // Show mock data if no real recommendations are available
    recommendations = [
      {
        id: "rec1",
        name: "Design Expert",
        skills: ["Logo Design", "Branding", "Illustrator"],
        rating: 4.9
      },
      {
        id: "rec2",
        name: "Creative Studio",
        skills: ["Visual Identity", "Logo Design", "Adobe Creative Suite"],
        rating: 4.8
      },
      {
        id: "rec3",
        name: "Brand Architect",
        skills: ["Brand Strategy", "Logo Design", "Typography"],
        rating: 4.7
      }
    ];
  }

  const handleRequestCreator = (creatorId: string) => {
    toast({
      title: "Creator requested",
      description: "Proverb Digital has been notified of your request and will facilitate the introduction.",
    });
  };

  const handleMessageCreator = (creatorId: string) => {
    toast({
      title: "Message sent",
      description: "Your message will be forwarded to the creator via Proverb Digital.",
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recommendations.map((freelancer) => (
        <ProtectedCreatorCard
          key={freelancer.id}
          creator={{
            id: freelancer.id,
            alias: freelancer.name,
            rating: freelancer.rating,
            skills: freelancer.skills,
            successRate: 95, // Mock data
            projectsCompleted: 35, // Mock data
            verified: true // Mock data
          }}
          recommended={true}
          onRequestCreator={handleRequestCreator}
          onMessageCreator={handleMessageCreator}
        />
      ))}
    </div>
  );
};

export default RecommendedFreelancers;
