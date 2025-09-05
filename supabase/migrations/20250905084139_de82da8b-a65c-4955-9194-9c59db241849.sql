-- Create protected storage bucket for profile photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('profile-photos', 'profile-photos', false, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp']);

-- Create RLS policies for profile photos bucket
CREATE POLICY "Users can view their own profile photos" ON storage.objects
FOR SELECT USING (
  bucket_id = 'profile-photos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can upload their own profile photos" ON storage.objects  
FOR INSERT WITH CHECK (
  bucket_id = 'profile-photos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own profile photos" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'profile-photos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own profile photos" ON storage.objects
FOR DELETE USING (
  bucket_id = 'profile-photos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Create policy for Premium users to view all photos
CREATE POLICY "Premium users can view all profile photos" ON storage.objects
FOR SELECT USING (
  bucket_id = 'profile-photos' AND 
  EXISTS (
    SELECT 1 FROM public.subscriptions s 
    JOIN public.users u ON u.id = s.subject_id
    WHERE u.id = auth.uid() 
    AND s.subject_type = 'user'
    AND s.status = 'active'
    AND s.plan IN ('premium', 'premium_plus')
  )
);

-- Create policy for mutually connected users to view photos
CREATE POLICY "Connected users can view profile photos" ON storage.objects
FOR SELECT USING (
  bucket_id = 'profile-photos' AND 
  EXISTS (
    SELECT 1 FROM public.interests i1
    JOIN public.interests i2 ON (
      i1.from_user_id = i2.to_user_id AND 
      i1.to_user_id = i2.from_user_id
    )
    WHERE (
      i1.from_user_id = auth.uid() AND 
      i1.to_user_id::text = (storage.foldername(name))[1]
    ) OR (
      i2.from_user_id = auth.uid() AND 
      i2.to_user_id::text = (storage.foldername(name))[1]
    )
    AND i1.status = 'accepted' 
    AND i2.status = 'accepted'
  )
);