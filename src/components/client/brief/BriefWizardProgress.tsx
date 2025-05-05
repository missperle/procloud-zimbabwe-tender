
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';

interface BriefWizardProgressProps {
  currentCategory: string;
  isComplete: boolean;
}

const categories = [
  { id: 'objectives', label: 'Objectives' },
  { id: 'audience', label: 'Audience' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'budget', label: 'Budget' },
  { id: 'deliverables', label: 'Deliverables' },
  { id: 'skills', label: 'Skills' },
  { id: 'references', label: 'References' },
  { id: 'brand', label: 'Brand' },
];

const BriefWizardProgress: React.FC<BriefWizardProgressProps> = ({ 
  currentCategory, 
  isComplete 
}) => {
  // Find the index of the current category
  const currentIndex = categories.findIndex(cat => cat.id === currentCategory);
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium">Progress</h3>
        {isComplete ? (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Complete
          </Badge>
        ) : (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Step {currentIndex + 1} of {categories.length}
          </Badge>
        )}
      </div>
      
      <div className="relative">
        {/* Progress bar background */}
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          {/* Filled progress */}
          <div 
            className="h-full bg-primary transition-all duration-300 ease-in-out"
            style={{ 
              width: isComplete 
                ? '100%' 
                : `${Math.min(100, ((currentIndex + 1) / categories.length) * 100)}%` 
            }}
          />
        </div>
        
        {/* Category markers */}
        <div className="mt-1 grid grid-cols-8 gap-0 text-[10px] text-gray-500">
          {categories.map((category, index) => {
            const isActive = index <= currentIndex || isComplete;
            return (
              <div 
                key={category.id}
                className={`truncate text-center ${isActive ? 'font-medium text-primary' : ''}`}
              >
                {category.label}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BriefWizardProgress;
