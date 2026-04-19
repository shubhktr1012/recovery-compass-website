-- ─────────────────────────────────────────────────────────────────────────────
-- Shared: Automatic updated_at trigger function
-- Reusable across any table that needs updated_at maintenance.
-- ─────────────────────────────────────────────────────────────────────────────

create or replace function public.set_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- ─────────────────────────────────────────────────────────────────────────────
-- Commerce: Transactions Table
-- ─────────────────────────────────────────────────────────────────────────────
-- One row per checkout payment event.
-- Provides idempotency (unique on provider + provider IDs), audit trail, and
-- a clean separation between "payment happened" and "entitlement granted."

create table public.transactions (
    id              uuid        not null default gen_random_uuid(),
    user_id         uuid        not null references auth.users(id),

    -- Provider identifiers (composite-unique for future multi-provider support)
    provider            text    not null default 'razorpay' check (provider in ('razorpay')),
    provider_order_id   text    not null,       -- e.g. order_xxx
    provider_payment_id text    null,           -- e.g. pay_xxx (null until captured)
    provider_signature  text    null,           -- HMAC signature (for audit)

    -- Money (amount in subunits; paise for INR)
    amount          integer     not null check (amount > 0),
    currency        text        not null default 'INR' check (currency in ('INR')),

    -- Lifecycle
    payment_status      text    not null default 'created'
        check (payment_status in ('created', 'paid', 'failed', 'refunded')),
    fulfillment_status  text    not null default 'pending'
        check (fulfillment_status in ('pending', 'fulfilled', 'fulfillment_failed')),

    -- Checkout snapshot (immutable receipt, must be a JSON array)
    items           jsonb       not null default '[]'::jsonb
        check (jsonb_typeof(items) = 'array'),
    -- Example shape:
    -- [
    --   { "program_slug": "six_day_reset", "title": "6-Day Reset Program", "price_inr": 1999, "quantity": 1 }
    -- ]

    -- Freeform context (Razorpay response snapshots, user agent, etc.)
    metadata        jsonb       null,

    -- Timestamps
    created_at      timestamptz not null default now(),
    updated_at      timestamptz not null default now(),

    -- Constraints
    constraint transactions_pkey primary key (id),
    constraint uq_transactions_provider_order unique (provider, provider_order_id),
    constraint uq_transactions_provider_payment unique (provider, provider_payment_id)
);

-- Index for user-level transaction queries
create index idx_transactions_user_id on public.transactions(user_id);

-- Auto-maintain updated_at on every row update
create trigger set_transactions_updated_at
    before update on public.transactions
    for each row
    execute function public.set_updated_at();

-- Protect commerce records — only server-side service_role can read/write
alter table public.transactions enable row level security;

create policy "Service role full access to transactions"
    on public.transactions
    for all
    to service_role
    using (true)
    with check (true);
