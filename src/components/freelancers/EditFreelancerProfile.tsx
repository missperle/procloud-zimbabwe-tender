
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useFreelancerProfile } from "@/hooks/useFreelancerProfile";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Upload, X } from "lucide-react";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Form validation schema
const profileFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  hourly_rate: z.string().min(1, "Hourly rate is required"),
  location: z.string().min(1, "Location is required"),
  years_experience: z.string().min(1, "Years of experience is required"),
  education: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const EditFreelancerProfile = () => {
  const { currentUser } = useAuth();
  const { profile, refreshProfile } = useFreelancerProfile();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Initialize form with existing profile data
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      title: "",
      bio: "",
      hourly_rate: "",
      location: "",
      years_experience: "",
      education: "",
    },
  });

  // Load profile data when available
  useEffect(() => {
    if (profile) {
      form.reset({
        title: profile.title || "",
        bio: profile.bio || "",
        hourly_rate: profile.hourly_rate?.toString() || "",
        location: profile.location || "",
        years_experience: profile.years_experience?.toString() || "",
        education: profile.education || "",
      });
      
      if (profile.profile_image_url) {
        setPreviewUrl(profile.profile_image_url);
      }
    }
  }, [profile, form]);

  // Handle profile image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const imageUrl = URL.createObjectURL(file);
      setPreviewUrl(imageUrl);
    }
  };

  // Clear selected image
  const handleClearImage = () => {
    setProfileImage(null);
    setPreviewUrl(null);
    // Reset the file input
    const fileInput = document.getElementById("profile-image") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  // Upload profile image to Supabase storage
  const uploadProfileImage = async (): Promise<string | null> => {
    if (!profileImage || !currentUser) return null;
    
    setIsUploading(true);
    
    try {
      const fileExt = profileImage.name.split(".").pop();
      const filePath = `${currentUser.id}/${uuidv4()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from("profile_images")
        .upload(filePath, profileImage);
        
      if (uploadError) throw uploadError;
      
      // Get public URL for the uploaded image
      const { data } = supabase.storage
        .from("profile_images")
        .getPublicUrl(filePath);
        
      return data.publicUrl;
    } catch (error) {
      console.error("Error uploading profile image:", error);
      toast({
        title: "Upload Failed",
        description: "There was a problem uploading your profile image.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  // Submit form handler
  const onSubmit = async (data: ProfileFormValues) => {
    if (!currentUser) return;
    
    setIsLoading(true);
    
    try {
      // Upload profile image if a new one was selected
      let profileImageUrl = previewUrl;
      if (profileImage) {
        const imageUrl = await uploadProfileImage();
        if (imageUrl) profileImageUrl = imageUrl;
      }
      
      // Update freelancer profile
      const { error } = await supabase
        .from("freelancer_profiles")
        .update({
          title: data.title,
          bio: data.bio,
          hourly_rate: parseFloat(data.hourly_rate),
          location: data.location,
          years_experience: parseInt(data.years_experience),
          education: data.education || null,
          profile_image_url: profileImageUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", currentUser.id);
        
      if (error) throw error;
      
      // Refresh profile data
      await refreshProfile();
      
      toast({
        title: "Profile Updated",
        description: "Your freelancer profile has been updated successfully.",
      });
      
      // Navigate back to profile page
      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "There was a problem updating your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Edit Profile</CardTitle>
        <CardDescription>
          Update your professional profile information
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Profile Image */}
            <div className="flex flex-col items-center space-y-4 pb-6 border-b">
              {previewUrl ? (
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={previewUrl} alt="Profile" />
                    <AvatarFallback>{currentUser?.email?.[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                    onClick={handleClearImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Avatar className="h-24 w-24">
                  <AvatarFallback>{currentUser?.email?.[0].toUpperCase()}</AvatarFallback>
                </Avatar>
              )}
              
              <div className="flex items-center gap-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => document.getElementById("profile-image")?.click()}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Upload Photo
                </Button>
                <input
                  id="profile-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>
            
            {/* Professional Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Professional Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Graphic Designer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Bio */}
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Tell potential clients about yourself and your expertise..." 
                      className="min-h-[120px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Hourly Rate */}
            <FormField
              control={form.control}
              name="hourly_rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hourly Rate ($)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="25" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Location */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Harare, Zimbabwe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Years of Experience */}
            <FormField
              control={form.control}
              name="years_experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Years of Experience</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="5" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Education */}
            <FormField
              control={form.control}
              name="education"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Education (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Bachelor's in Graphic Design, University of Zimbabwe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Submit Button */}
            <div className="flex gap-4">
              <Button 
                type="submit" 
                disabled={isLoading || isUploading}
                className="ml-auto"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Updating..." : "Save Changes"}
              </Button>
              
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate("/dashboard")}
                disabled={isLoading || isUploading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default EditFreelancerProfile;
