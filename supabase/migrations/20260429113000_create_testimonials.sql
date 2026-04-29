create table if not exists public.testimonials (
  id uuid not null default gen_random_uuid(),
  quote text not null check (length(btrim(quote)) > 0),
  display_name text not null check (length(btrim(display_name)) > 0),
  age integer check (age is null or age between 13 and 120),
  city text check (city is null or length(btrim(city)) > 0),
  program_slug text check (program_slug is null or length(btrim(program_slug)) > 0),
  source_type text not null default 'customer'
    check (source_type in ('customer', 'expert', 'sample')),
  consent_status text not null default 'pending'
    check (consent_status in ('pending', 'approved', 'rejected')),
  is_active boolean not null default false,
  is_featured_homepage boolean not null default false,
  sort_order integer not null default 100,
  internal_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint testimonials_pkey primary key (id)
);

create index if not exists idx_testimonials_homepage_feed
  on public.testimonials (sort_order, created_at desc)
  where is_active = true
    and is_featured_homepage = true
    and consent_status = 'approved';

create trigger set_testimonials_updated_at
  before update on public.testimonials
  for each row
  execute function public.set_updated_at();

alter table public.testimonials enable row level security;

create policy "Allow public reads of approved active testimonials"
  on public.testimonials
  for select
  using (is_active = true and consent_status = 'approved');

create policy "Service role full access to testimonials"
  on public.testimonials
  for all
  to service_role
  using (true)
  with check (true);
