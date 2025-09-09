-- Create enums for onboarding system
create type gender_t as enum ('male','female','non_binary','prefer_not');
create type body_type_t as enum ('slim','average','athletic','heavy','prefer_not');
create type complexion_t as enum ('very_fair','fair','wheatish','dark','prefer_not');
create type marital_status_t as enum ('never_married','divorced','widowed','annulled');
create type yes_no_unknown_t as enum ('yes','no','unknown');
create type diet_t as enum ('vegetarian','eggetarian','non_vegetarian','vegan','halal','prefer_not');
create type freq_t as enum ('no','occasional','yes');
create type family_type_t as enum ('nuclear','joint','other');
create type family_values_t as enum ('traditional','moderate','liberal','other');
create type onboarding_status_t as enum ('in_progress','complete');

-- Create user_profiles table
create table if not exists user_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  profile_ready boolean default false,

  -- personal
  full_name text,
  gender gender_t,
  birth_date date,
  birth_time time,
  birth_city text,
  height_cm int check (height_cm between 120 and 220),
  body_type body_type_t,
  complexion complexion_t,
  marital_status marital_status_t,
  have_children boolean,
  children_living_with text check (children_living_with in ('me','other','na')),

  languages_spoken text[] default '{}',
  mother_tongue text,

  -- religion/community/astro
  religion text,
  community text,
  sub_community text,
  gothra text,
  nakshatra text,
  manglik yes_no_unknown_t,

  -- location / status
  location_country text,
  location_state text,
  location_city text,
  citizenship text,
  residency_status text,

  -- education & career
  education_level text,
  field_of_study text,
  university text,
  occupation text,
  employer text,
  annual_income numeric,
  work_location text,

  -- lifestyle
  diet diet_t,
  drinking freq_t,
  smoking freq_t,
  lifestyle_tags text[] default '{}',

  -- family
  family_type family_type_t,
  family_values family_values_t,
  father_occupation text,
  mother_occupation text,
  siblings_brothers int default 0,
  siblings_sisters int default 0,
  family_living_in text,
  family_about text,

  -- about
  about_me text,
  highlights text[] default '{}',

  -- privacy
  photo_visibility text check (photo_visibility in ('public','members','on_request')) default 'members',
  contact_by text[] default '{}',
  updated_at timestamp with time zone default now()
);

-- Create partner_preferences table  
create table if not exists partner_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,

  age_min int,          
  age_max int,
  height_min_cm int,    
  height_max_cm int,
  marital_statuses marital_status_t[] default '{}',
  has_children yes_no_unknown_t,

  religions text[] default '{}',
  communities text[] default '{}',
  mother_tongues text[] default '{}',
  location_countries text[] default '{}',
  location_states text[] default '{}',
  location_cities text[] default '{}',

  education_levels text[] default '{}',
  occupations text[] default '{}',
  lifestyle_diet diet_t[] default '{}',
  lifestyle_drinking freq_t[] default '{}',
  lifestyle_smoking freq_t[] default '{}',
  additional text,

  updated_at timestamp with time zone default now()
);

-- Create onboarding_state table
create table if not exists onboarding_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  status onboarding_status_t default 'in_progress',
  current_step int default 1,
  last_saved_at timestamp with time zone default now()
);

-- Enable RLS on all tables
alter table user_profiles enable row level security;
alter table partner_preferences enable row level security;  
alter table onboarding_state enable row level security;

-- Create RLS policies for user_profiles
create policy "profiles_select_own"
  on user_profiles for select
  using (auth.uid() = user_id);

create policy "profiles_insert_own"
  on user_profiles for insert 
  with check (auth.uid() = user_id);

create policy "profiles_update_own"
  on user_profiles for update 
  using (auth.uid() = user_id);

-- Create RLS policies for partner_preferences
create policy "prefs_select_own"
  on partner_preferences for select
  using (auth.uid() = user_id);

create policy "prefs_insert_own"
  on partner_preferences for insert 
  with check (auth.uid() = user_id);

create policy "prefs_update_own"
  on partner_preferences for update 
  using (auth.uid() = user_id);

-- Create RLS policies for onboarding_state
create policy "onboarding_select_own"
  on onboarding_state for select
  using (auth.uid() = user_id);

create policy "onboarding_insert_own"
  on onboarding_state for insert 
  with check (auth.uid() = user_id);

create policy "onboarding_update_own"
  on onboarding_state for update 
  using (auth.uid() = user_id);

-- Create storage bucket for profile photos (private)
insert into storage.buckets (id, name, public) 
values ('profile-photos', 'profile-photos', false)
on conflict (id) do nothing;

-- Storage RLS policies for private photo access
create policy "photos_select_own"
on storage.objects for select
  using (
    bucket_id = 'profile-photos'
    and split_part(name, '/', 1) = auth.uid()::text
  );

create policy "photos_insert_own"
on storage.objects for insert
  with check (
    bucket_id = 'profile-photos'
    and split_part(name, '/', 1) = auth.uid()::text
  );

create policy "photos_update_own"
on storage.objects for update
  using (
    bucket_id = 'profile-photos' 
    and split_part(name, '/', 1) = auth.uid()::text
  );

create policy "photos_delete_own"
on storage.objects for delete
  using (
    bucket_id = 'profile-photos' 
    and split_part(name, '/', 1) = auth.uid()::text
  );

-- Function to auto-create onboarding state on user signup
create or replace function handle_new_user_onboarding() 
returns trigger as $$
begin
  insert into public.onboarding_state (user_id, status, current_step)
  values (new.id, 'in_progress', 1);
  
  insert into public.user_profiles (user_id, profile_ready)
  values (new.id, false);
  
  insert into public.partner_preferences (user_id)
  values (new.id);
  
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create onboarding state on new user
create trigger on_auth_user_created_onboarding
  after insert on auth.users
  for each row execute procedure handle_new_user_onboarding();