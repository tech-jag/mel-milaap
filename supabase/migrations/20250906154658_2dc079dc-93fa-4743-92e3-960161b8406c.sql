-- Fix and create all planning-related tables with proper structure and RLS policies

-- 1. Ensure proper budget structure (may already exist, use IF NOT EXISTS)
CREATE TABLE IF NOT EXISTS public.budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  wedding_id UUID NULL, -- will reference weddings table when created
  name TEXT NOT NULL DEFAULT 'Wedding Budget',
  total_budget NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.budget_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_id UUID NOT NULL,
  category TEXT NOT NULL,
  planned_amount NUMERIC DEFAULT 0,
  actual_amount NUMERIC DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Create proper guests table (separate from existing guest_list tables)
CREATE TABLE IF NOT EXISTS public.guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  wedding_id UUID NULL, -- will reference weddings table when created
  full_name TEXT NOT NULL,
  side TEXT CHECK (side IN ('self','partner','both')) DEFAULT 'self',
  email TEXT,
  phone TEXT,
  group_name TEXT,
  rsvp_status TEXT CHECK (rsvp_status IN ('unknown','yes','no','maybe')) DEFAULT 'unknown',
  invite_sent BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Create wedding timeline items table
CREATE TABLE IF NOT EXISTS public.wedding_timeline_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  wedding_id UUID NULL, -- will reference weddings table when created
  title TEXT NOT NULL,
  due_on DATE NOT NULL,
  status TEXT CHECK (status IN ('todo','doing','done')) DEFAULT 'todo',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Create gift registries table
CREATE TABLE IF NOT EXISTS public.gift_registries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  wedding_id UUID NULL, -- will reference weddings table when created
  type TEXT CHECK (type IN ('external','cash')) NOT NULL,
  title TEXT NOT NULL,
  url TEXT, -- for external
  description TEXT,
  target_amount NUMERIC, -- for cash
  is_public BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Create weddings table for the Find → Plan journey
CREATE TABLE IF NOT EXISTS public.weddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  partner_name TEXT,
  event_date DATE,
  venue TEXT,
  timezone TEXT DEFAULT 'Australia/Sydney',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Add planning phase columns to users table (if they don't exist)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='planning_phase') THEN
    ALTER TABLE public.users ADD COLUMN planning_phase TEXT CHECK (planning_phase IN ('discover','planning','married')) DEFAULT 'discover';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='subscription_tier') THEN
    ALTER TABLE public.users ADD COLUMN subscription_tier TEXT CHECK (subscription_tier IN ('free','member_49','member_99','supplier_free','supplier_featured','supplier_premium','legacy')) DEFAULT 'free';
  END IF;
END $$;

-- 7. Create posts table for blog/advice section
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  body TEXT, -- or JSON for blocks/MDX content
  cover_url TEXT,
  seo_title TEXT,
  seo_description TEXT,
  status TEXT CHECK (status IN ('draft','published')) DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. Create analytics events table
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event TEXT NOT NULL,
  payload JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_timeline_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gift_registries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Budgets policies
CREATE POLICY "Budgets are per user" ON public.budgets
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Budget items policies (through budget ownership)
CREATE POLICY "Budget items are per user" ON public.budget_items
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.budgets WHERE budgets.id = budget_items.budget_id AND budgets.user_id = auth.uid())
  );

-- Guests policies
CREATE POLICY "Guests are per user" ON public.guests
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Timeline items policies  
CREATE POLICY "Timeline per user" ON public.wedding_timeline_items
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Gift registry policies
CREATE POLICY "Registry per user" ON public.gift_registries
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow public read access for public registries
CREATE POLICY "Public registries readable" ON public.gift_registries
  FOR SELECT USING (is_public = true);

-- Weddings policies
CREATE POLICY "Weddings per user" ON public.weddings
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Posts policies (public read for published, admin write)
CREATE POLICY "Anyone can read published posts" ON public.posts
  FOR SELECT USING (status = 'published');

-- Analytics events policies
CREATE POLICY "Users can insert their own events" ON public.analytics_events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own events" ON public.analytics_events
  FOR SELECT USING (auth.uid() = user_id);

-- Add foreign key constraints where missing
DO $$
BEGIN
  -- Add foreign key for budget_items if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'budget_items_budget_id_fkey') THEN
    ALTER TABLE public.budget_items ADD CONSTRAINT budget_items_budget_id_fkey 
    FOREIGN KEY (budget_id) REFERENCES public.budgets(id) ON DELETE CASCADE;
  END IF;
END $$;