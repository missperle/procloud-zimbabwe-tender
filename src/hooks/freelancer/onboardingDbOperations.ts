
import { supabase } from "@/integrations/supabase/client";
import { FreelancerOnboardingFormData } from "@/types/freelancerOnboarding";
import { v4 as uuidv4 } from "uuid";

// Function to load the current onboarding step from the database
export const loadOnboardingStep = async (userId: string | undefined) => {
  if (!userId) return 1; // Default to step 1 if no user ID
  
  try {
    const { data, error } = await supabase
      .from('users')
      .select('onboarding_step')
      .eq('id', userId)
      .single();
      
    if (!error && data && data.onboarding_step) {
      return data.onboarding_step;
    }
    return 1; // Default to step 1 if no data
  } catch (error) {
    console.error('Error loading onboarding step:', error);
    return 1; // Default to step 1 if there's an error
  }
};

// Function to update the onboarding step in the database
export const updateOnboardingStep = async (userId: string | undefined, step: number) => {
  if (!userId) return;
  
  try {
    await supabase
      .from('users')
      .update({ onboarding_step: step })
      .eq('id', userId);
  } catch (error) {
    console.error('Error updating onboarding step:', error);
  }
};

// Function to upload portfolio files to storage
export const uploadPortfolioFile = async (userId: string, file: File) => {
  const fileExt = file.name.split('.').pop();
  const filePath = `${userId}/portfolio/${uuidv4()}.${fileExt}`;
  
  try {
    const { data, error } = await supabase.storage
      .from('freelancer-portfolio')
      .upload(filePath, file);
      
    if (error) throw error;
    
    // Get the public URL for the file
    const { data: urlData } = await supabase.storage
      .from('freelancer-portfolio')
      .getPublicUrl(filePath);
      
    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading portfolio file:', error);
    throw error;
  }
};

// Function to upload identity document
export const uploadIdentityDocument = async (userId: string, file: File) => {
  const fileExt = file.name.split('.').pop();
  const filePath = `${userId}/identity/${uuidv4()}.${fileExt}`;
  
  try {
    const { data, error } = await supabase.storage
      .from('identity-documents')
      .upload(filePath, file, { upsert: true });
      
    if (error) throw error;
    
    // Get the public URL for the file
    const { data: urlData } = await supabase.storage
      .from('identity-documents')
      .getPublicUrl(filePath);
      
    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading identity document:', error);
    throw error;
  }
};

// Function to upload profile image
export const uploadProfileImage = async (userId: string, file: File) => {
  const fileExt = file.name.split('.').pop();
  const filePath = `${userId}/profile.${fileExt}`;
  
  try {
    const { data, error } = await supabase.storage
      .from('profile-images')
      .upload(filePath, file, { upsert: true });
      
    if (error) throw error;
    
    // Get the public URL for the file
    const { data: urlData } = await supabase.storage
      .from('profile-images')
      .getPublicUrl(filePath);
      
    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading profile image:', error);
    throw error;
  }
};

// Function to save all form data
export const saveFreelancerData = async (userId: string | undefined, formData: FreelancerOnboardingFormData) => {
  if (!userId) return false;
  
  try {
    // Upload profile image if it exists
    let profileImageUrl = null;
    if (formData.profileImage) {
      profileImageUrl = await uploadProfileImage(userId, formData.profileImage);
    }
    
    // First, save profile data
    const { error: profileError } = await supabase
      .from('freelancer_profiles')
      .upsert({
        id: userId,
        title: formData.title,
        bio: formData.bio,
        hourly_rate: formData.hourlyRate,
        profile_image_url: profileImageUrl,
        // Add other fields as needed
      });
      
    if (profileError) throw profileError;
    
    // Save skills
    if (formData.skills.length > 0) {
      // First get or create the skills
      for (const skillName of formData.skills) {
        // Check if the skill exists
        const { data: existingSkill } = await supabase
          .from('skills')
          .select('id')
          .eq('name', skillName)
          .single();
          
        let skillId;
        
        if (existingSkill) {
          skillId = existingSkill.id;
        } else {
          // Create the skill
          const { data: newSkill, error: skillError } = await supabase
            .from('skills')
            .insert({ name: skillName })
            .select('id')
            .single();
            
          if (skillError) throw skillError;
          skillId = newSkill.id;
        }
        
        // Associate the skill with the freelancer
        await supabase
          .from('freelancer_skills')
          .upsert({
            freelancer_id: userId,
            skill_id: skillId
          });
      }
    }
    
    // Save portfolio items
    for (const item of formData.portfolioItems) {
      let contentUrl = item.content;
      
      // If the content is a file, upload it
      if (item.content instanceof File) {
        contentUrl = await uploadPortfolioFile(userId, item.content);
      }
      
      await supabase
        .from('portfolio_items')
        .insert({
          freelancer_id: userId,
          title: item.description,
          description: `${item.role} - ${item.outcome}`,
          image_url: item.type === 'image' ? contentUrl : null,
          project_url: item.type === 'url' ? contentUrl : null,
          // Add other fields as needed
        });
    }
    
    return true;
  } catch (error) {
    console.error('Error saving freelancer data:', error);
    return false;
  }
};

// Function to complete onboarding
export const completeFreelancerOnboarding = async (userId: string | undefined) => {
  if (!userId) return false;
  
  try {
    const { error } = await supabase
      .from('users')
      .update({ 
        onboarding_completed: true,
        onboarding_step: 7 // Set to the last step
      })
      .eq('id', userId);
      
    return !error;
  } catch (error) {
    console.error('Error completing onboarding:', error);
    return false;
  }
};
