
// Helper function to calculate profile completion percentage
export const calculateProfileCompletion = (profile: any): number => {
  const fields = [
    { name: 'title', weight: 15 },
    { name: 'bio', weight: 15 },
    { name: 'location', weight: 10 },
    { name: 'hourly_rate', weight: 10 },
    { name: 'years_experience', weight: 10 },
    { name: 'education', weight: 10 },
    { name: 'profile_image_url', weight: 10 },
  ];
  
  // Calculate completed fields weight sum
  const completedWeight = fields.reduce((sum, field) => {
    return sum + (profile[field.name] ? field.weight : 0);
  }, 0);
  
  // 30% is awarded for just having an account, remaining 70% from completing fields
  return Math.min(30 + completedWeight, 100);
};
