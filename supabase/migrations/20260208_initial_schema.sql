-- Create the waitlist table
create table public.waitlist (
  id uuid not null default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  country_code text not null,
  created_at timestamp with time zone not null default now(),
  constraint waitlist_pkey primary key (id),
  constraint waitlist_email_unique unique (email)
);

-- Enable Row Level Security
alter table public.waitlist enable row level security;

-- Create a policy to allow anyone to insert valid data
create policy "Allow public inserts"
  on public.waitlist
  for insert
  to anon
  with check (true);

-- Create a policy to allow only authenticated service roles to view data (or admin)
create policy "Allow internal read access"
  on public.waitlist
  for select
  to service_role
  using (true);
