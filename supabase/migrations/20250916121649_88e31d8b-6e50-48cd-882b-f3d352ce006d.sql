-- Fix critical security vulnerability: Remove public access to user_profiles table
-- This removes the dangerous policy that allows public access to sensitive personal information

-- Drop the dangerous public policy that allows anyone to read profiles
DROP POLICY IF EXISTS "Public profiles can be viewed by profile_id" ON public.user_profiles;

-- Remove duplicate policies to clean up
DROP POLICY IF EXISTS "profiles_select_own" ON public.user_profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.user_profiles;  
DROP POLICY IF EXISTS "profiles_update_own" ON public.user_profiles;

-- Ensure RLS is enabled on the table
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;