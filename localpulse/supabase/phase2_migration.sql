alter table public.businesses
  add column if not exists gbp_connected boolean default false,
  add column if not exists gbp_account_name text,
  add column if not exists gbp_location_name text,
  add column if not exists google_access_token text,
  add column if not exists google_token_expiry timestamptz,
  add column if not exists last_review_sync timestamptz,
  add column if not exists total_reviews integer default 0,
  add column if not exists avg_rating numeric(2,1) default 0;

alter table public.reviews
  add column if not exists phrases_extracted boolean default false,
  add column if not exists post_created boolean default false;

create table if not exists public.error_logs (
  id uuid default gen_random_uuid() primary key,
  business_id uuid references public.businesses(id),
  error_type text,
  error_message text,
  context jsonb,
  created_at timestamptz default now()
);

alter table public.error_logs enable row level security;

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
