
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Upload, Image, Video, X, Loader2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

// Portfolio item type definition
interface PortfolioItem {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  image_url: string | null;
  project_url: string | null;
  created_at: string | null;
}

// Portfolio categories
const portfolioCategories = [
  "Branding",
  "UI/UX Design",
  "Web Development",
  "Mobile Apps",
  "Illustration",
  "Photography",
  "Video",
  "3D",
  "Animation",
  "Marketing",
  "Other"
];

const PortfolioManager = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  
  // States
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isFileTypeVideo, setIsFileTypeVideo] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  
  // Form states
  const [currentItem, setCurrentItem] = useState<Partial<PortfolioItem>>({
    id: "",
    title: "",
    description: "",
    category: "",
    project_url: "",
    image_url: "",
  });

  // Fetch portfolio items
  const fetchPortfolioItems = async () => {
    if (!currentUser) return;
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from("portfolio_items")
        .select("*")
        .eq("freelancer_id", currentUser.id)
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      
      setPortfolioItems(data || []);
    } catch (error) {
      console.error("Error fetching portfolio items:", error);
      toast({
        title: "Failed to load portfolio",
        description: "There was an error loading your portfolio items.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchPortfolioItems();
  }, [currentUser]);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      // Check if file is video
      const isVideo = file.type.startsWith("video/");
      setIsFileTypeVideo(isVideo);
      
      // Create preview URL
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      
      // Clean up previous object URL on component unmount
      return () => URL.revokeObjectURL(objectUrl);
    }
  };

  // Clear selected file
  const handleClearFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsFileTypeVideo(false);
  };

  // Upload file to Supabase storage
  const uploadFile = async (): Promise<string | null> => {
    if (!selectedFile || !currentUser) return null;
    
    setIsUploading(true);
    
    try {
      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `${currentUser.id}/${uuidv4()}.${fileExt}`;
      
      const { error } = await supabase.storage
        .from("portfolio")
        .upload(fileName, selectedFile);
        
      if (error) throw error;
      
      // Get public URL
      const { data } = supabase.storage
        .from("portfolio")
        .getPublicUrl(fileName);
        
      return data.publicUrl;
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Upload Failed",
        description: "There was a problem uploading your file.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser || !currentItem.title) {
      toast({
        title: "Missing Information",
        description: "Please provide a title for your portfolio item.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Upload file if a new one was selected
      let fileUrl = currentItem.image_url || null;
      if (selectedFile) {
        const uploadedUrl = await uploadFile();
        if (uploadedUrl) fileUrl = uploadedUrl;
      }
      
      if (editMode && currentItem.id) {
        // Update existing portfolio item
        const { error } = await supabase
          .from("portfolio_items")
          .update({
            title: currentItem.title,
            description: currentItem.description || null,
            category: currentItem.category || null,
            image_url: fileUrl,
            project_url: currentItem.project_url || null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", currentItem.id)
          .eq("freelancer_id", currentUser.id);
          
        if (error) throw error;
        
        toast({
          title: "Portfolio Updated",
          description: "Your portfolio item has been updated.",
        });
      } else {
        // Create new portfolio item
        const { error } = await supabase
          .from("portfolio_items")
          .insert([
            {
              freelancer_id: currentUser.id,
              title: currentItem.title,
              description: currentItem.description || null,
              category: currentItem.category || null,
              image_url: fileUrl,
              project_url: currentItem.project_url || null,
            },
          ]);
          
        if (error) throw error;
        
        toast({
          title: "Portfolio Item Added",
          description: "Your new portfolio item has been added.",
        });
      }
      
      // Reset form and fetch updated items
      resetForm();
      setFormDialogOpen(false);
      fetchPortfolioItems();
    } catch (error) {
      console.error("Error saving portfolio item:", error);
      toast({
        title: "Save Failed",
        description: "There was a problem saving your portfolio item.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete portfolio item
  const handleDelete = async () => {
    if (!currentUser || !itemToDelete) return;
    
    try {
      const { error } = await supabase
        .from("portfolio_items")
        .delete()
        .eq("id", itemToDelete)
        .eq("freelancer_id", currentUser.id);
        
      if (error) throw error;
      
      toast({
        title: "Item Deleted",
        description: "Portfolio item has been deleted successfully.",
      });
      
      fetchPortfolioItems();
    } catch (error) {
      console.error("Error deleting portfolio item:", error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete the portfolio item.",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  // Edit item
  const handleEdit = (item: PortfolioItem) => {
    setCurrentItem(item);
    setEditMode(true);
    setFormDialogOpen(true);
    
    // Set preview if there's an image
    if (item.image_url) {
      setPreviewUrl(item.image_url);
      setIsFileTypeVideo(item.image_url.includes(".mp4") || item.image_url.includes(".webm"));
    } else {
      setPreviewUrl(null);
      setIsFileTypeVideo(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setCurrentItem({
      id: "",
      title: "",
      description: "",
      category: "",
      project_url: "",
      image_url: "",
    });
    setPreviewUrl(null);
    setSelectedFile(null);
    setEditMode(false);
    setIsFileTypeVideo(false);
  };

  // Handle new item button click
  const handleNewItem = () => {
    resetForm();
    setFormDialogOpen(true);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Portfolio Management</CardTitle>
          <CardDescription>
            Showcase your work to potential clients
          </CardDescription>
        </div>
        <Button onClick={handleNewItem} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Portfolio Item
        </Button>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : portfolioItems.length === 0 ? (
          <div className="text-center py-12 border border-dashed rounded-lg">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Image className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No portfolio items</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Add your first portfolio item to showcase your work to potential clients.
            </p>
            <Button onClick={handleNewItem} className="mt-4">
              Add Your First Item
            </Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="aspect-[4/3] bg-muted relative group">
                  {item.image_url ? (
                    item.image_url.includes(".mp4") || item.image_url.includes(".webm") ? (
                      <video 
                        src={item.image_url} 
                        className="w-full h-full object-cover" 
                        controls 
                      />
                    ) : (
                      <img 
                        src={item.image_url} 
                        alt={item.title} 
                        className="w-full h-full object-cover" 
                      />
                    )
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted-foreground/10">
                      <Image className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button 
                      size="icon" 
                      variant="secondary" 
                      onClick={() => handleEdit(item)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="destructive"
                      onClick={() => {
                        setItemToDelete(item.id);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardFooter className="flex flex-col items-start p-4 space-y-2">
                  <h3 className="font-medium text-base line-clamp-1 w-full">{item.title}</h3>
                  {item.category && (
                    <Badge variant="outline">{item.category}</Badge>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
      
      {/* Form Dialog */}
      <Dialog open={formDialogOpen} onOpenChange={setFormDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editMode ? "Edit Portfolio Item" : "Add Portfolio Item"}</DialogTitle>
            <DialogDescription>
              {editMode 
                ? "Update the details of your portfolio item." 
                : "Add a new item to your portfolio to showcase your work."}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Media Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Media (Image or Video)
              </label>
              
              {previewUrl ? (
                <div className="relative aspect-video bg-muted rounded-md overflow-hidden">
                  {isFileTypeVideo ? (
                    <video 
                      src={previewUrl} 
                      className="w-full h-full object-cover" 
                      controls 
                    />
                  ) : (
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="w-full h-full object-cover" 
                    />
                  )}
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2 h-7 w-7"
                    onClick={handleClearFile}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div 
                  className="border-2 border-dashed border-muted-foreground/25 rounded-md p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => document.getElementById("portfolio-media")?.click()}
                >
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <Upload className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="mt-2 text-sm font-medium">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Supported formats: JPEG, PNG, GIF, MP4, WEBM (max 10MB)
                  </p>
                </div>
              )}
              
              <input
                id="portfolio-media"
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            
            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Title <span className="text-destructive">*</span>
              </label>
              <Input
                value={currentItem.title || ""}
                onChange={(e) => setCurrentItem({ ...currentItem, title: e.target.value })}
                placeholder="e.g. Brand Identity for Local Café"
                required
              />
            </div>
            
            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={currentItem.description || ""}
                onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })}
                placeholder="Describe your work and the process you followed..."
                rows={3}
              />
            </div>
            
            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select
                value={currentItem.category || ""}
                onValueChange={(value) => setCurrentItem({ ...currentItem, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {portfolioCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Project URL */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Project URL (Optional)</label>
              <Input
                value={currentItem.project_url || ""}
                onChange={(e) => setCurrentItem({ ...currentItem, project_url: e.target.value })}
                placeholder="https://example.com/project"
                type="url"
              />
            </div>
            
            <DialogFooter className="pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  resetForm();
                  setFormDialogOpen(false);
                }}
                disabled={isSubmitting || isUploading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting || isUploading || !currentItem.title}
              >
                {(isSubmitting || isUploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting 
                  ? "Saving..." 
                  : isUploading 
                    ? "Uploading..." 
                    : editMode ? "Update" : "Add Item"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Portfolio Item</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this portfolio item? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter className="pt-4">
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default PortfolioManager;
