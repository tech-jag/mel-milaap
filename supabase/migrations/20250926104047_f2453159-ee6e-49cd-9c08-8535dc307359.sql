-- Create missing family_members table with proper schema
CREATE TABLE IF NOT EXISTS public.family_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  family_member_id UUID,
  relationship TEXT NOT NULL,
  access_level TEXT NOT NULL DEFAULT 'view' CHECK (access_level IN ('view', 'manage', 'full')),
  can_view_photos BOOLEAN DEFAULT false,
  can_view_contacts BOOLEAN DEFAULT false,
  can_manage_profile BOOLEAN DEFAULT false,
  invitation_email TEXT NOT NULL,
  invitation_token TEXT UNIQUE,
  invitation_expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'revoked')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for family_members
CREATE POLICY "Users can manage their own family members" 
ON public.family_members 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Family members can view their invitations" 
ON public.family_members 
FOR SELECT 
USING (auth.uid() = family_member_id);

CREATE POLICY "Family members can update their own access" 
ON public.family_members 
FOR UPDATE 
USING (auth.uid() = family_member_id)
WITH CHECK (auth.uid() = family_member_id);

-- Add updated_at trigger for family_members
CREATE TRIGGER update_family_members_updated_at
  BEFORE UPDATE ON public.family_members
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create comprehensive Terms of Service content table
CREATE TABLE IF NOT EXISTS public.terms_of_service (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  version TEXT NOT NULL,
  content JSONB NOT NULL,
  effective_date TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert comprehensive terms content
INSERT INTO public.terms_of_service (version, content, effective_date, is_active) VALUES (
  '2.0',
  '{
    "sections": [
      {
        "title": "Acceptance of Terms",
        "content": "By accessing and using Mēl Milaap (\"we\", \"us\", \"our\"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use our service."
      },
      {
        "title": "Service Description",
        "content": "Mēl Milaap is a matrimonial platform designed to help individuals find compatible life partners. We provide profile creation, matching algorithms, communication tools, and wedding planning features."
      },
      {
        "title": "User Accounts and Responsibilities",
        "content": "Users must provide accurate information during registration. You are responsible for maintaining account confidentiality and all activities under your account. Users must be 18+ years old to register."
      },
      {
        "title": "Privacy and Data Protection",
        "content": "Your privacy is important to us. Please review our Privacy Policy for detailed information about data collection, use, and protection. We implement enterprise-grade security measures."
      },
      {
        "title": "Photo and Content Guidelines",
        "content": "All uploaded photos must be appropriate, recent, and clearly show your face. Users own their content but grant us license to display it on the platform. Inappropriate content will be removed."
      },
      {
        "title": "Communication Rules",
        "content": "Respectful communication is required. Harassment, abuse, or inappropriate behavior will result in account suspension. Premium features may be required for certain communications."
      },
      {
        "title": "Subscription and Payments",
        "content": "Premium subscriptions provide enhanced features. Payments are processed securely. Refunds are subject to our refund policy outlined separately."
      },
      {
        "title": "Family Access and Permissions",
        "content": "Users can grant family members limited access to their profiles. Family access is logged and monitored. Users control permission levels for family members."
      },
      {
        "title": "Prohibited Uses",
        "content": "Users may not use our service for unlawful purposes, commercial solicitation, harassment, or to violate others privacy. Fake profiles and misrepresentation are prohibited."
      },
      {
        "title": "Platform Security",
        "content": "We employ enterprise-level security measures including data encryption, secure authentication, and regular security audits. Users should report security concerns immediately."
      },
      {
        "title": "Intellectual Property",
        "content": "The platform design, algorithms, and features are our intellectual property. Users retain rights to their personal content but grant us usage rights for platform functionality."
      },
      {
        "title": "Disclaimer and Liability",
        "content": "We provide the platform as-is. While we strive for accuracy, we cannot guarantee the completeness or accuracy of user information. Users interact at their own discretion."
      },
      {
        "title": "Termination",
        "content": "Either party may terminate the agreement. Upon termination, your access will be revoked. We reserve the right to suspend accounts for terms violations."
      },
      {
        "title": "Updates to Terms",
        "content": "We may update these terms periodically. Users will be notified of significant changes. Continued use constitutes acceptance of updated terms."
      },
      {
        "title": "Contact Information",
        "content": "For questions about these Terms of Service, contact us at legal@melmilaap.com or through our customer support system."
      }
    ]
  }',
  NOW(),
  true
);

-- Create table for tracking user agreement to terms
CREATE TABLE IF NOT EXISTS public.user_terms_acceptance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  terms_version TEXT NOT NULL,
  accepted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT
);

-- Enable RLS for terms acceptance
ALTER TABLE public.user_terms_acceptance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own terms acceptance" 
ON public.user_terms_acceptance 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can record terms acceptance" 
ON public.user_terms_acceptance 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);