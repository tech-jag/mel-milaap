-- Create additional tables for security and features (without vector extension)

-- Favorites table
CREATE TABLE public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subject_type TEXT NOT NULL CHECK (subject_type IN ('profile', 'supplier')),
  subject_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Supplier views tracking
CREATE TABLE public.supplier_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID REFERENCES public.suppliers(id) ON DELETE CASCADE NOT NULL,
  viewer_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Reports table for user reports
CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subject_type TEXT NOT NULL CHECK (subject_type IN ('user', 'supplier', 'message')),
  subject_id UUID NOT NULL,
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Audit logs for admin actions
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  subject_type TEXT NOT NULL,
  subject_id UUID NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Block/Hide functionality
CREATE TABLE public.blocked_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  blocked_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(blocker_user_id, blocked_user_id)
);

-- Digital invites templates and exports
CREATE TABLE public.invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  template_name TEXT NOT NULL,
  guest_names TEXT[] DEFAULT '{}',
  event_date DATE,
  venue_name TEXT,
  custom_message TEXT,
  exported_file_url TEXT,
  canva_link TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invites ENABLE ROW LEVEL SECURITY;

-- RLS Policies for favorites
CREATE POLICY "Users can manage their own favorites" ON public.favorites
FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for supplier_views (suppliers can see their own views)
CREATE POLICY "Suppliers can view their analytics" ON public.supplier_views
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.suppliers 
    WHERE id = supplier_views.supplier_id 
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Anyone can create supplier views" ON public.supplier_views
FOR INSERT WITH CHECK (true);

-- RLS Policies for reports
CREATE POLICY "Users can create reports" ON public.reports
FOR INSERT WITH CHECK (auth.uid() = reporter_user_id);

CREATE POLICY "Users can view their own reports" ON public.reports
FOR SELECT USING (auth.uid() = reporter_user_id);

-- RLS Policies for audit logs (admin only - will be handled by admin role check later)
CREATE POLICY "Admins can view audit logs" ON public.audit_logs
FOR SELECT USING (true); -- Will be restricted by admin role

-- RLS Policies for blocked users
CREATE POLICY "Users can manage their blocks" ON public.blocked_users
FOR ALL USING (auth.uid() = blocker_user_id);

-- RLS Policies for invites
CREATE POLICY "Users can manage their own invites" ON public.invites
FOR ALL USING (auth.uid() = user_id);

-- Add indexes for performance
CREATE INDEX idx_favorites_user_subject ON public.favorites(user_id, subject_type, subject_id);
CREATE INDEX idx_supplier_views_supplier_date ON public.supplier_views(supplier_id, created_at DESC);
CREATE INDEX idx_reports_status ON public.reports(status);
CREATE INDEX idx_audit_logs_date ON public.audit_logs(created_at DESC);
CREATE INDEX idx_blocked_users_blocker ON public.blocked_users(blocker_user_id);
CREATE INDEX idx_invites_user ON public.invites(user_id);

-- Add triggers for updated_at
CREATE TRIGGER update_invites_updated_at
  BEFORE UPDATE ON public.invites
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();