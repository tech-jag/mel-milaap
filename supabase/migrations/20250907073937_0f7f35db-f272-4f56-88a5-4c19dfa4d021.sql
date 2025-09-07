-- Fix suppliers table and add proper RLS
ALTER TABLE public.suppliers ALTER COLUMN user_id SET NOT NULL;

-- Add trigger to auto-set user_id for suppliers
DROP TRIGGER IF EXISTS trg_suppliers_set_user_id ON public.suppliers;
CREATE TRIGGER trg_suppliers_set_user_id
BEFORE INSERT ON public.suppliers
FOR EACH ROW EXECUTE FUNCTION public.set_user_id();

-- Fix collaborators with proper enum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'collaborator_role') THEN
    CREATE TYPE collaborator_role AS ENUM ('parent','sibling','partner','close_friend');
  END IF;
END $$;

-- Update collaborators table structure
ALTER TABLE public.collaborators 
  ALTER COLUMN role TYPE collaborator_role USING LOWER(role)::collaborator_role;

-- Add proper budget schema
CREATE TABLE IF NOT EXISTS public.budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL DEFAULT 'My Wedding Budget',
  currency TEXT NOT NULL DEFAULT 'AUD',
  total_budget NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.budget_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_id UUID NOT NULL REFERENCES public.budgets(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  planned_amount NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add registry tables
CREATE TABLE IF NOT EXISTS public.gift_registries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  url TEXT,
  target_amount NUMERIC,
  purchased_amount NUMERIC DEFAULT 0,
  image_url TEXT,
  is_public BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  contributors JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  wedding_id UUID
);

-- Enable RLS on all tables
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gift_registries ENABLE ROW LEVEL SECURITY;

-- Budget RLS policies
DROP POLICY IF EXISTS ins_budgets_self ON public.budgets;
CREATE POLICY ins_budgets_self ON public.budgets FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS sel_budgets_self ON public.budgets;
CREATE POLICY sel_budgets_self ON public.budgets FOR SELECT TO authenticated
USING (user_id = auth.uid());

DROP POLICY IF EXISTS upd_budgets_self ON public.budgets;
CREATE POLICY upd_budgets_self ON public.budgets FOR UPDATE TO authenticated
USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Budget categories RLS
DROP POLICY IF EXISTS sel_cats ON public.budget_categories;
CREATE POLICY sel_cats ON public.budget_categories FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.budgets b WHERE b.id = budget_id AND b.user_id = auth.uid()));

DROP POLICY IF EXISTS ins_cats ON public.budget_categories;
CREATE POLICY ins_cats ON public.budget_categories FOR INSERT TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM public.budgets b WHERE b.id = budget_id AND b.user_id = auth.uid()));

DROP POLICY IF EXISTS upd_cats ON public.budget_categories;
CREATE POLICY upd_cats ON public.budget_categories FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM public.budgets b WHERE b.id = budget_id AND b.user_id = auth.uid()));

-- Budget items RLS (using existing table structure)
DROP POLICY IF EXISTS sel_items ON public.budget_items;
CREATE POLICY sel_items ON public.budget_items FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.budgets b WHERE b.id = budget_id AND b.user_id = auth.uid()));

DROP POLICY IF EXISTS ins_items ON public.budget_items;
CREATE POLICY ins_items ON public.budget_items FOR INSERT TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM public.budgets b WHERE b.id = budget_id AND b.user_id = auth.uid()));

DROP POLICY IF EXISTS upd_items ON public.budget_items;
CREATE POLICY upd_items ON public.budget_items FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM public.budgets b WHERE b.id = budget_id AND b.user_id = auth.uid()));

-- Gift registry RLS
DROP POLICY IF EXISTS registry_per_user ON public.gift_registries;
CREATE POLICY registry_per_user ON public.gift_registries FOR ALL TO authenticated
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS public_registries_readable ON public.gift_registries;
CREATE POLICY public_registries_readable ON public.gift_registries FOR SELECT TO authenticated
USING (is_public = true);

-- Add updated_at triggers
DROP TRIGGER IF EXISTS update_budgets_updated_at ON public.budgets;
CREATE TRIGGER update_budgets_updated_at
BEFORE UPDATE ON public.budgets
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to ensure user has a budget
CREATE OR REPLACE FUNCTION public.ensure_user_budget(p_user_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  budget_id UUID;
BEGIN
  -- Check if user already has a budget
  SELECT id INTO budget_id FROM public.budgets WHERE user_id = p_user_id LIMIT 1;
  
  IF budget_id IS NULL THEN
    -- Create default budget
    INSERT INTO public.budgets (user_id, name, currency)
    VALUES (p_user_id, 'My Wedding Budget', 'AUD')
    RETURNING id INTO budget_id;
    
    -- Add default categories
    INSERT INTO public.budget_categories (budget_id, name, sort_order, planned_amount) VALUES
    (budget_id, 'Venue', 1, 0),
    (budget_id, 'Catering', 2, 0),
    (budget_id, 'Photography', 3, 0),
    (budget_id, 'Attire', 4, 0),
    (budget_id, 'Flowers & Decor', 5, 0),
    (budget_id, 'Music & Entertainment', 6, 0),
    (budget_id, 'Transportation', 7, 0),
    (budget_id, 'Miscellaneous', 8, 0);
  END IF;
  
  RETURN budget_id;
END;
$$;