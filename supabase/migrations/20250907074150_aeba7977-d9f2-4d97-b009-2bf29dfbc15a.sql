-- Fix suppliers table and add proper RLS
ALTER TABLE public.suppliers ALTER COLUMN user_id SET NOT NULL;

-- Add trigger to auto-set user_id for suppliers if not exists
DROP TRIGGER IF EXISTS trg_suppliers_set_user_id ON public.suppliers;
CREATE TRIGGER trg_suppliers_set_user_id
BEFORE INSERT ON public.suppliers
FOR EACH ROW EXECUTE FUNCTION public.set_user_id();

-- Create enum for collaborators (will be used in frontend validation)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'collaborator_role') THEN
    CREATE TYPE collaborator_role AS ENUM ('parent','sibling','partner','close_friend');
  END IF;
END $$;

-- Add proper budget schema (replacing existing table)
DROP TABLE IF EXISTS public.budgets CASCADE;
CREATE TABLE public.budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL DEFAULT 'My Wedding Budget',
  currency TEXT NOT NULL DEFAULT 'AUD', 
  total_budget NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Recreate budget_categories with proper foreign key
DROP TABLE IF EXISTS public.budget_categories CASCADE;
CREATE TABLE public.budget_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_id UUID NOT NULL REFERENCES public.budgets(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  planned_amount NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Update budget_items table structure
ALTER TABLE public.budget_items DROP COLUMN IF EXISTS category;
ALTER TABLE public.budget_items ADD COLUMN IF NOT EXISTS budget_id UUID;

-- Enable RLS on tables
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_categories ENABLE ROW LEVEL SECURITY;

-- Budget RLS policies
CREATE POLICY "Budget ownership" ON public.budgets
FOR ALL TO authenticated
USING (user_id = auth.uid()) 
WITH CHECK (user_id = auth.uid());

-- Budget categories RLS
CREATE POLICY "Budget categories ownership" ON public.budget_categories
FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.budgets b WHERE b.id = budget_id AND b.user_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.budgets b WHERE b.id = budget_id AND b.user_id = auth.uid()));

-- Budget items RLS (updated to use budget_id)
DROP POLICY IF EXISTS "Budget items are per user" ON public.budget_items;
CREATE POLICY "Budget items ownership" ON public.budget_items
FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.budgets b WHERE b.id = budget_id AND b.user_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.budgets b WHERE b.id = budget_id AND b.user_id = auth.uid()));

-- Add updated_at triggers
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
  SELECT id INTO budget_id FROM public.budgets WHERE user_id = p_user_id LIMIT 1;
  
  IF budget_id IS NULL THEN
    INSERT INTO public.budgets (user_id, name, currency)
    VALUES (p_user_id, 'My Wedding Budget', 'AUD')
    RETURNING id INTO budget_id;
    
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