-- Add admin policies that reference user_roles table

-- Admin policies for user_roles
CREATE POLICY "Admins can manage roles" ON public.user_roles
FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admins can update roles" ON public.user_roles
FOR UPDATE USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admins can delete roles" ON public.user_roles
FOR DELETE USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Admin policies for security_events
CREATE POLICY "Admins can view all security events" ON public.security_events
FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Admin policies for profile_views (premium feature for profile owners)
CREATE POLICY "Profile owners can see views" ON public.profile_views
FOR SELECT USING (
  auth.uid() = viewed_profile_id AND
  EXISTS (SELECT 1 FROM subscriptions WHERE subject_id = auth.uid() AND subject_type = 'user' AND status = 'active')
);

-- Admin policies for account_deletion_requests
CREATE POLICY "Admins can view deletion requests" ON public.account_deletion_requests
FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admins can update deletion requests" ON public.account_deletion_requests
FOR UPDATE USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);