-- Add unique constraint on user_id for user_profiles table
-- This will allow ON CONFLICT clauses to work properly
ALTER TABLE public.user_profiles 
ADD CONSTRAINT user_profiles_user_id_unique UNIQUE (user_id);

-- Also add a primary key if it doesn't exist
-- First check if there's already a primary key
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE table_name = 'user_profiles' 
        AND constraint_type = 'PRIMARY KEY'
        AND table_schema = 'public'
    ) THEN
        -- Add primary key on user_id since it should be unique anyway
        ALTER TABLE public.user_profiles ADD PRIMARY KEY (user_id);
    END IF;
END $$;