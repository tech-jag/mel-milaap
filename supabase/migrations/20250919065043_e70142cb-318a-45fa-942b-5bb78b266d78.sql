-- Add new columns to existing user_profiles table for enhanced functionality
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS profile_completion_percentage INTEGER DEFAULT 0;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS social_media_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS professional_verified BOOLEAN DEFAULT FALSE;

-- Contact preferences table
CREATE TABLE IF NOT EXISTS contact_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  who_can_message TEXT DEFAULT 'premium-only', -- 'anyone', 'premium-only', 'liked-only', 'hidden'
  phone_visibility TEXT DEFAULT 'premium-connections', -- 'never', 'premium-connections', 'mutual-interest', 'always'
  auto_response_enabled BOOLEAN DEFAULT FALSE,
  auto_response_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced astro details (add to existing partner_preferences table if columns don't exist)
ALTER TABLE partner_preferences ADD COLUMN IF NOT EXISTS mangal_dosha TEXT;
ALTER TABLE partner_preferences ADD COLUMN IF NOT EXISTS horoscope_matching_importance TEXT;
ALTER TABLE partner_preferences ADD COLUMN IF NOT EXISTS lifestyle_preferences JSONB DEFAULT '[]'::jsonb;
ALTER TABLE partner_preferences ADD COLUMN IF NOT EXISTS preferred_countries TEXT[];
ALTER TABLE partner_preferences ADD COLUMN IF NOT EXISTS willing_to_relocate TEXT;
ALTER TABLE partner_preferences ADD COLUMN IF NOT EXISTS deal_breakers TEXT;

-- User activity tracking
CREATE TABLE IF NOT EXISTS user_activity_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  profile_views_count INTEGER DEFAULT 0,
  interests_sent_count INTEGER DEFAULT 0,
  interests_received_count INTEGER DEFAULT 0,
  matches_count INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced verification tracking
CREATE TABLE IF NOT EXISTS verification_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  verification_type TEXT NOT NULL, -- 'phone', 'email', 'id_document', 'social_media', 'professional'
  status TEXT DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verified_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  document_url TEXT
);

-- Enable RLS on new tables
ALTER TABLE contact_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_records ENABLE ROW LEVEL SECURITY;

-- RLS policies for contact_preferences
CREATE POLICY "Users can manage their own contact preferences" 
ON contact_preferences 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- RLS policies for user_activity_stats
CREATE POLICY "Users can view their own activity stats" 
ON user_activity_stats 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own activity stats" 
ON user_activity_stats 
FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS policies for verification_records
CREATE POLICY "Users can manage their own verification records" 
ON verification_records 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_contact_preferences_user_id ON contact_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_stats_user_id ON user_activity_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_verification_records_user_id ON verification_records(user_id);
CREATE INDEX IF NOT EXISTS idx_verification_records_type ON verification_records(user_id, verification_type);

-- Create function to initialize user activity stats
CREATE OR REPLACE FUNCTION initialize_user_activity_stats()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_activity_stats (user_id)
  VALUES (NEW.user_id)
  ON CONFLICT (user_id) DO NOTHING;
  
  INSERT INTO contact_preferences (user_id)
  VALUES (NEW.user_id)
  ON CONFLICT DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to initialize stats when user profile is created
CREATE OR REPLACE TRIGGER trigger_initialize_user_stats
  AFTER INSERT ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION initialize_user_activity_stats();