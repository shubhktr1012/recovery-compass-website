-- ─────────────────────────────────────────────────────────────────────────────
-- Diet plan checkout add-on claim support
-- ─────────────────────────────────────────────────────────────────────────────
-- Program checkout can include a diet-plan add-on before the questionnaire is
-- completed. These columns link the paid checkout transaction to a later
-- questionnaire submission without relying on email-only lookup.

alter table public.diet_plan_orders
    add column if not exists source text not null default 'standalone',
    add column if not exists source_transaction_id uuid null references public.transactions(id) on delete set null,
    add column if not exists claim_token_hash text null,
    add column if not exists claimed_at timestamptz null;

alter table public.diet_plan_orders
    drop constraint if exists diet_plan_orders_status_check;

alter table public.diet_plan_orders
    add constraint diet_plan_orders_status_check
    check (status in ('awaiting_questionnaire', 'pending', 'generating', 'fulfilled', 'failed'));

do $$
begin
    if not exists (
        select 1
        from pg_constraint
        where conname = 'diet_plan_orders_source_check'
          and conrelid = 'public.diet_plan_orders'::regclass
    ) then
        alter table public.diet_plan_orders
            add constraint diet_plan_orders_source_check
            check (source in ('standalone', 'checkout_addon'));
    end if;
end $$;

create index if not exists idx_diet_plan_orders_source_transaction_id
    on public.diet_plan_orders(source_transaction_id);

create index if not exists idx_diet_plan_orders_claim_lookup
    on public.diet_plan_orders(id, claim_token_hash)
    where claim_token_hash is not null;
