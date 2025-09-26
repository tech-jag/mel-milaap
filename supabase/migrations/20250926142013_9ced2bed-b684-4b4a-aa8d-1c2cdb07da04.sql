-- Fix the database constraints causing signup failures
-- PostgreSQL doesn't support IF NOT EXISTS for ADD CONSTRAINT, so we'll use a different approach

-- First, drop and recreate the handle_new_user_onboarding function with proper error handling
DROP FUNCTION IF EXISTS public.handle_new_user_onboarding() CASCADE;

CREATE OR REPLACE FUNCTION public.handle_new_user_onboarding()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Insert onboarding state with proper error handling
  INSERT INTO public.onboarding_state (user_id, status, current_step)
  VALUES (NEW.id, 'in_progress', 1)
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Insert user profile with proper error handling
  INSERT INTO public.user_profiles (user_id, profile_ready)
  VALUES (NEW.id, false)
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Insert partner preferences with proper error handling  
  INSERT INTO public.partner_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't block user creation
    RAISE LOG 'Error in handle_new_user_onboarding for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$function$;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user_onboarding();

-- Add unique constraints safely (check if they exist first)
DO $$ 
BEGIN
    -- Add unique constraint for onboarding_state if not exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'onboarding_state_user_id_key'
    ) THEN
        ALTER TABLE public.onboarding_state 
        ADD CONSTRAINT onboarding_state_user_id_key UNIQUE (user_id);
    END IF;

    -- Add unique constraint for user_profiles if not exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'user_profiles_user_id_key'
    ) THEN
        ALTER TABLE public.user_profiles 
        ADD CONSTRAINT user_profiles_user_id_key UNIQUE (user_id);
    END IF;

    -- Add unique constraint for partner_preferences if not exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'partner_preferences_user_id_key'
    ) THEN
        ALTER TABLE public.partner_preferences 
        ADD CONSTRAINT partner_preferences_user_id_key UNIQUE (user_id);
    END IF;
END $$;