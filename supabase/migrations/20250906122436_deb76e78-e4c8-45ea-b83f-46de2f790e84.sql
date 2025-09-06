-- Fix security vulnerability: Strengthen guest list RLS policies
-- Drop existing policies to recreate with better security
DROP POLICY IF EXISTS "owner_can_create_guests" ON public.guest_list;
DROP POLICY IF EXISTS "owner_can_delete_guests" ON public.guest_list;
DROP POLICY IF EXISTS "owner_can_read_guests" ON public.guest_list;
DROP POLICY IF EXISTS "owner_can_update_guests" ON public.guest_list;

-- Create new secure policies that only allow authenticated users
CREATE POLICY "Authenticated users can create their own guests" 
ON public.guest_list 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id AND user_id IS NOT NULL);

CREATE POLICY "Authenticated users can read their own guests" 
ON public.guest_list 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id AND user_id IS NOT NULL);

CREATE POLICY "Authenticated users can update their own guests" 
ON public.guest_list 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id AND user_id IS NOT NULL)
WITH CHECK (auth.uid() = user_id AND user_id IS NOT NULL);

CREATE POLICY "Authenticated users can delete their own guests" 
ON public.guest_list 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id AND user_id IS NOT NULL);

-- Ensure user_id cannot be null for data integrity
ALTER TABLE public.guest_list 
ALTER COLUMN user_id SET NOT NULL;