
import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Award, XCircle, Clock, Star } from "lucide-react";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { CircularCountdown } from "@/components/ui/circular-countdown";
import { Sparkline } from "@/components/ui/sparkline";

// Sample data (in a real app, this would come from an API)
const featuredTenders = [
  {
    id: 1,
    title: "E-commerce Website Redesign",
    budget: "$2,500",
    description: "Complete UI/UX overhaul for a retail platform",
    deadline: "14",
    deadlineUnit: "hours",
    slug: "ecommerce-redesign",
    isNew: true,
    category: "Web Design",
    heroImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    clientName: "RetailEx Solutions",
    clientLogo: "https://placehold.co/200x200?text=RE",
    completionPercentage: 65,
    proposals: 8,
    maxProposals: 15,
    bidActivity: [4, 7, 3, 5, 8, 9, 6, 8]
  },
  {
    id: 2,
    title: "Corporate Brand Identity",
    budget: "$1,800",
    description: "Full brand identity package for fintech startup",
    deadline: "10",
    deadlineUnit: "hours",
    slug: "brand-identity",
    isNew: false,
    category: "Branding",
    heroImage: "https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    clientName: "FinTech Innovations",
    clientLogo: "https://placehold.co/200x200?text=FI",
    completionPercentage: 40,
    proposals: 5,
    maxProposals: 12,
    bidActivity: [2, 3, 5, 5, 4, 5, 3, 5]
  },
  {
    id: 3,
    title: "Mobile App UI Design",
    budget: "$3,200",
    description: "Design a health tracking mobile application",
    deadline: "21",
    deadlineUnit: "hours",
    slug: "mobile-app-ui",
    isNew: false,
    category: "Mobile Design",
    heroImage: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    clientName: "HealthTech Solutions",
    clientLogo: "https://placehold.co/200x200?text=HT",
    completionPercentage: 75,
    proposals: 12,
    maxProposals: 15,
    bidActivity: [6, 8, 7, 9, 11, 10, 12, 12]
  },
  {
    id: 4,
    title: "Marketing Campaign Assets",
    budget: "$1,500",
    description: "Social media graphics and digital ads",
    deadline: "7",
    deadlineUnit: "hours",
    slug: "marketing-assets",
    isNew: true,
    category: "Graphic Design",
    heroImage: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    clientName: "MarketBoost Agency",
    clientLogo: "https://placehold.co/200x200?text=MB",
    completionPercentage: 30,
    proposals: 4,
    maxProposals: 10,
    bidActivity: [1, 2, 2, 3, 3, 4, 4, 4]
  }
];

const TenderSpotlight = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [focusedId, setFocusedId] = useState<number | null>(null);
  const [activeDot, setActiveDot] = useState<number>(0);
  const [api, setApi] = useState<any>(null);
  const [progress, setProgress] = useState<Record<number, number>>({});
  const heroRefs = useRef<(HTMLImageElement | null)[]>([]);
  
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
  
  // Effect to animate progress bars
  useEffect(() => {
    const newProgress: Record<number, number> = {};
    featuredTenders.forEach(tender => {
      newProgress[tender.id] = 0;
    });
    setProgress(newProgress);
    
    // Animate progress
    const timer = setTimeout(() => {
      const updatedProgress: Record<number, number> = {};
      featuredTenders.forEach(tender => {
        updatedProgress[tender.id] = (tender.proposals / tender.maxProposals) * 100;
      });
      setProgress(updatedProgress);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handle parallax effect on hero images
  const handleMouseMove = (e: React.MouseEvent, index: number) => {
    if (!heroRefs.current[index]) return;
    
    const card = e.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const moveX = (x - centerX) / 20;
    const moveY = (y - centerY) / 20;
    
    const heroImg = heroRefs.current[index];
    if (heroImg) {
      heroImg.style.transform = `translateX(${-moveX}px) translateY(${-moveY}px)`;
    }
  };
  
  const handleMouseLeave = (index: number) => {
    const heroImg = heroRefs.current[index];
    if (heroImg) {
      heroImg.style.transform = 'translateX(0) translateY(0)';
    }
  };
  
  return (
    <section className="py-20 bg-[--bg] text-[--text]">
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
              className="flex items-center gap-1 text-[--text] border-[--text] hover:bg-[--text] hover:text-white"
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
            <CarouselContent className="grid-cards">
              {featuredTenders.map((tender, index) => (
                <CarouselItem key={tender.id} className="md:basis-1/2 lg:basis-1/3 pl-4">
                  <Card 
                    className={`
                      tender-card-3d
                      relative h-full rounded-xl overflow-hidden transition-all duration-500 ease-in-out
                      ${hoveredIndex === index ? 'tender-card-3d-hover' : ''}
                      ${focusedId === tender.id ? 'tender-card-focused' : ''}
                      ${focusedId && focusedId !== tender.id ? 'tender-card-blurred' : ''}
                      cursor-pointer
                    `}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => {
                      setHoveredIndex(null);
                      handleMouseLeave(index);
                    }}
                    onMouseMove={(e) => handleMouseMove(e, index)}
                    onClick={() => setFocusedId(focusedId === tender.id ? null : tender.id)}
                  >
                    {/* Hero image with parallax effect */}
                    <div className="h-32 overflow-hidden relative">
                      <img
                        ref={(el) => (heroRefs.current[index] = el)}
                        src={tender.heroImage}
                        alt={tender.title}
                        className="w-full h-full object-cover transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent"></div>
                      <div className="absolute top-3 right-3">
                        {tender.isNew ? (
                          <Badge className="bg-[rgba(240,90,40,0.1)] text-[--accent] font-medium text-xs uppercase tracking-wider border-none py-1.5">
                            New Bid
                          </Badge>
                        ) : (
                          <Badge className="bg-[rgba(240,90,40,0.1)] text-[--accent] font-medium text-xs uppercase tracking-wider border-none py-1.5">
                            Featured
                          </Badge>
                        )}
                      </div>
                      <div className="absolute bottom-3 left-3">
                        <span className="text-xs uppercase tracking-wider text-white/90 font-medium">
                          {tender.category}
                        </span>
                      </div>
                    </div>
                    
                    {/* Card content */}
                    <CardContent className="p-6 pb-4">
                      {/* Client info with tooltip */}
                      <div className="flex items-center mb-4">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="client-logo mr-2 hover:scale-105 transition-transform cursor-pointer">
                                <img 
                                  src={tender.clientLogo} 
                                  alt={tender.clientName} 
                                  className="w-8 h-8 rounded-full object-cover shadow-sm"
                                />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="bg-white p-3 shadow-lg border-0 rounded-lg w-64">
                              <div className="flex items-center mb-2">
                                <img 
                                  src={tender.clientLogo} 
                                  alt={tender.clientName} 
                                  className="w-10 h-10 rounded-full object-cover mr-3 opacity-90"
                                />
                                <div>
                                  <h4 className="font-semibold text-sm">{tender.clientName}</h4>
                                  <div className="flex items-center mt-0.5">
                                    <Star className="h-3 w-3 text-amber-burst mr-1" />
                                    <span className="text-xs">4.9 (28 projects)</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex justify-between text-xs text-gray-500 mb-2">
                                <span>Average Budget: $2,100</span>
                                <span>Time to Award: 2.3 days</span>
                              </div>
                              <Link to={`/client/${tender.clientName.toLowerCase().replace(/\s+/g, '-')}`} className="text-xs text-indigo-ink font-medium hover:underline block text-right">
                                View All Tenders →
                              </Link>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <span className="text-sm text-gray-600">{tender.clientName}</span>
                      </div>
                      
                      {/* Title & Description */}
                      <h3 className="text-2xl md:text-[28px] font-bold font-montserrat leading-tight mb-2">{tender.title}</h3>
                      <p className="text-procloud-gray-600 mb-4">{tender.description}</p>
                      
                      {/* Budget */}
                      <div className="inline-block px-3 py-1.5 rounded-full bg-[rgba(240,90,40,0.1)] text-[--accent] font-semibold mb-4">
                        {tender.budget}
                      </div>
                      
                      {/* Deadline with circular countdown */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <CircularCountdown 
                            value={parseInt(tender.deadline)} 
                            maxValue={24} 
                            size={44} 
                            strokeWidth={3}
                          />
                          <div className="ml-2">
                            <span className="block text-xs text-gray-500">Ends in</span>
                            <span className="block font-semibold">{tender.deadline} {tender.deadlineUnit}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="block text-xs text-gray-500">Proposals</span>
                          <span className="block font-semibold">{tender.proposals}/{tender.maxProposals}</span>
                        </div>
                      </div>
                      
                      {/* Progress bar */}
                      <div className="mb-6">
                        <Progress 
                          value={progress[tender.id]} 
                          className="h-1.5 bg-gray-100"
                        />
                      </div>
                      
                      {/* Bid activity sparkline */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                          <span>Bid Activity</span>
                          <span>{Math.max(...tender.bidActivity)} max bids/day</span>
                        </div>
                        <Sparkline 
                          data={tender.bidActivity} 
                          height={24} 
                          color="var(--accent)"
                        />
                      </div>
                    </CardContent>
                    
                    <CardFooter className="px-6 pb-6 pt-0">
                      {/* Card footer with button */}
                      <Link to={`/jobs/${tender.slug}`} className="w-full">
                        <Button 
                          className="w-full bg-white text-[--accent] hover:bg-[--accent] hover:text-white transition-colors border-2 border-[--accent] focus:ring-2 focus:ring-[--accent]/25 focus:ring-offset-2"
                        >
                          See Details
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-2 sm:px-4 md:px-8">
              <CarouselPrevious 
                className="carousel-arrow left-0 bg-white text-[--accent] hover:bg-[--accent] hover:text-white border-none shadow-lg focus:ring-2 focus:ring-[--accent]/25" 
              />
              <CarouselNext 
                className="carousel-arrow right-0 bg-white text-[--accent] hover:bg-[--accent] hover:text-white border-none shadow-lg focus:ring-2 focus:ring-[--accent]/25" 
              />
            </div>
          </Carousel>
          
          {/* Pagination dots */}
          <div className="flex justify-center gap-2 mt-6">
            {featuredTenders.map((tender, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-[--accent]/25 ${
                  activeDot === index 
                    ? 'bg-[--accent]' 
                    : 'bg-procloud-gray-400'
                }`}
                onClick={() => api?.scrollTo(index)}
                aria-label={`View ${tender.title} tender`}
              />
            ))}
          </div>

          {/* Best-Value Offers Legend */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-2 text-center">
            <div className="flex items-center gap-1 text-procloud-gray-300 text-sm">
              <Award className="h-5 w-5 text-[--accent]" />
              <span className="font-medium text-[--text]">Best-Value Offers:</span> 
              <span>Freelancers submit their price, and clients choose the most competitive and highest-value proposal.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TenderSpotlight;
