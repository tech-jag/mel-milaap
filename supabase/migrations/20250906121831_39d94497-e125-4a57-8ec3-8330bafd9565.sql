-- Fix security vulnerability: Restrict contact messages access to admin users only
-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Admins can read all contact messages" ON public.contact_messages;

-- Create a new secure policy that only allows admin users to view contact messages
CREATE POLICY "Only admins can read contact messages" 
ON public.contact_messages 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

-- Keep the existing insert policy for public contact form submissions
-- (Anyone can submit contact messages policy is already correct)