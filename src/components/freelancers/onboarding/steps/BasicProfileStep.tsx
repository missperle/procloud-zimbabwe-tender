
import { useState } from "react";
import { FreelancerOnboardingFormData } from "@/hooks/useFreelancerOnboarding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

interface BasicProfileStepProps {
  formData: FreelancerOnboardingFormData;
  updateFormData: (data: Partial<FreelancerOnboardingFormData>) => void;
}

const BasicProfileStep = ({ formData, updateFormData }: BasicProfileStepProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(
    formData.profileImage ? URL.createObjectURL(formData.profileImage) : null
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateFormData({ profileImage: file });
      // Create a preview
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="block mb-2">Professional Title</Label>
        <Input 
          placeholder="E.g., Senior Graphic Designer, Web Developer, Content Writer"
          value={formData.title}
          onChange={(e) => updateFormData({ title: e.target.value })}
        />
        <p className="text-sm text-gray-500 mt-1">
          This will be displayed prominently on your profile
        </p>
      </div>

      <div>
        <Label className="block mb-2">Professional Photo</Label>
        <div className="flex items-center gap-4">
          {imagePreview ? (
            <div className="w-24 h-24 rounded-full overflow-hidden">
              <img 
                src={imagePreview} 
                alt="Profile preview" 
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
              <Upload className="text-gray-400" />
            </div>
          )}
          
          <div>
            <Input
              type="file"
              id="profileImage"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => document.getElementById('profileImage')?.click()}
            >
              {imagePreview ? "Change Photo" : "Upload Photo"}
            </Button>
            <p className="text-sm text-gray-500 mt-1">
              Upload a professional headshot (recommended size: 400x400px)
            </p>
          </div>
        </div>
      </div>
      
      <div>
        <Label className="block mb-2">Professional Bio</Label>
        <Textarea
          placeholder="Tell clients about your expertise, experience, and what makes you unique..."
          rows={5}
          value={formData.bio}
          onChange={(e) => updateFormData({ bio: e.target.value })}
        />
        <p className="text-sm text-gray-500 mt-1">
          Minimum 100 characters, focus on your professional skills and experience
        </p>
      </div>
    </div>
  );
};

export default BasicProfileStep;
