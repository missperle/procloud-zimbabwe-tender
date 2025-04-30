
import { useEffect, useRef } from 'react';

type TabBarProps = {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
};

const TabBar = ({ categories, activeCategory, onCategoryChange }: TabBarProps) => {
  const tabsRef = useRef<HTMLDivElement>(null);

  // Scroll to active tab when it changes
  useEffect(() => {
    if (tabsRef.current && activeCategory) {
      const activeTab = tabsRef.current.querySelector(`.tab-item[data-category="${activeCategory}"]`);
      if (activeTab) {
        const tabsContainer = tabsRef.current;
        const activeTabRect = activeTab.getBoundingClientRect();
        const containerRect = tabsContainer.getBoundingClientRect();
        
        // Calculate the scroll position to center the active tab
        const scrollLeft = activeTabRect.left + tabsContainer.scrollLeft - 
                           containerRect.left - (containerRect.width / 2) + 
                           (activeTabRect.width / 2);
        
        tabsContainer.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }
    }
  }, [activeCategory]);

  return (
    <div 
      className="tabs-container overflow-x-auto hide-scrollbar border-b border-gray-200 sticky top-0 bg-white z-30"
      ref={tabsRef}
    >
      <div className="flex px-4 py-2 space-x-6 min-w-max">
        {categories.map((category) => (
          <button
            key={category}
            data-category={category}
            className={`tab-item whitespace-nowrap py-2 px-1 text-sm font-medium transition-colors ${
              activeCategory === category 
                ? 'border-b-2 border-accent text-accent' 
                : 'hover:text-accent'
            }`}
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabBar;
