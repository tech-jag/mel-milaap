-- Fix the ON CONFLICT constraint issues by ensuring proper unique constraints exist
-- Check current constraints first, then fix the missing ones

-- Ensure user_profiles has proper unique constraint on user_id
DO $$ 
BEGIN
    -- Drop existing constraint if it exists with wrong name and recreate properly
    IF EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'user_profiles_pkey' 
        AND contype = 'p'
    ) THEN
        -- Primary key already exists, good
        NULL;
    ELSE
        -- Add primary key if missing
        ALTER TABLE public.user_profiles 
        ADD CONSTRAINT user_profiles_pkey PRIMARY KEY (user_id);
    END IF;
EXCEPTION 
    WHEN duplicate_object THEN
        -- Constraint already exists, ignore
        NULL;
    WHEN others THEN
        -- Try alternative approach - add unique constraint instead
        BEGIN
            ALTER TABLE public.user_profiles 
            ADD CONSTRAINT user_profiles_user_id_unique UNIQUE (user_id);
        EXCEPTION WHEN duplicate_object THEN
            NULL;
        END;
END $$;

-- Ensure onboarding_state has proper unique constraint on user_id
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'onboarding_state_pkey'
        AND contype = 'p'
    ) THEN
        NULL;
    ELSE
        ALTER TABLE public.onboarding_state 
        ADD CONSTRAINT onboarding_state_pkey PRIMARY KEY (user_id);
    END IF;
EXCEPTION 
    WHEN duplicate_object THEN
        NULL;
    WHEN others THEN
        BEGIN
            ALTER TABLE public.onboarding_state 
            ADD CONSTRAINT onboarding_state_user_id_unique UNIQUE (user_id);
        EXCEPTION WHEN duplicate_object THEN
            NULL;
        END;
END $$;

-- Ensure partner_preferences has proper unique constraint on user_id  
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'partner_preferences_pkey'
        AND contype = 'p'  
    ) THEN
        NULL;
    ELSE
        ALTER TABLE public.partner_preferences 
        ADD CONSTRAINT partner_preferences_pkey PRIMARY KEY (user_id);
    END IF;
EXCEPTION 
    WHEN duplicate_object THEN
        NULL;
    WHEN others THEN
        BEGIN
            ALTER TABLE public.partner_preferences 
            ADD CONSTRAINT partner_preferences_user_id_unique UNIQUE (user_id);
        EXCEPTION WHEN duplicate_object THEN
            NULL;
        END;
END $$;