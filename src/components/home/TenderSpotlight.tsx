
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Award, XCircle } from "lucide-react";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";

// Sample data (in a real app, this would come from an API)
const featuredTenders = [
  {
    id: 1,
    title: "E-commerce Website Redesign",
    budget: "$2,500",
    description: "Complete UI/UX overhaul for a retail platform",
    deadline: "14h 23m",
    slug: "ecommerce-redesign",
    isNew: true
  },
  {
    id: 2,
    title: "Corporate Brand Identity",
    budget: "$1,800",
    description: "Full brand identity package for fintech startup",
    deadline: "10h 45m",
    slug: "brand-identity",
    isNew: false
  },
  {
    id: 3,
    title: "Mobile App UI Design",
    budget: "$3,200",
    description: "Design a health tracking mobile application",
    deadline: "21h 12m",
    slug: "mobile-app-ui",
    isNew: false
  },
  {
    id: 4,
    title: "Marketing Campaign Assets",
    budget: "$1,500",
    description: "Social media graphics and digital ads",
    deadline: "7h 30m",
    slug: "marketing-assets",
    isNew: true
  }
];

const TenderSpotlight = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [focusedId, setFocusedId] = useState<number | null>(null);
  const [activeDot, setActiveDot] = useState<number>(0);
  const [api, setApi] = useState<any>(null);
  
  // Effect to update the active dot based on carousel position
  useEffect(() => {
    if (!api) return;
    
    const handleSelect = () => {
      setActiveDot(api.selectedScrollSnap());
    };
    
    api.on("select", handleSelect);
    api.on("reInit", handleSelect);
    
    return () => {
      api.off("select", handleSelect);
      api.off("reInit", handleSelect);
    };
  }, [api]);
  
  return (
    <section className="py-20 bg-procloud-black text-white">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 className="mb-4">Tender Spotlight</h2>
          <p className="text-lg text-procloud-gray-300 max-w-2xl mx-auto">
            Featured opportunities with our unique best-value selection model
          </p>
        </div>
        
        {/* Clear Focus Button */}
        {focusedId && (
          <div className="flex justify-center mb-4">
            <Button 
              onClick={() => setFocusedId(null)} 
              variant="outline"
              className="flex items-center gap-1 text-white border-white hover:bg-white hover:text-black"
            >
              <XCircle className="h-4 w-4" />
              Show All Tenders
            </Button>
          </div>
        )}
        
        <div className="mt-12 carousel-3d-container">
          <Carousel 
            opts={{
              align: "center",
              loop: true,
            }}
            setApi={setApi}
            className="w-full"
          >
            <CarouselContent>
              {featuredTenders.map((tender, index) => (
                <CarouselItem key={tender.id} className="md:basis-1/3 lg:basis-1/3 pl-4">
                  <div 
                    className={`
                      tender-card-3d
                      relative h-full rounded-xl overflow-hidden
                      transition-all duration-500 ease-in-out
                      ${hoveredIndex === index ? 'tender-card-3d-hover' : ''}
                      ${focusedId === tender.id ? 'tender-card-focused' : ''}
                      ${focusedId && focusedId !== tender.id ? 'tender-card-blurred' : ''}
                      cursor-pointer
                    `}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onClick={() => setFocusedId(focusedId === tender.id ? null : tender.id)}
                  >
                    {/* Card content */}
                    <div className="p-8 pb-6 bg-white text-procloud-black rounded-xl h-full flex flex-col">
                      {/* Status badges */}
                      <div className="absolute top-3 right-3 z-10">
                        {tender.isNew ? (
                          <Badge variant="default" className="bg-[#FF6F61] animate-pulse">New Bid</Badge>
                        ) : (
                          <Badge variant="default" className="bg-amber-burst text-black">Competitive Offer</Badge>
                        )}
                      </div>
                      
                      {/* Large budget callout */}
                      <div className="mb-6 text-center">
                        <div className="text-5xl font-bold text-indigo-ink">{tender.budget}</div>
                        <div className="text-sm text-procloud-gray-600 flex items-center justify-center gap-1 mt-1">
                          <Award className="h-4 w-4 text-amber-burst" />
                          <span>Best-Value Offer</span>
                        </div>
                      </div>
                      
                      <div className="border-t border-b border-procloud-gray-200 py-4">
                        <h3 className="text-xl font-montserrat font-bold mb-2">{tender.title}</h3>
                        <p className="text-procloud-gray-600 mb-4">{tender.description}</p>
                      </div>
                      
                      <div className="mt-auto">
                        <div className="text-sm text-center my-4">
                          <span className="font-medium">Ends in:</span> <span className="text-indigo-ink font-bold">{tender.deadline}</span>
                        </div>
                        
                        {/* Card footer with button */}
                        <Link to={`/jobs/${tender.slug}`}>
                          <Button 
                            className="w-full bg-procloud-black text-white hover:bg-white hover:text-black transition-colors border border-procloud-black"
                          >
                            See Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-2 sm:px-4 md:px-8">
              <CarouselPrevious 
                className="carousel-arrow left-0 bg-indigo-ink text-white hover:bg-amber-burst hover:text-black border-none shadow-lg" 
              />
              <CarouselNext 
                className="carousel-arrow right-0 bg-indigo-ink text-white hover:bg-amber-burst hover:text-black border-none shadow-lg" 
              />
            </div>
          </Carousel>
          
          {/* Pagination dots */}
          <div className="flex justify-center gap-2 mt-6">
            {featuredTenders.map((tender, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all ${
                  activeDot === index 
                    ? 'bg-amber-burst' 
                    : 'bg-procloud-gray-400'
                }`}
                onClick={() => api?.scrollTo(index)}
              />
            ))}
          </div>

          {/* Best-Value Offers Legend */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-2 text-center">
            <div className="flex items-center gap-1 text-procloud-gray-300 text-sm">
              <Award className="h-5 w-5 text-amber-burst" />
              <span className="font-medium text-white">Best-Value Offers:</span> 
              <span>Freelancers submit their price, and clients choose the most competitive and highest-value proposal.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TenderSpotlight;
