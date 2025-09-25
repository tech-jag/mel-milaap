-- Create tables step by step

-- 1. Create user_roles table first (needed for admin checks)
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'moderator', 'user')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Users can view their own roles
CREATE POLICY "Users can view own roles" ON public.user_roles
FOR SELECT USING (auth.uid() = user_id);

-- 2. Create profile_views table
CREATE TABLE IF NOT EXISTS public.profile_views (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  viewer_id uuid NOT NULL,
  viewed_profile_id uuid NOT NULL,
  view_date date NOT NULL DEFAULT current_date,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (viewer_id, viewed_profile_id, view_date)
);

ALTER TABLE public.profile_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can log profile views" ON public.profile_views
FOR INSERT WITH CHECK (
  auth.uid() = viewer_id AND
  viewer_id != viewed_profile_id
);

-- Users can see their own viewing history
CREATE POLICY "Users can see own view history" ON public.profile_views
FOR SELECT USING (auth.uid() = viewer_id);

-- 3. Create security_events table
CREATE TABLE IF NOT EXISTS public.security_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid,
  event_type text NOT NULL,
  event_data jsonb DEFAULT '{}',
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;

-- Only system can insert security events
CREATE POLICY "System can log security events" ON public.security_events
FOR INSERT WITH CHECK (false);

-- Users can view their own security events
CREATE POLICY "Users can view own security events" ON public.security_events
FOR SELECT USING (auth.uid() = user_id);

-- 4. Create data_exports table
CREATE TABLE IF NOT EXISTS public.data_exports (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  export_data jsonb NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'ready', 'downloaded', 'expired')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  expires_at timestamp with time zone NOT NULL DEFAULT (now() + interval '7 days')
);

ALTER TABLE public.data_exports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own data exports" ON public.data_exports
FOR ALL USING (auth.uid() = user_id);

-- 5. Create account_deletion_requests table
CREATE TABLE IF NOT EXISTS public.account_deletion_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  reason text,
  scheduled_deletion_at timestamp with time zone NOT NULL DEFAULT (now() + interval '7 days'),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'cancelled', 'completed')),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.account_deletion_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own deletion requests" ON public.account_deletion_requests
FOR ALL USING (auth.uid() = user_id);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_profile_views_viewer ON public.profile_views(viewer_id);
CREATE INDEX IF NOT EXISTS idx_profile_views_viewed ON public.profile_views(viewed_profile_id);
CREATE INDEX IF NOT EXISTS idx_security_events_user ON public.security_events(user_id);
CREATE INDEX IF NOT EXISTS idx_security_events_type ON public.security_events(event_type);
CREATE INDEX IF NOT EXISTS idx_user_roles_user ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_interests_sender ON public.interests(sender_id);
CREATE INDEX IF NOT EXISTS idx_interests_receiver ON public.interests(receiver_id);