
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

const SearchBar = ({ placeholder = "Search...", className }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  return (
    <div className={`search-container relative ${className}`}>
      <Input 
        type="search"
        placeholder={placeholder}
        className="pl-10 rounded-full border border-procloud-gray-300 h-10"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Search className="absolute left-3 top-2.5 h-5 w-5 text-procloud-gray-400" />
    </div>
  );
};

export default SearchBar;
