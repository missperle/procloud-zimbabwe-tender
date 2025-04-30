
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Sample data (in a real app, this would come from an API)
const featuredTenders = [
  {
    id: 1,
    title: "E-commerce Website Redesign",
    budget: "$2,500",
    description: "Complete UI/UX overhaul for a retail platform",
    deadline: "14 days",
    slug: "ecommerce-redesign"
  },
  {
    id: 2,
    title: "Corporate Brand Identity",
    budget: "$1,800",
    description: "Full brand identity package for fintech startup",
    deadline: "10 days",
    slug: "brand-identity"
  },
  {
    id: 3,
    title: "Mobile App UI Design",
    budget: "$3,200",
    description: "Design a health tracking mobile application",
    deadline: "21 days",
    slug: "mobile-app-ui"
  },
  {
    id: 4,
    title: "Marketing Campaign Assets",
    budget: "$1,500",
    description: "Social media graphics and digital ads",
    deadline: "7 days",
    slug: "marketing-assets"
  }
];

const TenderSpotlight = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  return (
    <section className="py-20 bg-procloud-black text-white">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 className="mb-4">Tender Spotlight</h2>
          <p className="text-lg text-procloud-gray-300 max-w-2xl mx-auto">
            Featured opportunities with substantial budgets and clear briefs
          </p>
        </div>
        
        <div className="mt-12">
          <Carousel 
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {featuredTenders.map((tender, index) => (
                <CarouselItem key={tender.id} className="md:basis-1/2 lg:basis-1/3 pl-6">
                  <div 
                    className={`
                      tender-card featured relative h-full bg-white text-procloud-black rounded-lg overflow-hidden shadow-card
                      transition-transform duration-300 ${hoveredIndex === index ? 'scale-[1.02]' : ''}
                    `}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    {/* Featured ribbon */}
                    <div className="absolute top-6 -right-12 rotate-45 z-10">
                      <div className="bg-[#FF6F61] text-black font-medium px-12 py-1">
                        Featured Tender
                      </div>
                    </div>
                    
                    {/* Card content */}
                    <div className="p-6 pb-4">
                      {/* Large budget callout */}
                      <div className="mb-4 text-center">
                        <div className="text-4xl font-bold text-procloud-green">{tender.budget}</div>
                        <div className="text-sm text-procloud-gray-600">Budget</div>
                      </div>
                      
                      <div className="border-t border-procloud-gray-200 pt-4 mt-4">
                        <h3 className="text-xl mb-2">{tender.title}</h3>
                        <p className="text-procloud-gray-600 mb-2">{tender.description}</p>
                        <div className="text-sm mb-4">
                          <span className="font-medium">Deadline:</span> {tender.deadline}
                        </div>
                      </div>
                    </div>
                    
                    {/* Card footer with button */}
                    <div className="p-6 pt-0">
                      <Link to={`/jobs/${tender.slug}`}>
                        <Button 
                          className="w-full bg-procloud-black text-white hover:bg-[#FF6F61] hover:text-white transition-colors"
                        >
                          See Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center gap-4 mt-6">
              <CarouselPrevious className="relative static" />
              <CarouselNext className="relative static" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default TenderSpotlight;
