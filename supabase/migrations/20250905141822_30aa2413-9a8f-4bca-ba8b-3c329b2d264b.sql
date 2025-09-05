-- Create interests table for user connections
CREATE TABLE IF NOT EXISTS public.interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (sender_id, receiver_id)
);

-- Create messages table for user communications
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create guest_list table for wedding planning
CREATE TABLE IF NOT EXISTS public.guest_list (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  side TEXT CHECK (side IN ('bride','groom','both')) DEFAULT 'both',
  email TEXT,
  phone TEXT,
  group_name TEXT,
  rsvp_status TEXT CHECK (rsvp_status IN ('pending','yes','no')) DEFAULT 'pending',
  dietary TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on interests table
ALTER TABLE public.interests ENABLE ROW LEVEL SECURITY;

-- Interests policies
CREATE POLICY "insert_own_interest" ON public.interests
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "read_interests_involved" ON public.interests
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Enable RLS on messages table  
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Messages policies
CREATE POLICY "insert_own_message" ON public.messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "read_messages_involved" ON public.messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Enable RLS on guest_list table
ALTER TABLE public.guest_list ENABLE ROW LEVEL SECURITY;

-- Guest list policies
CREATE POLICY "owner_can_read_guests" ON public.guest_list
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "owner_can_create_guests" ON public.guest_list
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "owner_can_update_guests" ON public.guest_list
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "owner_can_delete_guests" ON public.guest_list
  FOR DELETE USING (auth.uid() = user_id);

-- Add plan field to users table if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='users' AND column_name='plan'
  ) THEN
    ALTER TABLE public.users ADD COLUMN plan TEXT DEFAULT 'free';
  END IF;
END $$;