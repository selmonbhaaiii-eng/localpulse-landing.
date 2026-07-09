create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  role text not null default 'client' check (role in ('admin', 'client')),
  full_name text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.businesses (
  id uuid default gen_random_uuid() primary key,
  owner_id uuid references public.profiles(id) on delete cascade,
  name text not null,
  category text,
  location text,
  gbp_location_id text,
  gbp_connected boolean default false,
  gbp_account_name text,
  gbp_location_name text,
  google_access_token text,
  google_refresh_token text,
  google_token_expiry timestamptz,
  last_review_sync timestamptz,
  total_reviews integer default 0,
  avg_rating numeric(2,1) default 0,
  plan text default 'starter' check (plan in ('starter', 'agency', 'trial')),
  plan_status text default 'trial' check (plan_status in ('active','trial','cancelled','past_due')),
  health_score integer default 0,
  stripe_customer_id text,
  stripe_subscription_id text,
  posts_this_month integer default 0,
  monthly_post_limit integer default 30,
  onboarded_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.reviews (
  id uuid default gen_random_uuid() primary key,
  business_id uuid references public.businesses(id) on delete cascade,
  google_review_id text unique,
  reviewer_name text,
  reviewer_avatar text,
  rating integer check (rating between 1 and 5),
  review_text text,
  extracted_phrases jsonb,
  reply_text text,
  replied_at timestamptz,
  converted_to_post boolean default false,
  phrases_extracted boolean default false,
  post_created boolean default false,
  post_id uuid,
  review_date timestamptz,
  synced_at timestamptz default now(),
  created_at timestamptz default now()
);

create table if not exists public.posts (
  id uuid default gen_random_uuid() primary key,
  business_id uuid references public.businesses(id) on delete cascade,
  content text not null,
  source_type text check (source_type in ('review','seasonal','event','manual','promo')),
  source_review_id uuid references public.reviews(id),
  status text default 'draft' check (status in ('draft','pending_approval','approved','scheduled','published','failed')),
  scheduled_at timestamptz,
  published_at timestamptz,
  gbp_post_id text,
  failed_reason text,
  retry_count integer default 0,
  approved_by uuid references public.profiles(id),
  approved_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.reviews
  drop constraint if exists reviews_post_id_fkey,
  add constraint reviews_post_id_fkey foreign key (post_id) references public.posts(id);

create table if not exists public.automation_rules (
  id uuid default gen_random_uuid() primary key,
  business_id uuid references public.businesses(id) on delete cascade,
  rule_type text check (rule_type in (
    'review_to_post',
    'seasonal_calendar',
    'auto_reply',
    'local_event',
    'frequency_guard'
  )),
  is_active boolean default true,
  config jsonb default '{}',
  last_triggered_at timestamptz,
  trigger_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(business_id, rule_type)
);

create table if not exists public.subscriptions (
  id uuid default gen_random_uuid() primary key,
  business_id uuid references public.businesses(id) on delete cascade,
  stripe_subscription_id text unique,
  stripe_customer_id text,
  plan text not null check (plan in ('starter','agency')),
  status text not null check (status in ('active','trialing','past_due','cancelled','incomplete')),
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.error_logs (
  id uuid default gen_random_uuid() primary key,
  business_id uuid references public.businesses(id),
  error_type text,
  error_message text,
  context jsonb,
  created_at timestamptz default now()
);

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

alter table public.profiles enable row level security;
alter table public.businesses enable row level security;
alter table public.reviews enable row level security;
alter table public.posts enable row level security;
alter table public.automation_rules enable row level security;
alter table public.subscriptions enable row level security;
alter table public.error_logs enable row level security;

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

drop policy if exists "Admin can view all profiles" on public.profiles;
create policy "Admin can view all profiles"
  on public.profiles for select
  using (public.is_admin());

drop policy if exists "Clients see own business" on public.businesses;
create policy "Clients see own business"
  on public.businesses for select
  using (owner_id = auth.uid());

drop policy if exists "Admin sees all businesses" on public.businesses;
create policy "Admin sees all businesses"
  on public.businesses for all
  using (public.is_admin());

drop policy if exists "Clients can update own business" on public.businesses;
create policy "Clients can update own business"
  on public.businesses for update
  using (owner_id = auth.uid());

drop policy if exists "Clients see own reviews" on public.reviews;
create policy "Clients see own reviews"
  on public.reviews for select
  using (
    business_id in (
      select id from public.businesses where owner_id = auth.uid()
    )
  );

drop policy if exists "Admin sees all reviews" on public.reviews;
create policy "Admin sees all reviews"
  on public.reviews for all
  using (public.is_admin());

drop policy if exists "Clients see own posts" on public.posts;
create policy "Clients see own posts"
  on public.posts for all
  using (
    business_id in (
      select id from public.businesses where owner_id = auth.uid()
    )
  );

drop policy if exists "Admin sees all posts" on public.posts;
create policy "Admin sees all posts"
  on public.posts for all
  using (public.is_admin());

drop policy if exists "Clients see own automation rules" on public.automation_rules;
create policy "Clients see own automation rules"
  on public.automation_rules for all
  using (
    business_id in (
      select id from public.businesses where owner_id = auth.uid()
    )
  );

drop policy if exists "Admin sees all automation rules" on public.automation_rules;
create policy "Admin sees all automation rules"
  on public.automation_rules for all
  using (public.is_admin());

drop policy if exists "Clients see own subscriptions" on public.subscriptions;
create policy "Clients see own subscriptions"
  on public.subscriptions for select
  using (
    business_id in (
      select id from public.businesses where owner_id = auth.uid()
    )
  );

drop policy if exists "Admin sees all subscriptions" on public.subscriptions;
create policy "Admin sees all subscriptions"
  on public.subscriptions for all
  using (public.is_admin());

drop policy if exists "Clients see own error logs" on public.error_logs;
create policy "Clients see own error logs"
  on public.error_logs for select
  using (
    business_id in (
      select id from public.businesses where owner_id = auth.uid()
    )
  );

drop policy if exists "Admin sees all error logs" on public.error_logs;
create policy "Admin sees all error logs"
  on public.error_logs for all
  using (public.is_admin());

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'client'),
    new.raw_user_meta_data->>'full_name'
  )
  on conflict (id) do update
    set email = excluded.email,
        role = excluded.role,
        full_name = coalesce(excluded.full_name, public.profiles.full_name),
        updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Seed after creating/inviting test users. Replace UUID_* with profile IDs.
-- insert into public.businesses (owner_id, name, category, location, plan, plan_status, health_score, posts_this_month)
-- values
--   ('UUID_1', 'Kiran''s Bakehouse', 'Bakery', 'Bandra West, Mumbai', 'starter', 'active', 77, 14),
--   ('UUID_2', 'Sharma Hardware', 'Retail', 'Dadar, Mumbai', 'agency', 'active', 83, 52),
--   ('UUID_3', 'Zubeida''s Fashion', 'Retail', 'Colaba, Mumbai', 'starter', 'active', 68, 9),
--   ('UUID_4', 'Mumbai Dental Clinic', 'Dental', 'Andheri West, Mumbai', 'agency', 'active', 91, 38),
--   ('UUID_5', 'Patel''s Garage', 'Automotive', 'Chembur, Mumbai', 'starter', 'active', 55, 7),
--   ('UUID_6', 'Oak Lane Salon', 'Salon', 'Juhu, Mumbai', 'agency', 'active', 88, 67);
