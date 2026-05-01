create table if not exists public.outbound_email_deliveries (
    id uuid primary key default gen_random_uuid(),
    email_type text not null,
    dedupe_key text not null,
    user_id uuid null references auth.users(id) on delete set null,
    recipient_email text null,
    program_slug text null,
    provider text null,
    provider_event_id text null,
    provider_transaction_id text null,
    status text not null default 'pending'
        check (status in ('pending', 'sent', 'failed')),
    last_error text null,
    metadata jsonb null,
    sent_at timestamptz null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint outbound_email_deliveries_dedupe_key_key unique (dedupe_key)
);

create index if not exists idx_outbound_email_deliveries_user_type
    on public.outbound_email_deliveries(user_id, email_type);

create trigger set_outbound_email_deliveries_updated_at
    before update on public.outbound_email_deliveries
    for each row
    execute function public.set_updated_at();

alter table public.outbound_email_deliveries enable row level security;

create policy "Service role full access to outbound_email_deliveries"
    on public.outbound_email_deliveries
    for all
    to service_role
    using (true)
    with check (true);
