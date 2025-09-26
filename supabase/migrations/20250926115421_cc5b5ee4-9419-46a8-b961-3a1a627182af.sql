-- Fix database constraints and RLS policies for signup process

-- 1. Clean up duplicate contact_preferences records (keep the earliest one)
DELETE FROM contact_preferences 
WHERE id NOT IN (
  SELECT DISTINCT ON (user_id) id 
  FROM contact_preferences 
  ORDER BY user_id, created_at ASC
);

-- 2. Add unique constraint on user_id in contact_preferences
ALTER TABLE contact_preferences ADD CONSTRAINT contact_preferences_user_id_unique UNIQUE (user_id);

-- 3. Enable RLS on terms_of_service table
ALTER TABLE terms_of_service ENABLE ROW LEVEL SECURITY;

-- 4. Add missing RLS policies for photos table
CREATE POLICY "Users can manage their own photos" 
ON photos 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Allow viewing approved photos (simplified - users can see approved photos if profile is visible)
CREATE POLICY "Users can view approved photos" 
ON photos 
FOR SELECT 
USING (
  is_approved = true AND 
  (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM user_profiles p 
      WHERE p.user_id = photos.user_id 
      AND p.profile_ready = true
    )
  )
);

-- 5. Add RLS policies for terms_of_service (everyone can read, only admins can modify)
CREATE POLICY "Anyone can read terms of service" 
ON terms_of_service 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can manage terms of service" 
ON terms_of_service 
FOR ALL 
USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));