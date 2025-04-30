
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";

interface JobsFilterProps {
  onFilter: (filters: any) => void;
}

const JobsFilter = ({ onFilter }: JobsFilterProps) => {
  const [category, setCategory] = useState<string>("");
  const [budget, setBudget] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const handleFilter = () => {
    onFilter({
      category,
      budget,
      searchTerm,
    });
    if (window.innerWidth < 768) {
      setIsFilterDrawerOpen(false);
    }
  };

  const handleReset = () => {
    setCategory("");
    setBudget("");
    setSearchTerm("");
    onFilter({});
  };

  // Toggle filter drawer for mobile
  const toggleFilterDrawer = () => {
    setIsFilterDrawerOpen(!isFilterDrawerOpen);
  };

  return (
    <>
      {/* Mobile Filter Trigger */}
      <div className="md:hidden mb-4">
        <Button 
          onClick={toggleFilterDrawer} 
          className="w-full text-white"
          variant="default"
        >
          {isFilterDrawerOpen ? "Hide Filters" : "Show Filters"}
        </Button>
      </div>

      {/* Filter Content - Responsive */}
      <div className={`bg-white p-6 rounded-lg shadow-sm border border-procloud-gray-200 ${
        isFilterDrawerOpen ? 'block' : 'hidden md:block'
      } ${window.innerWidth < 768 ? 'fixed bottom-0 left-0 right-0 z-40 rounded-b-none max-h-[80vh] overflow-y-auto' : ''}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Filter Jobs</h2>
          {window.innerWidth < 768 && (
            <Button variant="ghost" size="icon" onClick={toggleFilterDrawer}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <div className="space-y-0">
          <div className="filter-group">
            <label htmlFor="search" className="block text-sm font-medium mb-1">
              Search
            </label>
            <Input
              id="search"
              placeholder="Search by keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="filter-group">
            <label htmlFor="category" className="block text-sm font-medium mb-1">
              Category
            </label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="development">Development</SelectItem>
                <SelectItem value="writing">Writing</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="video">Video & Animation</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="budget" className="block text-sm font-medium mb-1">
              Budget Range
            </label>
            <Select value={budget} onValueChange={setBudget}>
              <SelectTrigger id="budget">
                <SelectValue placeholder="Select budget range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-50">$0 - $50</SelectItem>
                <SelectItem value="50-100">$50 - $100</SelectItem>
                <SelectItem value="100-200">$100 - $200</SelectItem>
                <SelectItem value="200-500">$200 - $500</SelectItem>
                <SelectItem value="500+">$500+</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="pt-4 flex flex-col space-y-2">
            <Button 
              onClick={handleFilter} 
              className="w-full text-white" 
              variant="pill"
            >
              Apply Filters
            </Button>
            <Button 
              onClick={handleReset} 
              variant="link" 
              className="w-full text-procloud-charcoal-gray"
            >
              Reset Filters
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default JobsFilter;
