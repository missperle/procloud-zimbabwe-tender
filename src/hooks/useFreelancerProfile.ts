
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface FreelancerProfile {
  id: string;
  title: string | null;
  bio: string | null;
  hourly_rate: number | null;
  location: string | null;
  years_experience: number | null;
  verified: boolean | null;
  profile_image_url: string | null;
  education: string | null;
  created_at: string | null;
  updated_at: string | null;
}

interface UseFreelancerProfileReturn {
  profile: FreelancerProfile | null;
  isLoading: boolean;
  error: any | null;
  profileCompletionPercentage: number;
  refreshProfile: () => Promise<void>;
}

export function useFreelancerProfile(): UseFreelancerProfileReturn {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState<FreelancerProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<any | null>(null);

  const fetchProfile = async () => {
    setIsLoading(true);
    setError(null);

    if (!currentUser) {
      setProfile(null);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('freelancer_profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      if (error) {
        throw error;
      }

      setProfile(data as FreelancerProfile);
    } catch (err) {
      console.error('Error fetching freelancer profile:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [currentUser]);

  // Calculate profile completion percentage
  const calculateProfileCompletion = (): number => {
    if (!profile) return 0;

    const requiredFields: (keyof FreelancerProfile)[] = [
      'title',
      'bio',
      'hourly_rate',
      'location',
      'years_experience',
    ];

    const optionalFields: (keyof FreelancerProfile)[] = [
      'profile_image_url',
      'education',
    ];

    // Count required fields (worth 80% of completion)
    const requiredFieldsCount = requiredFields.length;
    const completedRequiredFields = requiredFields.filter(
      field => profile[field] !== null && profile[field] !== ''
    ).length;
    const requiredPercentage = (completedRequiredFields / requiredFieldsCount) * 80;

    // Count optional fields (worth 20% of completion)
    const optionalFieldsCount = optionalFields.length;
    const completedOptionalFields = optionalFields.filter(
      field => profile[field] !== null && profile[field] !== ''
    ).length;
    const optionalPercentage = (completedOptionalFields / optionalFieldsCount) * 20;

    return Math.round(requiredPercentage + optionalPercentage);
  };

  return {
    profile,
    isLoading,
    error,
    profileCompletionPercentage: calculateProfileCompletion(),
    refreshProfile: fetchProfile,
  };
}
