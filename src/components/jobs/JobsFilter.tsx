
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

interface JobsFilterProps {
  onFilter: (filters: any) => void;
}

const JobsFilter = ({ onFilter }: JobsFilterProps) => {
  const [category, setCategory] = useState<string>("");
  const [budget, setBudget] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleFilter = () => {
    onFilter({
      category,
      budget,
      searchTerm,
    });
  };

  const handleReset = () => {
    setCategory("");
    setBudget("");
    setSearchTerm("");
    onFilter({});
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-procloud-gray-200">
      <h2 className="text-lg font-bold mb-4">Filter Jobs</h2>
      
      <div className="space-y-4">
        <div>
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
        
        <div>
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
        
        <div>
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
        
        <div className="flex flex-col space-y-2">
          <Button onClick={handleFilter} className="w-full bg-procloud-green hover:bg-procloud-green-dark text-black">
            Apply Filters
          </Button>
          <Button onClick={handleReset} variant="outline" className="w-full border-procloud-gray-300">
            Reset Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JobsFilter;
