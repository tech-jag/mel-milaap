-- Fix suppliers table and add proper RLS
ALTER TABLE public.suppliers ALTER COLUMN user_id SET NOT NULL;

-- Add trigger to auto-set user_id for suppliers if not exists
DROP TRIGGER IF EXISTS trg_suppliers_set_user_id ON public.suppliers;
CREATE TRIGGER trg_suppliers_set_user_id
BEFORE INSERT ON public.suppliers
FOR EACH ROW EXECUTE FUNCTION public.set_user_id();

-- Create collaborator role enum first
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'collaborator_role') THEN
    CREATE TYPE collaborator_role AS ENUM ('parent','sibling','partner','close_friend');
  END IF;
END $$;

-- For collaborators, simply drop and recreate with proper type
DROP TABLE IF EXISTS public.collaborators CASCADE;
CREATE TABLE public.collaborators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inviter_user_id UUID NOT NULL,
  invitee_user_id UUID,
  invitee_email TEXT NOT NULL,
  role collaborator_role NOT NULL,
  status TEXT DEFAULT 'pending',
  permissions JSONB DEFAULT '{"edit_profile": false, "view_profile": true, "edit_planning": false, "view_planning": true}'::jsonb,
  invitation_token TEXT,
  invitation_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS and add policies for collaborators
ALTER TABLE public.collaborators ENABLE ROW LEVEL SECURITY;

CREATE POLICY ins_collab_self ON public.collaborators FOR INSERT TO authenticated
WITH CHECK (inviter_user_id = auth.uid());

CREATE POLICY sel_collab_self ON public.collaborators FOR SELECT TO authenticated
USING (inviter_user_id = auth.uid() OR invitee_user_id = auth.uid());

CREATE POLICY upd_collab_self ON public.collaborators FOR UPDATE TO authenticated
USING (inviter_user_id = auth.uid() OR invitee_user_id = auth.uid())
WITH CHECK (inviter_user_id = auth.uid() OR invitee_user_id = auth.uid());

-- Create proper budget schema with clean start
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

DROP TABLE IF EXISTS public.budget_categories CASCADE;
CREATE TABLE public.budget_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_id UUID NOT NULL REFERENCES public.budgets(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  planned_amount NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Fix budget_items to reference budget_id properly
ALTER TABLE public.budget_items DROP COLUMN IF EXISTS category;
ALTER TABLE public.budget_items ADD COLUMN IF NOT EXISTS budget_id UUID;

-- Enable RLS
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_categories ENABLE ROW LEVEL SECURITY;

-- Budget RLS policies
CREATE POLICY ins_budgets_self ON public.budgets FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY sel_budgets_self ON public.budgets FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY upd_budgets_self ON public.budgets FOR UPDATE TO authenticated
USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Budget categories RLS
CREATE POLICY sel_cats ON public.budget_categories FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.budgets b WHERE b.id = budget_id AND b.user_id = auth.uid()));

CREATE POLICY ins_cats ON public.budget_categories FOR INSERT TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM public.budgets b WHERE b.id = budget_id AND b.user_id = auth.uid()));

CREATE POLICY upd_cats ON public.budget_categories FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM public.budgets b WHERE b.id = budget_id AND b.user_id = auth.uid()));

-- Add updated_at triggers
CREATE TRIGGER update_budgets_updated_at
BEFORE UPDATE ON public.budgets
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_collaborators_updated_at
BEFORE UPDATE ON public.collaborators
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