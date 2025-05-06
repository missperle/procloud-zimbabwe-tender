
import React, { useState } from 'react';
import { SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BriefSummaryProps {
  briefTitle: string;
  briefCategory: string;
  briefSummary: string;
  isSubmitting: boolean;
  onTitleChange: (title: string) => void;
  onCategoryChange: (category: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}

const BriefSummary: React.FC<BriefSummaryProps> = ({
  briefTitle,
  briefCategory,
  briefSummary,
  isSubmitting,
  onTitleChange,
  onCategoryChange,
  onSubmit,
  onClose,
}) => {
  return (
    <>
      <SheetHeader>
        <SheetTitle>Your Brief Summary</SheetTitle>
        <SheetDescription>
          Review your brief before final submission
        </SheetDescription>
      </SheetHeader>
      
      <div className="py-4">
        <div className="space-y-4">
          <div>
            <label htmlFor="brief-title" className="block text-sm font-medium text-gray-700 mb-1">
              Brief Title
            </label>
            <Input
              id="brief-title"
              value={briefTitle}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="Enter a title for your brief"
              className="w-full"
              required
            />
          </div>
          
          <div>
            <label htmlFor="brief-category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <Select 
              value={briefCategory} 
              onValueChange={onCategoryChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="development">Development</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="writing">Writing & Translation</SelectItem>
                <SelectItem value="video">Video & Animation</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Brief Summary</h3>
            <div className="p-4 bg-gray-50 rounded-md border whitespace-pre-wrap">
              {briefSummary}
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Edit Brief
          </Button>
          <Button 
            onClick={onSubmit} 
            disabled={isSubmitting || !briefTitle}
          >
            {isSubmitting ? (
              <>
                <Loader className="h-4 w-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Brief'
            )}
          </Button>
        </div>
      </div>
    </>
  );
};

export default BriefSummary;
