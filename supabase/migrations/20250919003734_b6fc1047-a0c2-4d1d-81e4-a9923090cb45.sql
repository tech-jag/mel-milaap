-- Add missing columns to partner_preferences table
ALTER TABLE public.partner_preferences 
ADD COLUMN marital_statuses TEXT[],
ADD COLUMN has_children TEXT;