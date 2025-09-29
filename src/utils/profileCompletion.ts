/**
 * Calculate profile completion percentage based on filled fields
 */
export function calculateProfileCompletion(profileData: any): number {
  const requiredFields = [
    'full_name', 
    'gender', 
    'birth_date', 
    'height_cm',
    'body_type',
    'complexion',
    'religion', 
    'mother_tongue',
    'education_level', 
    'occupation', 
    'location_city', 
    'location_country'
  ];
  
  const optionalButImportantFields = [
    'about_me',
    'community',
    'family_type',
    'father_occupation',
    'birth_time',
    'birth_city',
    'diet',
    'drinking',
    'smoking'
  ];
  
  // Calculate required fields completion (80% weight)
  const completedRequired = requiredFields.filter(field => {
    const value = profileData[field];
    return value && value.toString().trim() !== '';
  });
  
  const requiredScore = (completedRequired.length / requiredFields.length) * 80;
  
  // Calculate optional fields completion (20% weight)
  const completedOptional = optionalButImportantFields.filter(field => {
    const value = profileData[field];
    return value && value.toString().trim() !== '';
  });
  
  const optionalScore = (completedOptional.length / optionalButImportantFields.length) * 20;
  
  return Math.round(requiredScore + optionalScore);
}

/**
 * Get incomplete sections for profile improvement suggestions
 */
export function getIncompleteSections(profileData: any): Array<{
  key: string;
  label: string;
  condition: boolean;
  action: () => void;
}> {
  const sections = [
    {
      key: 'photos',
      label: 'Add Photos',
      condition: !profileData.photos || profileData.photos.length === 0,
      action: () => window.location.href = '/account/photos'
    },
    {
      key: 'religious',
      label: 'Religious Details',
      condition: !profileData.religion || !profileData.community,
      action: () => {}
    },
    {
      key: 'family',
      label: 'Family Details',
      condition: !profileData.father_occupation || !profileData.family_type,
      action: () => {}
    },
    {
      key: 'education',
      label: 'Education & Career',
      condition: !profileData.education_level || !profileData.occupation,
      action: () => {}
    },
    {
      key: 'about_me',
      label: 'About Me',
      condition: !profileData.about_me || profileData.about_me.length < 50,
      action: () => {}
    }
  ];
  
  return sections.filter(section => section.condition);
}

/**
 * Calculate overall verification score
 */
export function calculateVerificationScore(verificationData: any): number {
  const types = ['phone', 'email', 'id_document', 'social_media', 'professional'];
  const verified = types.filter(type => {
    return verificationData?.[`${type}_verified`] === true;
  }).length;
  
  return Math.round((verified / types.length) * 100);
}