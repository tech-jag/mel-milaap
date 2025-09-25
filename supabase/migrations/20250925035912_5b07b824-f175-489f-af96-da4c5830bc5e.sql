-- Add privacy-related columns to profiles table
DO $$ 
BEGIN 
  -- Add photo_visibility column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'photo_visibility') THEN
    ALTER TABLE public.profiles ADD COLUMN photo_visibility text DEFAULT 'all' CHECK (photo_visibility IN ('all', 'premium', 'mutual'));
  END IF;
  
  -- Add contact_visibility column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'contact_visibility') THEN
    ALTER TABLE public.profiles ADD COLUMN contact_visibility text DEFAULT 'premium' CHECK (contact_visibility IN ('all', 'premium', 'mutual'));
  END IF;
  
  -- Add view_tracking_enabled column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'view_tracking_enabled') THEN
    ALTER TABLE public.profiles ADD COLUMN view_tracking_enabled boolean DEFAULT true;
  END IF;
END $$;