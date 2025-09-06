-- Fix security vulnerability: Restrict audit logs access to admin users only
-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Admins can view audit logs" ON public.audit_logs;

-- Create a new secure policy that only allows admin users to view audit logs
CREATE POLICY "Only admins can view audit logs" 
ON public.audit_logs 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

-- Ensure no other operations are allowed on audit logs for regular users
-- Only system/admin operations should insert audit logs
CREATE POLICY "Only system can insert audit logs" 
ON public.audit_logs 
FOR INSERT 
TO authenticated
WITH CHECK (false); -- Prevent manual inserts, only allow through functions/triggers