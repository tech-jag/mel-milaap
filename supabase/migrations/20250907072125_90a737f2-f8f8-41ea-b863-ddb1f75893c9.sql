-- Fix suppliers user_id FK and add RLS
CREATE OR REPLACE FUNCTION public.set_user_id()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.user_id IS NULL THEN
    NEW.user_id := auth.uid();
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger for suppliers
DROP TRIGGER IF EXISTS trg_suppliers_set_user_id ON public.suppliers;
CREATE TRIGGER trg_suppliers_set_user_id
  BEFORE INSERT ON public.suppliers
  FOR EACH ROW EXECUTE FUNCTION public.set_user_id();

-- Fix collaborators role enum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'collaborator_role') THEN
    CREATE TYPE collaborator_role AS ENUM ('parent','sibling','partner','close_friend');
  END IF;
END $$;

-- Create collaborators table if not exists with proper structure
CREATE TABLE IF NOT EXISTS public.collaborators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inviter_user_id UUID NOT NULL,
  invitee_user_id UUID,
  invitee_email TEXT NOT NULL,
  role collaborator_role NOT NULL,
  status TEXT DEFAULT 'pending',
  invitation_token TEXT,
  invitation_expires_at TIMESTAMPTZ,
  permissions JSONB DEFAULT '{"edit_profile": false, "view_profile": true, "edit_planning": false, "view_planning": true}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaborators ENABLE ROW LEVEL SECURITY;

-- Suppliers policies
DROP POLICY IF EXISTS ins_suppliers_self ON public.suppliers;
CREATE POLICY ins_suppliers_self ON public.suppliers FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS sel_suppliers_self ON public.suppliers;
CREATE POLICY sel_suppliers_self ON public.suppliers FOR SELECT
TO authenticated
USING (user_id = auth.uid());

DROP POLICY IF EXISTS upd_suppliers_self ON public.suppliers;
CREATE POLICY upd_suppliers_self ON public.suppliers FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Collaborators policies
DROP POLICY IF EXISTS ins_collab_self ON public.collaborators;
CREATE POLICY ins_collab_self ON public.collaborators FOR INSERT
TO authenticated
WITH CHECK (inviter_user_id = auth.uid());

DROP POLICY IF EXISTS sel_collab_self ON public.collaborators;
CREATE POLICY sel_collab_self ON public.collaborators FOR SELECT
TO authenticated
USING (inviter_user_id = auth.uid() OR invitee_user_id = auth.uid());

DROP POLICY IF EXISTS upd_collab_self ON public.collaborators;
CREATE POLICY upd_collab_self ON public.collaborators FOR UPDATE
TO authenticated
USING (inviter_user_id = auth.uid() OR invitee_user_id = auth.uid())
WITH CHECK (inviter_user_id = auth.uid() OR invitee_user_id = auth.uid());

-- Budget schema for proper budget functionality
CREATE TABLE IF NOT EXISTS public.budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL DEFAULT 'My Wedding Budget',
  total_budget NUMERIC DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'AUD',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.budget_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_id UUID NOT NULL REFERENCES public.budgets(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  planned_amount NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on budget tables
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_categories ENABLE ROW LEVEL SECURITY;

-- Budget policies
DROP POLICY IF EXISTS ins_budgets_self ON public.budgets;
CREATE POLICY ins_budgets_self ON public.budgets FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS sel_budgets_self ON public.budgets;
CREATE POLICY sel_budgets_self ON public.budgets FOR SELECT
TO authenticated
USING (user_id = auth.uid());

DROP POLICY IF EXISTS upd_budgets_self ON public.budgets;
CREATE POLICY upd_budgets_self ON public.budgets FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Budget categories policies
DROP POLICY IF EXISTS sel_cats ON public.budget_categories;
CREATE POLICY sel_cats ON public.budget_categories FOR SELECT
TO authenticated
USING (EXISTS (SELECT 1 FROM public.budgets b WHERE b.id = budget_id AND b.user_id = auth.uid()));

DROP POLICY IF EXISTS ins_cats ON public.budget_categories;
CREATE POLICY ins_cats ON public.budget_categories FOR INSERT
TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM public.budgets b WHERE b.id = budget_id AND b.user_id = auth.uid()));

DROP POLICY IF EXISTS upd_cats ON public.budget_categories;
CREATE POLICY upd_cats ON public.budget_categories FOR UPDATE
TO authenticated
USING (EXISTS (SELECT 1 FROM public.budgets b WHERE b.id = budget_id AND b.user_id = auth.uid()));

-- Supplier leads table
CREATE TABLE IF NOT EXISTS public.supplier_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  event_date DATE,
  budget_range TEXT,
  message TEXT,
  status TEXT DEFAULT 'new',
  source TEXT DEFAULT 'platform',
  priority TEXT DEFAULT 'medium',
  notes TEXT,
  value_estimate NUMERIC,
  follow_up_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.supplier_leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS sel_supplier_leads ON public.supplier_leads;
CREATE POLICY sel_supplier_leads ON public.supplier_leads FOR SELECT
TO authenticated
USING (EXISTS (SELECT 1 FROM public.suppliers s WHERE s.id = supplier_id AND s.user_id = auth.uid()));

DROP POLICY IF EXISTS ins_supplier_leads ON public.supplier_leads;
CREATE POLICY ins_supplier_leads ON public.supplier_leads FOR INSERT
TO authenticated
WITH CHECK (TRUE); -- Anyone can create leads

DROP POLICY IF EXISTS upd_supplier_leads ON public.supplier_leads;
CREATE POLICY upd_supplier_leads ON public.supplier_leads FOR UPDATE
TO authenticated
USING (EXISTS (SELECT 1 FROM public.suppliers s WHERE s.id = supplier_id AND s.user_id = auth.uid()));

-- Create trigger for updated_at on all tables
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_collaborators_updated_at ON public.collaborators;
CREATE TRIGGER update_collaborators_updated_at
  BEFORE UPDATE ON public.collaborators
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_budgets_updated_at ON public.budgets;
CREATE TRIGGER update_budgets_updated_at
  BEFORE UPDATE ON public.budgets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_supplier_leads_updated_at ON public.supplier_leads;
CREATE TRIGGER update_supplier_leads_updated_at
  BEFORE UPDATE ON public.supplier_leads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();