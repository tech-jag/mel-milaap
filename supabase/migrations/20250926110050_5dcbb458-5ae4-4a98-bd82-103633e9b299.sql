-- Add photo_privacy_settings column to user_profiles table
ALTER TABLE public.user_profiles 
ADD COLUMN photo_privacy_settings JSONB DEFAULT '{
  "photo_visibility": "community",
  "watermark_enabled": false,
  "blur_for_free_users": true,
  "family_access_photos": false,
  "require_interest_for_photos": false,
  "auto_blur_face": false
}'::jsonb;