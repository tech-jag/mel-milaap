-- Add security-related fields and tables for 2FA
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT false;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS two_factor_backup_codes TEXT[];

-- Create recovery codes table for better security
CREATE TABLE IF NOT EXISTS public.recovery_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  code_hash TEXT NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on recovery_codes
ALTER TABLE public.recovery_codes ENABLE ROW LEVEL SECURITY;

-- RLS policy for recovery codes
CREATE POLICY "Users can manage their own recovery codes" ON public.recovery_codes
FOR ALL USING (auth.uid() = user_id);

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_recovery_codes_user_id ON public.recovery_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_recovery_codes_used ON public.recovery_codes(used_at);