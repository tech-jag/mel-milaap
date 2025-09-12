-- Create early access registrations table for users
CREATE TABLE public.early_access_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  mobile TEXT,
  city TEXT,
  state TEXT,
  relationship_status TEXT, -- single, engaged, etc
  role TEXT NOT NULL, -- bride, groom, parent, relative
  desired_features TEXT[], -- array of features they want to see
  additional_comments TEXT,
  referral_source TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT unique_early_access_email UNIQUE (email)
);

-- Create early access registrations table for suppliers
CREATE TABLE public.early_access_suppliers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  email TEXT NOT NULL,
  mobile TEXT,
  city TEXT,
  state TEXT,
  business_category TEXT NOT NULL, -- photography, catering, venue, etc
  years_experience INTEGER,
  current_client_base TEXT, -- small, medium, large
  desired_features TEXT[], -- array of features they want to see
  additional_comments TEXT,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT unique_early_supplier_email UNIQUE (email)
);

-- Enable Row Level Security
ALTER TABLE public.early_access_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.early_access_suppliers ENABLE ROW LEVEL SECURITY;

-- Create policies to allow anyone to insert (for registration)
CREATE POLICY "Anyone can register for early access" 
ON public.early_access_users 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can register as supplier" 
ON public.early_access_suppliers 
FOR INSERT 
WITH CHECK (true);

-- Only admins can view the registrations (for future admin panel)
CREATE POLICY "Only admins can view early access users" 
ON public.early_access_users 
FOR SELECT 
USING (false); -- Will be updated when admin system is ready

CREATE POLICY "Only admins can view early access suppliers" 
ON public.early_access_suppliers 
FOR SELECT 
USING (false); -- Will be updated when admin system is ready