-- Fix messages table structure to match code expectations
ALTER TABLE public.messages DROP COLUMN IF EXISTS thread_id;
ALTER TABLE public.messages RENAME COLUMN from_user_id TO sender_id;
ALTER TABLE public.messages RENAME COLUMN to_user_id TO receiver_id;