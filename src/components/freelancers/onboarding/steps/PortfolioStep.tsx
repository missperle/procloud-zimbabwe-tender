
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { FreelancerOnboardingFormData, PortfolioItem } from "@/hooks/useFreelancerOnboarding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Upload, Link, Code, FileText } from "lucide-react";

interface PortfolioStepProps {
  formData: FreelancerOnboardingFormData;
  updateFormData: (data: Partial<FreelancerOnboardingFormData>) => void;
}

const PortfolioStep = ({ formData, updateFormData }: PortfolioStepProps) => {
  const [newItem, setNewItem] = useState<Partial<PortfolioItem>>({
    id: uuidv4(),
    type: 'image',
    content: '',
    description: '',
    role: '',
    outcome: ''
  });
  const [showForm, setShowForm] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleAddItem = () => {
    // Validate the new item
    if (!newItem.description || !newItem.role || !newItem.outcome || !newItem.content) {
      return;
    }

    // Add the new item to the portfolio
    updateFormData({
      portfolioItems: [...formData.portfolioItems, newItem as PortfolioItem]
    });

    // Reset the form
    setNewItem({
      id: uuidv4(),
      type: 'image',
      content: '',
      description: '',
      role: '',
      outcome: ''
    });
    setImagePreview(null);
    setShowForm(false);
  };

  const handleRemoveItem = (id: string) => {
    updateFormData({
      portfolioItems: formData.portfolioItems.filter(item => item.id !== id)
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewItem({ ...newItem, content: file });
      
      // Create a preview for images
      if (newItem.type === 'image' && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
      }
    }
  };

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'image': return <Upload className="h-5 w-5" />;
      case 'url': return <Link className="h-5 w-5" />;
      case 'code': return <Code className="h-5 w-5" />;
      case 'pdf': return <FileText className="h-5 w-5" />;
      default: return <Upload className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-md">
        <h4 className="text-sm font-medium text-blue-700 mb-2">Why Portfolio Matters</h4>
        <p className="text-sm text-blue-600">
          A strong portfolio helps clients see the quality of your work and increases your chances of getting hired. 
          Add your best and most relevant work samples.
        </p>
      </div>

      {/* Portfolio items list */}
      {formData.portfolioItems.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {formData.portfolioItems.map((item) => (
            <Card key={item.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base">{item.description}</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <span className="font-medium">Role:</span> {item.role}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <span className="font-medium">Outcome:</span> {item.outcome}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="font-medium">Type:</span> {item.type}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add new item form */}
      {showForm ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Add Portfolio Item</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="block mb-2">Content Type</Label>
              <RadioGroup
                value={newItem.type}
                onValueChange={(value) => setNewItem({ ...newItem, type: value as any })}
                className="flex flex-wrap gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="image" id="image" />
                  <Label htmlFor="image" className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Image
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="url" id="url" />
                  <Label htmlFor="url" className="flex items-center gap-2">
                    <Link className="h-4 w-4" />
                    URL
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="code" id="code" />
                  <Label htmlFor="code" className="flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    Code
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pdf" id="pdf" />
                  <Label htmlFor="pdf" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    PDF
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {(newItem.type === 'image' || newItem.type === 'pdf') && (
              <div>
                <Label className="block mb-2">Upload File</Label>
                <Input
                  type="file"
                  accept={newItem.type === 'image' ? "image/*" : ".pdf"}
                  onChange={handleFileChange}
                />
                {imagePreview && (
                  <div className="mt-2 max-w-xs">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="max-w-full h-auto rounded"
                    />
                  </div>
                )}
              </div>
            )}

            {(newItem.type === 'url' || newItem.type === 'code') && (
              <div>
                <Label className="block mb-2">
                  {newItem.type === 'url' ? 'Project URL' : 'Code Snippet or Repository URL'}
                </Label>
                <Input
                  placeholder={newItem.type === 'url' ? 'https://example.com/project' : 'https://github.com/username/repo'}
                  value={typeof newItem.content === 'string' ? newItem.content : ''}
                  onChange={(e) => setNewItem({ ...newItem, content: e.target.value })}
                />
              </div>
            )}

            <div>
              <Label className="block mb-2">Project Title</Label>
              <Input
                placeholder="E.g., Company Website Redesign, Mobile App, Logo Design"
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              />
            </div>

            <div>
              <Label className="block mb-2">Your Role</Label>
              <Input
                placeholder="E.g., Lead Designer, Front-end Developer, UI/UX Consultant"
                value={newItem.role}
                onChange={(e) => setNewItem({ ...newItem, role: e.target.value })}
              />
            </div>

            <div>
              <Label className="block mb-2">Project Outcome</Label>
              <Textarea
                placeholder="E.g., Increased conversion by 25%, Improved user satisfaction, Reduced bounce rate"
                value={newItem.outcome}
                onChange={(e) => setNewItem({ ...newItem, outcome: e.target.value })}
                rows={3}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={handleAddItem}>Add to Portfolio</Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="text-center py-6">
          <Button onClick={() => setShowForm(true)}>
            Add Portfolio Item
          </Button>
        </div>
      )}
      
      {formData.portfolioItems.length === 0 && !showForm && (
        <div className="bg-amber-50 p-4 rounded-md">
          <p className="text-sm text-amber-600 font-medium">
            You need to add at least one portfolio item to proceed.
          </p>
        </div>
      )}
    </div>
  );
};

export default PortfolioStep;
