-- Diet plan price update
-- Standalone and checkout add-on price are both Rs 1,299.

alter table public.diet_plan_orders
    alter column amount set default 129900;
