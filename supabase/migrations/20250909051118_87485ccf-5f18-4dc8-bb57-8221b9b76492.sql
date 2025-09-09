-- Fix security warning: Function Search Path Mutable
create or replace function handle_new_user_onboarding() 
returns trigger 
language plpgsql 
security definer
set search_path = public
as $$
begin
  insert into public.onboarding_state (user_id, status, current_step)
  values (new.id, 'in_progress', 1);
  
  insert into public.user_profiles (user_id, profile_ready)
  values (new.id, false);
  
  insert into public.partner_preferences (user_id)
  values (new.id);
  
  return new;
end;
$$;