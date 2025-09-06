-- Fix security vulnerability: Restrict feedback messages access to admin users only
-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Admins can view all feedback" ON public.feedback_messages;

-- Create a new secure policy that only allows admin users to view feedback messages
CREATE POLICY "Only admins can view feedback messages" 
ON public.feedback_messages 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

-- Keep the existing insert policy for public feedback submissions
-- (Anyone can submit feedback policy is already correct)