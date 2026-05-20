-- ─────────────────────────────────────────────────────────────────────────────
-- Diet Plan Orders
-- ─────────────────────────────────────────────────────────────────────────────
-- Standalone table — no user_id FK because diet plan purchases don't require
-- website auth. Delivery is purely email-based.
-- ─────────────────────────────────────────────────────────────────────────────

create table public.diet_plan_orders (
    id                  uuid        not null default gen_random_uuid(),

    -- Delivery
    email               text        not null,
    name                text        null,

    -- Razorpay
    razorpay_order_id   text        not null,
    razorpay_payment_id text        null,
    razorpay_signature  text        null,

    -- Money (paise)
    amount              integer     not null default 59900,
    currency            text        not null default 'INR',

    -- Questionnaire snapshot (immutable at purchase time)
    questionnaire_data  jsonb       not null default '{}'::jsonb,

    -- Lifecycle
    status              text        not null default 'pending'
        check (status in ('pending', 'generating', 'fulfilled', 'failed')),

    error_message       text        null,

    -- Timestamps
    created_at          timestamptz not null default now(),
    updated_at          timestamptz not null default now(),
    fulfilled_at        timestamptz null,

    constraint diet_plan_orders_pkey primary key (id),
    constraint uq_diet_plan_orders_razorpay_order unique (razorpay_order_id)
);

create index idx_diet_plan_orders_email  on public.diet_plan_orders(email);
create index idx_diet_plan_orders_status on public.diet_plan_orders(status);

create trigger set_diet_plan_orders_updated_at
    before update on public.diet_plan_orders
    for each row
    execute function public.set_updated_at();

-- Service role only — no user can read/write their own rows directly
alter table public.diet_plan_orders enable row level security;

create policy "Service role full access to diet_plan_orders"
    on public.diet_plan_orders
    for all
    to service_role
    using (true)
    with check (true);
