-- Fix onboarding database issues by adding proper constraints and cleaning up policies

-- First, drop duplicate policies
DROP POLICY IF EXISTS "prefs_insert_own" ON public.partner_preferences;
DROP POLICY IF EXISTS "prefs_select_own" ON public.partner_preferences;  
DROP POLICY IF EXISTS "prefs_update_own" ON public.partner_preferences;

-- Add primary keys for proper upsert functionality
DO $$ 
BEGIN
    -- Add primary key to user_profiles if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'user_profiles' 
        AND constraint_type = 'PRIMARY KEY'
    ) THEN
        ALTER TABLE public.user_profiles ADD PRIMARY KEY (user_id);
    END IF;
    
    -- Add primary key to onboarding_state if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'onboarding_state' 
        AND constraint_type = 'PRIMARY KEY'
    ) THEN
        ALTER TABLE public.onboarding_state ADD PRIMARY KEY (user_id);
    END IF;
    
    -- Add primary key to partner_preferences if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'partner_preferences' 
        AND constraint_type = 'PRIMARY KEY'
    ) THEN
        ALTER TABLE public.partner_preferences ADD PRIMARY KEY (user_id);
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        -- Continue if constraints already exist
        NULL;
END $$;

-- Remove the problematic trigger that might be interfering
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user_onboarding();

-- Create a simpler trigger function without conflicts
CREATE OR REPLACE FUNCTION public.handle_new_user_simple()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Simple inserts without conflicts
  INSERT INTO public.onboarding_state (user_id, status, current_step)
  VALUES (NEW.id, 'in_progress', 1)
  ON CONFLICT (user_id) DO NOTHING;
  
  INSERT INTO public.user_profiles (user_id, profile_ready)
  VALUES (NEW.id, false)
  ON CONFLICT (user_id) DO NOTHING;
  
  INSERT INTO public.partner_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Don't block user creation if this fails
    RETURN NEW;
END;
$$;

-- Create the trigger
CREATE TRIGGER on_auth_user_created_simple
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_simple();