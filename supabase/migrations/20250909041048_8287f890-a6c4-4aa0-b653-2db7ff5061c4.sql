-- Create profiles table for comprehensive user data
CREATE TABLE IF NOT EXISTS public.profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_manager TEXT CHECK (profile_manager IN ('self','parent','sibling','other')) DEFAULT 'self',
  manager_relation TEXT,
  first_name TEXT,
  last_name TEXT,
  gender TEXT,
  dob DATE,
  height_cm INTEGER,
  marital_status TEXT,
  has_children BOOLEAN DEFAULT false,
  religion TEXT,
  caste_community TEXT,
  mother_tongue TEXT,
  education_level TEXT,
  education_field TEXT,
  education_institution TEXT,
  profession_title TEXT,
  industry TEXT,
  company TEXT,
  income_range TEXT,
  employment_type TEXT,
  country_of_residence TEXT,
  city TEXT,
  citizenship TEXT,
  visa_status TEXT,
  willing_to_relocate BOOLEAN,
  family_type TEXT,
  family_values TEXT,
  father_occupation TEXT,
  mother_occupation TEXT,
  siblings_count INTEGER,
  diet TEXT,
  smoke TEXT,
  drink TEXT,
  hobbies TEXT[],
  bio TEXT,
  photo_primary_url TEXT,
  email_verified BOOLEAN DEFAULT false,
  phone_verified BOOLEAN DEFAULT false,
  visibility_photos TEXT DEFAULT 'all',
  visibility_last_seen BOOLEAN DEFAULT true,
  messaging_policy TEXT DEFAULT 'all',
  onboarding_completed BOOLEAN DEFAULT false,
  managed_by_user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create partner preferences table
CREATE TABLE IF NOT EXISTS public.partner_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  age_min INTEGER,
  age_max INTEGER,
  height_min_cm INTEGER,
  height_max_cm INTEGER,
  countries TEXT[],
  states TEXT[],
  cities TEXT[],
  education_levels TEXT[],
  industries TEXT[],
  professions TEXT[],
  religions TEXT[],
  communities TEXT[],
  mother_tongues TEXT[],
  diet TEXT[],
  smoke TEXT[],
  drink TEXT[],
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create profile photos table
CREATE TABLE IF NOT EXISTS public.profile_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create onboarding progress table for autosave/resume
CREATE TABLE IF NOT EXISTS public.onboarding_progress (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_step INTEGER DEFAULT 0,
  draft JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create storage bucket for profile photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('profile-photos', 'profile-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_progress ENABLE ROW LEVEL SECURITY;

-- RLS policies for profiles
CREATE POLICY "Users can read their own profile" ON public.profiles 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles 
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS policies for partner preferences
CREATE POLICY "Users can read their own preferences" ON public.partner_preferences 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own preferences" ON public.partner_preferences 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own preferences" ON public.partner_preferences 
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS policies for profile photos
CREATE POLICY "Users can manage their own photos" ON public.profile_photos 
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- RLS policies for onboarding progress
CREATE POLICY "Users can manage their own onboarding progress" ON public.onboarding_progress 
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Storage policies for profile photos
CREATE POLICY "Profile photos are publicly viewable" ON storage.objects 
  FOR SELECT USING (bucket_id = 'profile-photos');
CREATE POLICY "Users can upload their own profile photos" ON storage.objects 
  FOR INSERT WITH CHECK (bucket_id = 'profile-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can update their own profile photos" ON storage.objects 
  FOR UPDATE USING (bucket_id = 'profile-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete their own profile photos" ON storage.objects 
  FOR DELETE USING (bucket_id = 'profile-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_partner_preferences_updated_at
  BEFORE UPDATE ON public.partner_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_onboarding_progress_updated_at
  BEFORE UPDATE ON public.onboarding_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();