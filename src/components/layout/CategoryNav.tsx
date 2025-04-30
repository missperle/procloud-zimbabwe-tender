
import { useState } from 'react';
import { useLocation } from 'react-router-dom';

const categories = [
  "All", "Design", "Illustration", "Branding", "Photography", 
  "Web Development", "Mobile Apps", "Animation", "UI/UX", "3D"
];

const CategoryNav = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const location = useLocation();
  
  // Only show the category nav on the explore page
  if (location.pathname !== '/explore') {
    return null;
  }

  return (
    <div className="category-nav border-b border-procloud-gray-200 overflow-x-auto hide-scrollbar">
      <div className="px-6 py-2 flex space-x-6">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-chip whitespace-nowrap py-2 px-1 text-sm font-medium transition-colors ${
              activeCategory === category 
                ? 'border-b-2 border-indigo-ink text-indigo-ink' 
                : 'hover:text-indigo-ink'
            }`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryNav;
