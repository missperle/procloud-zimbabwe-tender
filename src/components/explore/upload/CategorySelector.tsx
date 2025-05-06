
import React from 'react';

type CategorySelectorProps = {
  categories: string[];
  selectedCategories: string[];
  handleCategoryChange: (category: string) => void;
  isUploading: boolean;
};

const CategorySelector = ({ 
  categories, 
  selectedCategories, 
  handleCategoryChange,
  isUploading 
}: CategorySelectorProps) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <div 
            key={category}
            onClick={() => !isUploading && handleCategoryChange(category)}
            className={`px-3 py-1 rounded-full text-sm cursor-pointer transition-colors ${
              selectedCategories.includes(category)
                ? 'bg-accent text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {category}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySelector;
