-- Phase 1: Create comprehensive planning and collaboration tables

-- Add collaborative access table for parent-child sharing
CREATE TABLE IF NOT EXISTS public.collaborators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inviter_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invitee_email TEXT NOT NULL,
  invitee_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('parent', 'child', 'partner', 'planner')) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'accepted', 'declined')) DEFAULT 'pending',
  permissions JSONB DEFAULT '{"view_profile": true, "edit_profile": false, "view_planning": true, "edit_planning": false}'::jsonb,
  invitation_token TEXT UNIQUE,
  invitation_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(inviter_user_id, invitee_email)
);

-- Enhanced users table for planning phase tracking
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS planning_phase TEXT CHECK (planning_phase IN ('discover', 'planning', 'married')) DEFAULT 'discover',
ADD COLUMN IF NOT EXISTS subscription_tier TEXT CHECK (subscription_tier IN ('free', 'member_49', 'member_99', 'supplier_free', 'supplier_featured', 'supplier_premium')) DEFAULT 'free',
ADD COLUMN IF NOT EXISTS partner_name TEXT,
ADD COLUMN IF NOT EXISTS wedding_date DATE,
ADD COLUMN IF NOT EXISTS venue_location TEXT;

-- Enhanced budget_items table structure
ALTER TABLE public.budget_items 
ADD COLUMN IF NOT EXISTS booked_amount NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS vendor_name TEXT,
ADD COLUMN IF NOT EXISTS vendor_contact TEXT,
ADD COLUMN IF NOT EXISTS status TEXT CHECK (status IN ('planning', 'quoted', 'booked', 'paid')) DEFAULT 'planning';

-- Supplier dashboard and CRM tables
CREATE TABLE IF NOT EXISTS public.supplier_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  event_date DATE,
  budget_range TEXT,
  message TEXT,
  status TEXT CHECK (status IN ('new', 'contacted', 'quoted', 'won', 'lost', 'archived')) DEFAULT 'new',
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  source TEXT DEFAULT 'platform',
  notes TEXT,
  follow_up_date DATE,
  value_estimate NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Supplier branded pages
CREATE TABLE IF NOT EXISTS public.supplier_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE UNIQUE,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  banner_url TEXT,
  about_section TEXT,
  services_section TEXT,
  packages JSONB DEFAULT '[]'::jsonb,
  gallery_images TEXT[] DEFAULT '{}',
  video_url TEXT,
  contact_form_enabled BOOLEAN DEFAULT true,
  custom_css TEXT,
  is_published BOOLEAN DEFAULT false,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Blog/articles table for content management
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image TEXT,
  category TEXT DEFAULT 'Planning',
  tags TEXT[] DEFAULT '{}',
  author_name TEXT NOT NULL,
  author_id UUID REFERENCES auth.users(id),
  seo_title TEXT,
  seo_description TEXT,
  status TEXT CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  read_time_minutes INTEGER DEFAULT 5,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User favorites for suppliers, articles, etc.
ALTER TABLE public.favorites 
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- Enhanced timeline items with priorities and assignments
ALTER TABLE public.wedding_timeline_items 
ADD COLUMN IF NOT EXISTS priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
ADD COLUMN IF NOT EXISTS assigned_to TEXT,
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS description TEXT;

-- Gift registry enhancements
ALTER TABLE public.gift_registries 
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS purchased_amount NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS contributors JSONB DEFAULT '[]'::jsonb;

-- Enable RLS on all new tables
ALTER TABLE public.collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for collaborators
CREATE POLICY "Users can manage their own collaborations" ON public.collaborators
  FOR ALL USING (auth.uid() = inviter_user_id OR auth.uid() = invitee_user_id);

CREATE POLICY "Users can view collaboration invites" ON public.collaborators
  FOR SELECT USING (auth.uid() = inviter_user_id OR auth.uid() = invitee_user_id);

-- RLS Policies for supplier leads
CREATE POLICY "Suppliers can manage their leads" ON public.supplier_leads
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.suppliers WHERE id = supplier_leads.supplier_id AND user_id = auth.uid())
  );

-- RLS Policies for supplier pages
CREATE POLICY "Suppliers can manage their pages" ON public.supplier_pages
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.suppliers WHERE id = supplier_pages.supplier_id AND user_id = auth.uid())
  );

CREATE POLICY "Anyone can view published supplier pages" ON public.supplier_pages
  FOR SELECT USING (is_published = true);

-- RLS Policies for articles
CREATE POLICY "Anyone can read published articles" ON public.articles
  FOR SELECT USING (status = 'published');

CREATE POLICY "Authors can manage their articles" ON public.articles
  FOR ALL USING (auth.uid() = author_id);

-- Update triggers for updated_at columns
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
DROP TRIGGER IF EXISTS update_collaborators_updated_at ON public.collaborators;
CREATE TRIGGER update_collaborators_updated_at
  BEFORE UPDATE ON public.collaborators
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_supplier_leads_updated_at ON public.supplier_leads;
CREATE TRIGGER update_supplier_leads_updated_at
  BEFORE UPDATE ON public.supplier_leads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_supplier_pages_updated_at ON public.supplier_pages;
CREATE TRIGGER update_supplier_pages_updated_at
  BEFORE UPDATE ON public.supplier_pages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_articles_updated_at ON public.articles;
CREATE TRIGGER update_articles_updated_at
  BEFORE UPDATE ON public.articles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();