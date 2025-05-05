
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, UploadCloud } from "lucide-react";
import { PortfolioItem } from "./PortfolioManager";

const portfolioItemSchema = z.object({
  title: z.string().min(2, { message: "Title is required" }),
  description: z.string().optional(),
  category: z.string().optional(),
  project_url: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
});

type PortfolioFormValues = z.infer<typeof portfolioItemSchema>;

interface PortfolioItemFormProps {
  onSave: (item: PortfolioItem) => void;
  onCancel: () => void;
  editItem?: PortfolioItem | null;
}

const categories = [
  "Web Development",
  "Mobile App",
  "UI/UX Design",
  "Graphic Design",
  "Content Writing",
  "Video",
  "Photography",
  "Marketing",
  "Other",
];

const PortfolioItemForm = ({ onSave, onCancel, editItem }: PortfolioItemFormProps) => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(editItem?.image_url || null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const form = useForm<PortfolioFormValues>({
    resolver: zodResolver(portfolioItemSchema),
    defaultValues: {
      title: editItem?.title || "",
      description: editItem?.description || "",
      category: editItem?.category || undefined,
      project_url: editItem?.project_url || "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setImageFile(file);
    
    // Create a preview
    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!currentUser || !imageFile) return imageUrl;

    try {
      setUploadingImage(true);
      
      // Create a unique filename
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${currentUser.id}/${fileName}`;
      
      // Upload the image
      const { error: uploadError } = await supabase.storage
        .from("portfolio-images")
        .upload(filePath, imageFile);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from("portfolio-images")
        .getPublicUrl(filePath);

      return urlData?.publicUrl || null;
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast({
        title: "Error uploading image",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const onSubmit = async (data: PortfolioFormValues) => {
    if (!currentUser) return;

    try {
      setLoading(true);
      
      // Upload image if there's a new one
      let finalImageUrl = imageUrl;
      if (imageFile) {
        finalImageUrl = await uploadImage();
      }
      
      const portfolioItem = {
        title: data.title,
        description: data.description || null,
        category: data.category || null,
        project_url: data.project_url || null,
        image_url: finalImageUrl,
        freelancer_id: currentUser.id,
      };

      let savedItem;

      if (editItem) {
        // Update existing item
        const { data: updatedItem, error: updateError } = await supabase
          .from("portfolio_items")
          .update(portfolioItem)
          .eq("id", editItem.id)
          .select("*")
          .single();

        if (updateError) throw updateError;
        savedItem = updatedItem;

        toast({
          title: "Portfolio item updated",
          description: "Your portfolio item has been updated successfully",
        });
      } else {
        // Create new item
        const { data: newItem, error: insertError } = await supabase
          .from("portfolio_items")
          .insert(portfolioItem)
          .select("*")
          .single();

        if (insertError) throw insertError;
        savedItem = newItem;

        toast({
          title: "Portfolio item added",
          description: "Your portfolio item has been added successfully",
        });
      }

      if (savedItem) {
        onSave(savedItem);
      }
    } catch (error: any) {
      console.error("Error saving portfolio item:", error);
      toast({
        title: "Error saving portfolio item",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg border mb-6">
      <h3 className="text-xl font-semibold mb-4">
        {editItem ? "Edit Portfolio Item" : "Add New Portfolio Item"}
      </h3>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Title *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter project title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe your project" 
                    rows={3}
                    {...field} 
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="project_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project URL</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="https://example.com" 
                    {...field} 
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <FormLabel>Project Image</FormLabel>
            <div className="border rounded-md p-2">
              {imageUrl ? (
                <div className="relative mb-4">
                  <img 
                    src={imageUrl} 
                    alt="Preview" 
                    className="w-full h-48 object-cover rounded-md" 
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2 bg-white hover:bg-gray-100"
                    onClick={() => {
                      setImageUrl(null);
                      setImageFile(null);
                    }}
                  >
                    Change Image
                  </Button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center gap-2 cursor-pointer h-32 rounded-md border border-dashed border-gray-300 px-6 text-sm hover:bg-gray-50">
                  <UploadCloud className="h-8 w-8 text-gray-400" />
                  <span className="text-gray-500">
                    Click to upload an image
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading || uploadingImage}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || uploadingImage}
            >
              {(loading || uploadingImage) ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                editItem ? "Update Item" : "Add Item"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PortfolioItemForm;
