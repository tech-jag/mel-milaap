-- Add profile_id to user_profiles table for public sharing
ALTER TABLE user_profiles ADD COLUMN profile_id TEXT UNIQUE;

-- Create a function to generate a unique profile ID
CREATE OR REPLACE FUNCTION generate_profile_id()
RETURNS TEXT AS $$
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
$$ LANGUAGE plpgsql;

-- Update existing profiles with profile_id
UPDATE user_profiles SET profile_id = generate_profile_id() WHERE profile_id IS NULL;

-- Create trigger to auto-generate profile_id for new profiles
CREATE OR REPLACE FUNCTION auto_generate_profile_id()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_generate_profile_id
    BEFORE INSERT ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION auto_generate_profile_id();

-- Create RLS policy for public profile viewing by profile_id
CREATE POLICY "Public profiles can be viewed by profile_id" 
ON user_profiles 
FOR SELECT 
USING (profile_id IS NOT NULL);