-- Fix the function search path security issue
CREATE OR REPLACE FUNCTION initialize_user_activity_stats()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO user_activity_stats (user_id)
  VALUES (NEW.user_id)
  ON CONFLICT (user_id) DO NOTHING;
  
  INSERT INTO contact_preferences (user_id)
  VALUES (NEW.user_id)
  ON CONFLICT DO NOTHING;
  
  RETURN NEW;
END;
$$;