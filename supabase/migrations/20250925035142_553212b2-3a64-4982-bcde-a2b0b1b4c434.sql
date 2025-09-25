-- Create comprehensive RLS policies for matrimonial platform security

-- 1. Enhanced profiles table RLS policies
DROP POLICY IF EXISTS "Users can read their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Add visibility column to profiles if it doesn't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'visibility') THEN
    ALTER TABLE public.profiles ADD COLUMN visibility text DEFAULT 'community' CHECK (visibility IN ('public', 'community', 'premium', 'private'));
  END IF;
END $$;

-- Users can manage their own profiles
CREATE POLICY "Users can manage own profile" ON public.profiles
FOR ALL USING (auth.uid() = user_id);

-- Profile visibility based on privacy settings and user type
CREATE POLICY "Profile visibility control" ON public.profiles
FOR SELECT USING (
  auth.uid() = user_id OR -- Own profile
  (
    CASE 
      WHEN visibility = 'public' THEN true
      WHEN visibility = 'community' THEN auth.uid() IS NOT NULL
      WHEN visibility = 'premium' THEN (
        auth.uid() IS NOT NULL AND (
          EXISTS (SELECT 1 FROM subscriptions WHERE subject_id = auth.uid() AND subject_type = 'user' AND status = 'active') OR
          EXISTS (SELECT 1 FROM interests WHERE (sender_id = auth.uid() AND receiver_id = profiles.user_id) OR (sender_id = profiles.user_id AND receiver_id = auth.uid()) AND status = 'accepted')
        )
      )
      WHEN visibility = 'private' THEN (
        EXISTS (SELECT 1 FROM interests WHERE (sender_id = auth.uid() AND receiver_id = profiles.user_id) OR (sender_id = profiles.user_id AND receiver_id = auth.uid()) AND status = 'accepted')
      )
      ELSE false
    END
  )
);

-- 2. Enhanced profile_photos table RLS policies
DROP POLICY IF EXISTS "Users can manage their own photos" ON public.profile_photos;

CREATE POLICY "Users can manage own photos" ON public.profile_photos
FOR ALL USING (auth.uid() = user_id);

-- Photo visibility based on profile privacy
CREATE POLICY "Photo visibility control" ON public.profile_photos
FOR SELECT USING (
  auth.uid() = user_id OR -- Own photos
  EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.user_id = profile_photos.user_id 
    AND (
      p.visibility = 'public' OR
      (p.visibility = 'community' AND auth.uid() IS NOT NULL) OR
      (p.visibility = 'premium' AND (
        EXISTS (SELECT 1 FROM subscriptions WHERE subject_id = auth.uid() AND subject_type = 'user' AND status = 'active') OR
        EXISTS (SELECT 1 FROM interests WHERE (sender_id = auth.uid() AND receiver_id = p.user_id) OR (sender_id = p.user_id AND receiver_id = auth.uid()) AND status = 'accepted')
      )) OR
      (p.visibility = 'private' AND 
        EXISTS (SELECT 1 FROM interests WHERE (sender_id = auth.uid() AND receiver_id = p.user_id) OR (sender_id = p.user_id AND receiver_id = auth.uid()) AND status = 'accepted')
      )
    )
  )
);

-- 3. Enhanced interests table RLS policies
DROP POLICY IF EXISTS "insert_own_interest" ON public.interests;
DROP POLICY IF EXISTS "read_interests_involved" ON public.interests;

CREATE POLICY "Users can send interests" ON public.interests
FOR INSERT WITH CHECK (
  auth.uid() = sender_id AND
  -- Check daily interest limit (max 10 per day)
  (SELECT COUNT(*) FROM interests WHERE sender_id = auth.uid() AND created_at > current_date) < 10 AND
  -- Cannot send interest to blocked users
  NOT EXISTS (SELECT 1 FROM blocked_users WHERE blocker_user_id = receiver_id AND blocked_user_id = auth.uid()) AND
  -- Check if receiver profile is visible
  EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.user_id = interests.receiver_id 
    AND (
      p.visibility = 'public' OR
      (p.visibility = 'community' AND auth.uid() IS NOT NULL) OR
      (p.visibility = 'premium' AND 
        EXISTS (SELECT 1 FROM subscriptions WHERE subject_id = auth.uid() AND subject_type = 'user' AND status = 'active')
      )
    )
  )
);

CREATE POLICY "Users can view own interests" ON public.interests
FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can update received interests" ON public.interests
FOR UPDATE USING (auth.uid() = receiver_id);

-- 4. Enhanced messages table RLS policies
DROP POLICY IF EXISTS "insert_own_message" ON public.messages;
DROP POLICY IF EXISTS "read_messages" ON public.messages;

CREATE POLICY "Users can send messages" ON public.messages
FOR INSERT WITH CHECK (
  auth.uid() = sender_id AND
  -- Can only message after mutual interest accepted
  EXISTS (
    SELECT 1 FROM interests 
    WHERE ((sender_id = auth.uid() AND receiver_id = messages.receiver_id) OR 
           (sender_id = messages.receiver_id AND receiver_id = auth.uid())) 
    AND status = 'accepted'
  ) AND
  -- Cannot message blocked users
  NOT EXISTS (SELECT 1 FROM blocked_users WHERE blocker_user_id = messages.receiver_id AND blocked_user_id = auth.uid())
);

CREATE POLICY "Users can view own messages" ON public.messages
FOR SELECT USING (
  (auth.uid() = sender_id OR auth.uid() = receiver_id) AND
  -- Only after mutual interest accepted
  EXISTS (
    SELECT 1 FROM interests 
    WHERE ((sender_id = auth.uid() AND receiver_id = CASE WHEN messages.sender_id = auth.uid() THEN messages.receiver_id ELSE messages.sender_id END) OR 
           (sender_id = CASE WHEN messages.sender_id = auth.uid() THEN messages.receiver_id ELSE messages.sender_id END AND receiver_id = auth.uid())) 
    AND status = 'accepted'
  )
);