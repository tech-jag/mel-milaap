-- Fix the contact_preferences table constraint issue
-- Drop the constraint if it exists and recreate it properly
DO $$
BEGIN
    -- Try to drop the constraint if it exists
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
               WHERE constraint_name = 'contact_preferences_user_id_unique' 
               AND table_name = 'contact_preferences') THEN
        ALTER TABLE contact_preferences DROP CONSTRAINT contact_preferences_user_id_unique;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        -- Continue if constraint doesn't exist
        NULL;
END $$;

-- Clean up any duplicate records first
DELETE FROM contact_preferences 
WHERE id NOT IN (
    SELECT DISTINCT ON (user_id) id 
    FROM contact_preferences 
    ORDER BY user_id, created_at ASC NULLS LAST
);

-- Add the unique constraint properly
ALTER TABLE contact_preferences ADD CONSTRAINT contact_preferences_user_id_unique UNIQUE (user_id);