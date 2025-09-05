-- Create user roles enum
CREATE TYPE public.user_role AS ENUM ('guest', 'member', 'parent', 'supplier', 'admin');

-- Create immigration status enum  
CREATE TYPE public.immigration_status AS ENUM ('citizen', 'permanent_resident', 'temporary_visa', 'student_visa', 'work_visa', 'other');

-- Create interest status enum
CREATE TYPE public.interest_status AS ENUM ('pending', 'accepted', 'declined');

-- Create supplier plan enum
CREATE TYPE public.supplier_plan AS ENUM ('free', 'featured', 'premium');

-- Create users table (extends auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'member',
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  city TEXT,
  country TEXT DEFAULT 'Australia',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create member profiles table
CREATE TABLE public.member_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  manager_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  gender TEXT,
  date_of_birth DATE,
  height_cm INTEGER,
  religion TEXT,
  mother_tongue TEXT,
  community_caste TEXT,
  education TEXT,
  profession TEXT,
  immigration_status immigration_status,
  relocate_willing BOOLEAN DEFAULT false,
  bio TEXT,
  photos TEXT[] DEFAULT '{}',
  verified BOOLEAN DEFAULT false,
  visibility TEXT DEFAULT 'private',
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create interests table
CREATE TABLE public.interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  to_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  status interest_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(from_user_id, to_user_id)
);

-- Create threads table
CREATE TABLE public.threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  user2_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user1_id, user2_id)
);

-- Create messages table
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES public.threads(id) ON DELETE CASCADE,
  from_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  to_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create suppliers table
CREATE TABLE public.suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  categories TEXT[] NOT NULL DEFAULT '{}',
  city TEXT NOT NULL,
  regions TEXT[] DEFAULT '{}',
  description TEXT,
  price_band TEXT,
  capacity_min INTEGER,
  capacity_max INTEGER,
  website TEXT,
  socials JSONB DEFAULT '{}',
  photos TEXT[] DEFAULT '{}',
  plan supplier_plan NOT NULL DEFAULT 'free',
  featured BOOLEAN DEFAULT false,
  rating DECIMAL(3,2) DEFAULT 0.0,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create leads table
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
  from_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create budgets table
CREATE TABLE public.budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Wedding Budget',
  total_budget DECIMAL(10,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create budget items table
CREATE TABLE public.budget_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_id UUID NOT NULL REFERENCES public.budgets(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  planned_amount DECIMAL(10,2) DEFAULT 0,
  actual_amount DECIMAL(10,2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create guest lists table
CREATE TABLE public.guest_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Wedding Guest List',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create guest list items table
CREATE TABLE public.guest_list_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_list_id UUID NOT NULL REFERENCES public.guest_lists(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  side TEXT, -- 'bride', 'groom', 'family'
  rsvp_status TEXT DEFAULT 'pending',
  dietary_requirements TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create subscriptions table
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID NOT NULL,
  subject_type TEXT NOT NULL, -- 'user' or 'supplier'
  plan TEXT NOT NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create blog posts table
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT,
  body TEXT NOT NULL,
  author TEXT,
  cover_image TEXT,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guest_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guest_list_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
CREATE POLICY "Users can view their own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own data" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for member profiles (private by default)
CREATE POLICY "Users can view their own profile" ON public.member_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.member_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.member_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for interests
CREATE POLICY "Users can view interests involving them" ON public.interests
  FOR SELECT USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

CREATE POLICY "Users can create interests" ON public.interests
  FOR INSERT WITH CHECK (auth.uid() = from_user_id);

CREATE POLICY "Users can update interests to them" ON public.interests
  FOR UPDATE USING (auth.uid() = to_user_id);

-- Create RLS policies for threads
CREATE POLICY "Users can view their own threads" ON public.threads
  FOR SELECT USING (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Users can create threads" ON public.threads
  FOR INSERT WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Create RLS policies for messages
CREATE POLICY "Users can view messages in their threads" ON public.messages
  FOR SELECT USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

CREATE POLICY "Users can send messages" ON public.messages
  FOR INSERT WITH CHECK (auth.uid() = from_user_id);

-- Create RLS policies for suppliers
CREATE POLICY "Anyone can view verified suppliers" ON public.suppliers
  FOR SELECT USING (verified = true);

CREATE POLICY "Users can manage their own supplier profile" ON public.suppliers
  FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for leads
CREATE POLICY "Suppliers can view their own leads" ON public.leads
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.suppliers 
      WHERE suppliers.id = leads.supplier_id 
      AND suppliers.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create leads" ON public.leads
  FOR INSERT WITH CHECK (auth.uid() = from_user_id OR from_user_id IS NULL);

-- Create RLS policies for budgets
CREATE POLICY "Users can manage their own budget" ON public.budgets
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own budget items" ON public.budget_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.budgets 
      WHERE budgets.id = budget_items.budget_id 
      AND budgets.user_id = auth.uid()
    )
  );

-- Create RLS policies for guest lists
CREATE POLICY "Users can manage their own guest list" ON public.guest_lists
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own guest list items" ON public.guest_list_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.guest_lists 
      WHERE guest_lists.id = guest_list_items.guest_list_id 
      AND guest_lists.user_id = auth.uid()
    )
  );

-- Create RLS policies for subscriptions
CREATE POLICY "Users can view their own subscriptions" ON public.subscriptions
  FOR SELECT USING (
    (subject_type = 'user' AND subject_id = auth.uid()) OR
    (subject_type = 'supplier' AND EXISTS (
      SELECT 1 FROM public.suppliers 
      WHERE suppliers.id = subject_id 
      AND suppliers.user_id = auth.uid()
    ))
  );

-- Create RLS policies for blog posts (public read, admin write)
CREATE POLICY "Anyone can read published blog posts" ON public.blog_posts
  FOR SELECT USING (published = true);

-- Create indexes for better performance
CREATE INDEX idx_member_profiles_user_id ON public.member_profiles(user_id);
CREATE INDEX idx_member_profiles_verified ON public.member_profiles(verified);
CREATE INDEX idx_interests_from_user ON public.interests(from_user_id);
CREATE INDEX idx_interests_to_user ON public.interests(to_user_id);
CREATE INDEX idx_interests_status ON public.interests(status);
CREATE INDEX idx_messages_thread_id ON public.messages(thread_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at);
CREATE INDEX idx_suppliers_city ON public.suppliers(city);
CREATE INDEX idx_suppliers_categories ON public.suppliers USING GIN(categories);
CREATE INDEX idx_suppliers_plan ON public.suppliers(plan);
CREATE INDEX idx_suppliers_featured ON public.suppliers(featured);
CREATE INDEX idx_leads_supplier_id ON public.leads(supplier_id);
CREATE INDEX idx_budget_items_budget_id ON public.budget_items(budget_id);
CREATE INDEX idx_guest_list_items_guest_list_id ON public.guest_list_items(guest_list_id);
CREATE INDEX idx_blog_posts_published ON public.blog_posts(published);
CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);

-- Create trigger function for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_member_profiles_updated_at
  BEFORE UPDATE ON public.member_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_threads_updated_at
  BEFORE UPDATE ON public.threads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_suppliers_updated_at
  BEFORE UPDATE ON public.suppliers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_budgets_updated_at
  BEFORE UPDATE ON public.budgets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_budget_items_updated_at
  BEFORE UPDATE ON public.budget_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_guest_lists_updated_at
  BEFORE UPDATE ON public.guest_lists
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_guest_list_items_updated_at
  BEFORE UPDATE ON public.guest_list_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed blog posts
INSERT INTO public.blog_posts (slug, title, excerpt, body, author, published, published_at) VALUES
(
  'anz-south-asian-wedding-checklist',
  'The Complete ANZ South Asian Wedding Checklist',
  'Everything you need to plan the perfect South Asian wedding in Australia and New Zealand.',
  'Planning a South Asian wedding in Australia or New Zealand? This comprehensive guide covers everything from venue selection to cultural traditions...',
  'ANZ Matrimony Team',
  true,
  now()
),
(
  'parents-guide-online-matrimony',
  'Parents'' Guide to Online Matrimony',
  'How parents can navigate modern matchmaking while honoring traditional values.',
  'For parents helping their children find life partners, online matrimony platforms offer new opportunities while maintaining cultural values...',
  'ANZ Matrimony Team',
  true,
  now()
),
(
  'how-verification-works',
  'How Our Verification Process Works',
  'Understanding our multi-step verification process for safe and secure matchmaking.',
  'Trust and safety are our top priorities. Our verification process includes ID verification, photo verification, and background checks...',
  'ANZ Matrimony Team',
  true,
  now()
);