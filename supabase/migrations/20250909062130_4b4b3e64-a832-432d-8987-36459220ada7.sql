-- Fix security issues by setting proper search_path for functions
DROP FUNCTION IF EXISTS generate_profile_id();
DROP FUNCTION IF EXISTS auto_generate_profile_id();

-- Create a function to generate a unique profile ID with proper security settings
CREATE OR REPLACE FUNCTION generate_profile_id()
RETURNS TEXT 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    result TEXT := '';
    i INT;
BEGIN
    FOR i IN 1..10 LOOP
        result := result || substr(chars, floor(random() * length(chars))::int + 1, 1);
    END LOOP;
    RETURN result;
END;
$$;

-- Create trigger function with proper security settings
CREATE OR REPLACE FUNCTION auto_generate_profile_id()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NEW.profile_id IS NULL THEN
        NEW.profile_id := generate_profile_id();
        -- Ensure uniqueness
        WHILE EXISTS (SELECT 1 FROM user_profiles WHERE profile_id = NEW.profile_id) LOOP
            NEW.profile_id := generate_profile_id();
        END LOOP;
    END IF;
    RETURN NEW;
END;
$$;