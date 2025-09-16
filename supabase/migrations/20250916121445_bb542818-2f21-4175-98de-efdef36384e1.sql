-- Fix critical security vulnerability: Remove public access to user_profiles table
-- This table contains highly sensitive personal information that should never be publicly accessible

-- First, drop the dangerous public policy that allows anyone to read profiles
DROP POLICY IF EXISTS "Public profiles can be viewed by profile_id" ON public.user_profiles;

-- Drop existing duplicate policies to avoid conflicts
DROP POLICY IF EXISTS "profiles_select_own" ON public.user_profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.user_profiles;  
DROP POLICY IF EXISTS "profiles_update_own" ON public.user_profiles;

-- Create proper RLS policies for user_profiles table

-- Policy 1: Users can view their own profile
CREATE POLICY "Users can view their own profile"
  ON public.user_profiles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy 2: Users can insert their own profile  
CREATE POLICY "Users can insert their own profile"
  ON public.user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy 3: Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON public.user_profiles
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy 4: Allow authenticated users to view profiles when there's mutual interest or during matching
-- This is for legitimate matchmaking functionality while protecting privacy
CREATE POLICY "Authenticated users can view profiles for matching"
  ON public.user_profiles
  FOR SELECT
  TO authenticated
  USING (
    -- Allow viewing if there's an interest record between users (mutual visibility for matching)
    EXISTS (
      SELECT 1 FROM public.interests 
      WHERE (sender_id = auth.uid() AND receiver_id = user_profiles.user_id)
         OR (receiver_id = auth.uid() AND sender_id = user_profiles.user_id)
    )
  );

-- Ensure RLS is enabled on the table
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;