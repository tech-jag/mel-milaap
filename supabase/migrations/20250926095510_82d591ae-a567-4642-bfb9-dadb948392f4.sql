-- Drop existing policies if they exist and recreate them properly
DO $$ 
BEGIN
  -- Drop existing policies on security_events if they exist
  DROP POLICY IF EXISTS "Admins can view all security events" ON public.security_events;
  DROP POLICY IF EXISTS "Users can view their own security events" ON public.security_events;
  DROP POLICY IF EXISTS "System can insert security events" ON public.security_events;
END $$;

-- Create enum types if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'security_event_type') THEN
    CREATE TYPE public.security_event_type AS ENUM (
      'login_attempt',
      'profile_access', 
      'photo_upload',
      'message_sent',
      'profile_update',
      'suspicious_activity',
      'admin_action'
    );
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'moderation_status') THEN
    CREATE TYPE public.moderation_status AS ENUM (
      'pending',
      'approved',
      'rejected', 
      'flagged'
    );
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notification_type') THEN
    CREATE TYPE public.notification_type AS ENUM (
      'security_alert',
      'moderation_update',
      'system_notification'
    );
  END IF;
END $$;

-- Create tables if they don't exist
CREATE TABLE IF NOT EXISTS public.security_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type public.security_event_type NOT NULL,
  event_data JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.photo_moderation (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  photo_id UUID NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status public.moderation_status NOT NULL DEFAULT 'pending',
  moderator_id UUID REFERENCES auth.users(id),
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.platform_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  metadata JSONB DEFAULT '{}',
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.email_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  notification_type public.notification_type NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photo_moderation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_notifications ENABLE ROW LEVEL SECURITY;

-- Create fresh RLS policies
CREATE POLICY "Users can view their own security events"
ON public.security_events FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all security events"
ON public.security_events FOR SELECT
USING (EXISTS (
  SELECT 1 FROM user_roles 
  WHERE user_id = auth.uid() AND role = 'admin'
));

CREATE POLICY "System can insert security events"
ON public.security_events FOR INSERT
WITH CHECK (true);

-- Photo moderation policies
CREATE POLICY "Users can view their own photo moderation"
ON public.photo_moderation FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage photo moderation"
ON public.photo_moderation FOR ALL
USING (EXISTS (
  SELECT 1 FROM user_roles 
  WHERE user_id = auth.uid() AND role = 'admin'
));

-- Platform analytics policies
CREATE POLICY "Admins can view platform analytics"
ON public.platform_analytics FOR SELECT
USING (EXISTS (
  SELECT 1 FROM user_roles
  WHERE user_id = auth.uid() AND role = 'admin'
));

-- Email notification policies
CREATE POLICY "Users can view their own email notifications"
ON public.email_notifications FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "System can manage email notifications"
ON public.email_notifications FOR ALL
USING (true);