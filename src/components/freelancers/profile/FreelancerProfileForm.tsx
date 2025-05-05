
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, UploadCloud } from "lucide-react";
import SkillsSelector from "./SkillsSelector";

const profileSchema = z.object({
  title: z.string().min(2, { message: "Job title is required" }),
  bio: z.string().min(10, { message: "Bio must be at least 10 characters" }),
  location: z.string().min(2, { message: "Location is required" }),
  hourly_rate: z
    .string()
    .min(1, { message: "Hourly rate is required" })
    .refine((val) => !isNaN(Number(val)), { message: "Must be a number" }),
  years_experience: z
    .string()
    .min(1, { message: "Years of experience is required" })
    .refine((val) => !isNaN(Number(val)), { message: "Must be a number" }),
  education: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const FreelancerProfileForm = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      title: "",
      bio: "",
      location: "",
      hourly_rate: "",
      years_experience: "",
      education: "",
    },
  });

  // Fetch existing profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!currentUser) return;

      try {
        setLoading(true);
        
        // Fetch profile data
        const { data: profileData, error: profileError } = await supabase
          .from("freelancer_profiles")
          .select("*")
          .eq("id", currentUser.id)
          .single();

        if (profileError && profileError.code !== "PGRST116") {
          throw profileError;
        }

        if (profileData) {
          form.reset({
            title: profileData.title || "",
            bio: profileData.bio || "",
            location: profileData.location || "",
            hourly_rate: profileData.hourly_rate?.toString() || "",
            years_experience: profileData.years_experience?.toString() || "",
            education: profileData.education || "",
          });
          
          setProfileImageUrl(profileData.profile_image_url);
        }

        // Fetch user's skills
        const { data: skillsData, error: skillsError } = await supabase
          .from("freelancer_skills")
          .select("skills(name)")
          .eq("freelancer_id", currentUser.id);

        if (skillsError) {
          throw skillsError;
        }

        if (skillsData) {
          const skills = skillsData.map((item) => item.skills?.name).filter(Boolean) as string[];
          setSelectedSkills(skills);
        }
      } catch (error: any) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error fetching profile",
          description: error.message || "Something went wrong",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [currentUser, form, toast]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentUser || !e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const fileExt = file.name.split(".").pop();
    const filePath = `${currentUser.id}/profile-image.${fileExt}`;

    try {
      setUploadingImage(true);
      
      // Upload the image
      const { error: uploadError } = await supabase.storage
        .from("freelancer-images")
        .upload(filePath, file, {
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from("freelancer-images")
        .getPublicUrl(filePath);

      if (urlData) {
        setProfileImageUrl(urlData.publicUrl);
      }

      toast({
        title: "Image uploaded",
        description: "Your profile image has been updated",
      });
    } catch (error: any) {
      toast({
        title: "Error uploading image",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    if (!currentUser) return;

    try {
      setLoading(true);
      
      // Update profile
      const profileUpdate = {
        title: data.title,
        bio: data.bio,
        location: data.location,
        hourly_rate: parseFloat(data.hourly_rate),
        years_experience: parseInt(data.years_experience),
        education: data.education,
        profile_image_url: profileImageUrl,
      };

      const { error: updateError } = await supabase
        .from("freelancer_profiles")
        .update(profileUpdate)
        .eq("id", currentUser.id);

      if (updateError) throw updateError;

      // Handle skills update
      if (selectedSkills.length > 0) {
        // First delete existing skills
        const { error: deleteError } = await supabase
          .from("freelancer_skills")
          .delete()
          .eq("freelancer_id", currentUser.id);

        if (deleteError) throw deleteError;

        // Get skill IDs
        const { data: skillIds, error: skillError } = await supabase
          .from("skills")
          .select("id, name")
          .in("name", selectedSkills);

        if (skillError) throw skillError;

        if (skillIds && skillIds.length > 0) {
          // Insert new skills
          const skillInserts = skillIds.map(skill => ({
            freelancer_id: currentUser.id,
            skill_id: skill.id,
          }));

          const { error: insertError } = await supabase
            .from("freelancer_skills")
            .insert(skillInserts);

          if (insertError) throw insertError;
        }
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error updating profile",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Profile Information</h2>
        <p className="text-gray-500">Update your professional profile details</p>
      </div>

      <div className="flex justify-center mb-6">
        <div className="relative">
          <Avatar className="w-24 h-24">
            {profileImageUrl ? (
              <AvatarImage src={profileImageUrl} alt="Profile" />
            ) : (
              <AvatarFallback className="bg-procloud-gray-300 text-2xl">
                {currentUser?.email?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            )}
          </Avatar>
          
          <label 
            className="absolute bottom-0 right-0 bg-procloud-green rounded-full p-2 cursor-pointer"
            htmlFor="profile-image"
          >
            {uploadingImage ? (
              <Loader2 className="h-4 w-4 text-white animate-spin" />
            ) : (
              <UploadCloud className="h-4 w-4 text-black" />
            )}
          </label>
          
          <input
            id="profile-image"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Professional Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Senior Web Developer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
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
          </div>

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Tell clients about your professional experience, skills, and expertise" 
                    rows={4}
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="hourly_rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hourly Rate ($)</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="years_experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Years of Experience</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="education"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Education</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Your degrees and certifications" 
                    rows={2}
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <FormLabel>Skills</FormLabel>
            <SkillsSelector 
              selectedSkills={selectedSkills} 
              setSelectedSkills={setSelectedSkills} 
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Profile"
            )}
          </Button>
        </form>
      </Form>
    </Card>
  );
};

export default FreelancerProfileForm;
