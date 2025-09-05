-- Drop the interests constraint that may be conflicting and recreate with correct columns
ALTER TABLE IF EXISTS public.interests DROP CONSTRAINT IF EXISTS interests_sender_id_receiver_id_key;

-- Check if interests table has correct structure, if not update it
DO $$
BEGIN
  -- Check if interests table has the old column names and update them
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='interests' AND column_name='from_user_id'
  ) THEN
    -- Rename old columns to match new structure
    ALTER TABLE public.interests RENAME COLUMN from_user_id TO sender_id;
    ALTER TABLE public.interests RENAME COLUMN to_user_id TO receiver_id;
  END IF;
END $$;

-- Add unique constraint to interests if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name='interests' AND constraint_type='UNIQUE'
  ) THEN
    ALTER TABLE public.interests ADD CONSTRAINT interests_sender_receiver_unique UNIQUE (sender_id, receiver_id);
  END IF;
END $$;

-- Create messages table for user communications (rename from existing if needed)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name='messages' AND table_schema='public'
  ) THEN
    CREATE TABLE public.messages (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      body TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    );
  ELSE
    -- Update existing messages table if needed
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name='messages' AND column_name='from_user_id'
    ) THEN
      ALTER TABLE public.messages RENAME COLUMN from_user_id TO sender_id;
      ALTER TABLE public.messages RENAME COLUMN to_user_id TO receiver_id;
    END IF;
  END IF;
END $$;

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

-- Update RLS policies for interests (drop old, create new)
DROP POLICY IF EXISTS "Users can create interests" ON public.interests;
DROP POLICY IF EXISTS "Users can update interests to them" ON public.interests; 
DROP POLICY IF EXISTS "Users can view interests involving them" ON public.interests;

CREATE POLICY "insert_own_interest" ON public.interests
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "read_interests_involved" ON public.interests
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Enable RLS on messages table and add policies
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can send messages" ON public.messages;
DROP POLICY IF EXISTS "Users can view messages in their threads" ON public.messages;

CREATE POLICY "insert_own_message" ON public.messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "read_messages_involved" ON public.messages  
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Enable RLS on guest_list table and add policies
ALTER TABLE public.guest_list ENABLE ROW LEVEL SECURITY;

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