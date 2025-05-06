
import { useState } from "react";
import { FreelancerOnboardingFormData } from "@/hooks/useFreelancerOnboarding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface SkillsServiceStepProps {
  formData: FreelancerOnboardingFormData;
  updateFormData: (data: Partial<FreelancerOnboardingFormData>) => void;
}

// Mock data for suggested skills and categories
const SUGGESTED_SKILLS = [
  "UI Design", "UX Design", "Graphic Design", "Web Development", 
  "React", "JavaScript", "TypeScript", "Node.js", "Content Writing",
  "SEO", "Social Media Marketing", "Illustration", "Branding"
];

const SUGGESTED_CATEGORIES = [
  "Design", "Development", "Marketing", "Writing & Translation",
  "Video & Animation", "Music & Audio", "Business", "Lifestyle", "Data"
];

const SUGGESTED_INDUSTRIES = [
  "Technology", "Healthcare", "Education", "Finance", "Retail",
  "Entertainment", "Food & Beverage", "Real Estate", "Travel"
];

const SkillsServiceStep = ({ formData, updateFormData }: SkillsServiceStepProps) => {
  const [skillInput, setSkillInput] = useState("");
  const [categoryInput, setCategoryInput] = useState("");
  const [industryInput, setIndustryInput] = useState("");
  
  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      updateFormData({
        skills: [...formData.skills, skillInput.trim()]
      });
      setSkillInput("");
    }
  };
  
  const removeSkill = (skill: string) => {
    updateFormData({
      skills: formData.skills.filter(s => s !== skill)
    });
  };
  
  const addCategory = () => {
    if (categoryInput.trim() && !formData.serviceCategories.includes(categoryInput.trim())) {
      updateFormData({
        serviceCategories: [...formData.serviceCategories, categoryInput.trim()]
      });
      setCategoryInput("");
    }
  };
  
  const removeCategory = (category: string) => {
    updateFormData({
      serviceCategories: formData.serviceCategories.filter(c => c !== category)
    });
  };
  
  const addIndustry = () => {
    if (industryInput.trim() && !formData.industries.includes(industryInput.trim())) {
      updateFormData({
        industries: [...formData.industries, industryInput.trim()]
      });
      setIndustryInput("");
    }
  };
  
  const removeIndustry = (industry: string) => {
    updateFormData({
      industries: formData.industries.filter(i => i !== industry)
    });
  };
  
  const addSuggestedSkill = (skill: string) => {
    if (!formData.skills.includes(skill)) {
      updateFormData({
        skills: [...formData.skills, skill]
      });
    }
  };
  
  const addSuggestedCategory = (category: string) => {
    if (!formData.serviceCategories.includes(category)) {
      updateFormData({
        serviceCategories: [...formData.serviceCategories, category]
      });
    }
  };
  
  const addSuggestedIndustry = (industry: string) => {
    if (!formData.industries.includes(industry)) {
      updateFormData({
        industries: [...formData.industries, industry]
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Skills section */}
      <div>
        <Label className="block mb-2">Your Skills (Required)</Label>
        <div className="flex flex-wrap gap-2 mb-3">
          {formData.skills.map((skill) => (
            <Badge key={skill} variant="secondary" className="flex items-center gap-1 py-1">
              {skill}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => removeSkill(skill)}
              />
            </Badge>
          ))}
        </div>
        
        <div className="flex gap-2 mb-2">
          <Input
            placeholder="Add a skill (e.g., JavaScript, Graphic Design)"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addSkill();
              }
            }}
          />
          <Button type="button" onClick={addSkill}>Add</Button>
        </div>
        
        <div>
          <p className="text-sm text-gray-500 mb-2">Suggested skills:</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_SKILLS.filter(skill => !formData.skills.includes(skill)).map((skill) => (
              <Badge 
                key={skill}
                variant="outline" 
                className="cursor-pointer hover:bg-accent"
                onClick={() => addSuggestedSkill(skill)}
              >
                + {skill}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      
      {/* Service Categories section */}
      <div>
        <Label className="block mb-2">Service Categories</Label>
        <div className="flex flex-wrap gap-2 mb-3">
          {formData.serviceCategories.map((category) => (
            <Badge key={category} variant="secondary" className="flex items-center gap-1 py-1">
              {category}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => removeCategory(category)}
              />
            </Badge>
          ))}
        </div>
        
        <div className="flex gap-2 mb-2">
          <Input
            placeholder="Add a category (e.g., UI Design, Web Development)"
            value={categoryInput}
            onChange={(e) => setCategoryInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addCategory();
              }
            }}
          />
          <Button type="button" onClick={addCategory}>Add</Button>
        </div>
        
        <div>
          <p className="text-sm text-gray-500 mb-2">Suggested categories:</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_CATEGORIES.filter(cat => !formData.serviceCategories.includes(cat)).map((category) => (
              <Badge 
                key={category}
                variant="outline" 
                className="cursor-pointer hover:bg-accent"
                onClick={() => addSuggestedCategory(category)}
              >
                + {category}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      
      {/* Industries section */}
      <div>
        <Label className="block mb-2">Industries You Serve</Label>
        <div className="flex flex-wrap gap-2 mb-3">
          {formData.industries.map((industry) => (
            <Badge key={industry} variant="secondary" className="flex items-center gap-1 py-1">
              {industry}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => removeIndustry(industry)}
              />
            </Badge>
          ))}
        </div>
        
        <div className="flex gap-2 mb-2">
          <Input
            placeholder="Add an industry (e.g., Technology, Healthcare)"
            value={industryInput}
            onChange={(e) => setIndustryInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addIndustry();
              }
            }}
          />
          <Button type="button" onClick={addIndustry}>Add</Button>
        </div>
        
        <div>
          <p className="text-sm text-gray-500 mb-2">Suggested industries:</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_INDUSTRIES.filter(ind => !formData.industries.includes(ind)).map((industry) => (
              <Badge 
                key={industry}
                variant="outline" 
                className="cursor-pointer hover:bg-accent"
                onClick={() => addSuggestedIndustry(industry)}
              >
                + {industry}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsServiceStep;
