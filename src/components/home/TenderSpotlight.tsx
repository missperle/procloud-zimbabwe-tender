
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Search, XCircle, Award, Grid3x3, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Sample data (in a real app, this would come from an API)
const featuredTenders = [
  {
    id: 1,
    title: "E-commerce Website Redesign",
    budget: "$2,500",
    description: "Complete UI/UX overhaul for a retail platform",
    deadline: "14h 23m",
    slug: "ecommerce-redesign",
    isNew: true,
    image: "photo-1488590528505-98d2b5aba04b"
  },
  {
    id: 2,
    title: "Corporate Brand Identity",
    budget: "$1,800",
    description: "Full brand identity package for fintech startup",
    deadline: "10h 45m",
    slug: "brand-identity",
    isNew: false,
    image: "photo-1461749280684-dccba630e2f6"
  },
  {
    id: 3,
    title: "Mobile App UI Design",
    budget: "$3,200",
    description: "Design a health tracking mobile application",
    deadline: "21h 12m",
    slug: "mobile-app-ui",
    isNew: false,
    image: "photo-1486312338219-ce68d2c6f44d"
  },
  {
    id: 4,
    title: "Marketing Campaign Assets",
    budget: "$1,500",
    description: "Social media graphics and digital ads",
    deadline: "7h 30m",
    slug: "marketing-assets",
    isNew: true,
    image: "photo-1581091226825-a6a2a5aee158"
  },
  {
    id: 5,
    title: "Product Landing Page",
    budget: "$2,200",
    description: "High-converting landing page for new product launch",
    deadline: "16h 10m",
    slug: "product-landing",
    isNew: false,
    image: "photo-1531297484001-80022131f5a1"
  },
  {
    id: 6,
    title: "Website Backend Development",
    budget: "$4,500",
    description: "Full backend implementation with API development",
    deadline: "36h 15m",
    slug: "backend-dev",
    isNew: true,
    image: "photo-1487058792275-0ad4aaf24ca7"
  },
  {
    id: 7,
    title: "Video Editing Project",
    budget: "$1,800",
    description: "Professional video editing for marketing campaign",
    deadline: "24h 00m",
    slug: "video-editing",
    isNew: false,
    image: "photo-1605810230434-7631ac76ec81"
  },
  {
    id: 8,
    title: "Full-Stack Web App",
    budget: "$5,000",
    description: "Complete development of a web application",
    deadline: "48h 30m",
    slug: "full-stack-app",
    isNew: true,
    image: "photo-1498050108023-c5249f4df085"
  },
  {
    id: 9,
    title: "Content Writing Package",
    budget: "$1,200",
    description: "Website copy and blog articles for new startup",
    deadline: "20h 45m",
    slug: "content-writing",
    isNew: false,
    image: "photo-1488590528505-98d2b5aba04b" 
  }
];

// Filter categories
const categories = ["All", "Design", "Development", "Branding", "Marketing", "Content", "UI/UX"];

const TenderSpotlight = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedTender, setSelectedTender] = useState<typeof featuredTenders[0] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  
  // Handle filter change
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };
  
  // Handle tender card click
  const handleTenderClick = (tender: typeof featuredTenders[0]) => {
    setSelectedTender(tender);
  };
  
  // Filter tenders by active category
  const filteredTenders = activeFilter === "All" 
    ? featuredTenders 
    : featuredTenders.filter(tender => tender.title.toLowerCase().includes(activeFilter.toLowerCase()));
  
  // Pagination logic
  const totalPages = Math.ceil(filteredTenders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTenders = filteredTenders.slice(startIndex, endIndex);
  
  return (
    <section className="py-20 bg-procloud-black text-white">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 className="mb-4">Tender Spotlight</h2>
          <p className="text-lg text-procloud-gray-300 max-w-2xl mx-auto">
            Featured opportunities with our unique best-value selection model
          </p>
        </div>
        
        {/* Filter tabs/chips */}
        <div className="mb-10 overflow-x-auto hide-scrollbar">
          <div className="flex justify-center gap-4 min-w-max pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleFilterChange(category)}
                className={`px-4 py-2 text-sm font-medium transition-all relative ${
                  activeFilter === category 
                    ? 'text-white' 
                    : 'text-procloud-gray-300 hover:text-white'
                }`}
              >
                {category}
                {activeFilter === category && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-ink"></div>
                )}
              </button>
            ))}
          </div>
        </div>
        
        {/* Instagram-style grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
          {currentTenders.map((tender) => (
            <div 
              key={tender.id}
              className="aspect-square relative overflow-hidden rounded-md cursor-pointer group"
              onClick={() => handleTenderClick(tender)}
            >
              {/* Thumbnail image */}
              <img 
                src={`https://source.unsplash.com/${tender.image}`} 
                alt={tender.title}
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              />
              
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-indigo-ink bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex flex-col justify-between p-4">
                {/* Title (only shown on hover) */}
                <h3 className="text-white font-montserrat font-bold text-lg md:text-xl text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {tender.title}
                </h3>
                
                {/* Budget badge (always visible) */}
                <div className="flex justify-between items-end">
                  <span className="px-2 py-1 bg-amber-burst text-black font-bold rounded-md text-sm">
                    {tender.budget}
                  </span>
                  
                  {/* New badge */}
                  {tender.isNew && (
                    <Badge variant="default" className="bg-[#FF6F61] animate-pulse">
                      New
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10 flex justify-center gap-2">
            <Button
              variant="outline"
              className="bg-transparent text-white border-white hover:bg-indigo-ink" 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            
            {Array.from({ length: totalPages }).map((_, index) => (
              <Button
                key={index}
                variant={currentPage === index + 1 ? "default" : "outline"}
                className={`w-10 h-10 p-0 ${
                  currentPage === index + 1 
                    ? 'bg-amber-burst text-black' 
                    : 'bg-transparent text-white border-white hover:bg-indigo-ink'
                }`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </Button>
            ))}
            
            <Button
              variant="outline"
              className="bg-transparent text-white border-white hover:bg-indigo-ink" 
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        )}
        
        {/* Best-Value Offers Legend */}
        <div className="mt-8 flex justify-center gap-2 text-center">
          <div className="flex items-center gap-1 text-procloud-gray-300 text-sm">
            <Award className="h-5 w-5 text-amber-burst" />
            <span className="font-medium text-white">Best-Value Offers:</span> 
            <span>Freelancers submit their price, and clients choose the most competitive and highest-value proposal.</span>
          </div>
        </div>
      </div>
      
      {/* Detailed Tender Modal */}
      <Dialog open={!!selectedTender} onOpenChange={(open) => !open && setSelectedTender(null)}>
        <DialogContent className="bg-white text-black max-w-2xl">
          {selectedTender && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">{selectedTender.title}</DialogTitle>
                <DialogDescription className="text-procloud-gray-600">
                  {selectedTender.description}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-burst" />
                  <div>
                    <p className="text-sm text-procloud-gray-600">Current best offer</p>
                    <p className="text-2xl font-bold text-indigo-ink">{selectedTender.budget}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-procloud-gray-600">Deadline</p>
                  <p className="font-medium text-red-500">{selectedTender.deadline}</p>
                </div>
              </div>
              
              <div className="flex justify-center mt-4">
                <Link to={`/jobs/${selectedTender.slug}`}>
                  <Button className="bg-indigo-ink text-white hover:bg-indigo-700">
                    See Details
                  </Button>
                </Link>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default TenderSpotlight;
