-- Make profile-photos bucket public so images can be displayed
UPDATE storage.buckets 
SET public = true 
WHERE id = 'profile-photos';

-- Check if the bucket exists, if not create it
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-photos', 'profile-photos', true)
ON CONFLICT (id) DO UPDATE SET public = true;