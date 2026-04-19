-- Create the enquiries table
create table if not exists public.enquiries (
  id uuid not null default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  message text not null,
  created_at timestamp with time zone not null default now(),
  constraint enquiries_pkey primary key (id)
);

alter table public.enquiries enable row level security;

create policy "Allow public enquiry inserts"
  on public.enquiries
  for insert
  to anon
  with check (true);

create policy "Allow internal enquiry read access"
  on public.enquiries
  for select
  to service_role
  using (true);
