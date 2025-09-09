export const RELIGIONS = [
  'Hindu',
  'Muslim',
  'Sikh',
  'Christian',
  'Jain',
  'Buddhist',
  'Parsi',
  'Jewish',
  'Other',
  'Prefer not to say'
];

export const MOTHER_TONGUES = [
  'Hindi',
  'English',
  'Tamil',
  'Telugu',
  'Marathi',
  'Gujarati',
  'Bengali',
  'Punjabi',
  'Kannada',
  'Malayalam',
  'Urdu',
  'Arabic',
  'Other'
];

export const EDUCATION_LEVELS = [
  'High School',
  'Diploma',
  'Bachelor\'s Degree',
  'Master\'s Degree',
  'PhD',
  'Professional Degree',
  'Other'
];

export const INDUSTRIES = [
  'Information Technology',
  'Healthcare',
  'Engineering',
  'Education',
  'Finance',
  'Government',
  'Business',
  'Legal',
  'Arts & Entertainment',
  'Other'
];

export const COUNTRIES = [
  'Australia',
  'New Zealand',
  'India',
  'United States',
  'Canada',
  'United Kingdom',
  'Singapore',
  'Other'
];

export const HEIGHTS = Array.from({ length: 71 }, (_, i) => {
  const cm = 140 + i * 2; // 140cm to 280cm in 2cm increments
  const feet = Math.floor(cm / 30.48);
  const inches = Math.round((cm / 2.54) % 12);
  return {
    value: cm,
    label: `${cm}cm (${feet}'${inches}")`
  };
});

export const INCOME_RANGES = [
  'Prefer not to say',
  'Under $30,000',
  '$30,000 - $50,000',
  '$50,000 - $80,000',
  '$80,000 - $120,000',
  '$120,000 - $200,000',
  'Over $200,000'
];

export const DIET_OPTIONS = [
  'Vegetarian',
  'Eggetarian',
  'Non-vegetarian',
  'Vegan',
  'Jain vegetarian'
];

export const HOBBIES = [
  'Reading', 'Travel', 'Photography', 'Music', 'Dancing', 'Cooking',
  'Sports', 'Fitness', 'Art', 'Movies', 'Gaming', 'Yoga',
  'Swimming', 'Hiking', 'Writing', 'Technology'
];