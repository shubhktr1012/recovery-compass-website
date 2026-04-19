BEGIN;

-- Normalize historical transaction item program slugs from website marketing
-- aliases into the canonical app/database program slugs.
--
-- This keeps transactions.items consistent with program_access and app content
-- slugs while leaving RevenueCat provider identifiers separate.

WITH normalized_items AS (
  SELECT
    t.id,
    jsonb_agg(
      CASE item->>'program_slug'
        WHEN '6-day-compass-reset' THEN jsonb_set(item, '{program_slug}', to_jsonb('six_day_reset'::text))
        WHEN '90-day-smoke-free-journey' THEN jsonb_set(item, '{program_slug}', to_jsonb('ninety_day_transform'::text))
        WHEN '14-day-sleep-reset' THEN jsonb_set(item, '{program_slug}', to_jsonb('sleep_disorder_reset'::text))
        WHEN '21-day-energy-reset' THEN jsonb_set(item, '{program_slug}', to_jsonb('energy_vitality'::text))
        WHEN 'mens-vitality-reset-program' THEN jsonb_set(item, '{program_slug}', to_jsonb('male_sexual_health'::text))
        WHEN 'radiance-journey' THEN jsonb_set(item, '{program_slug}', to_jsonb('age_reversal'::text))
        ELSE item
      END
      ORDER BY ordinality
    ) AS items
  FROM public.transactions t
  CROSS JOIN LATERAL jsonb_array_elements(t.items) WITH ORDINALITY AS item(item, ordinality)
  GROUP BY t.id
)
UPDATE public.transactions t
SET items = normalized_items.items
FROM normalized_items
WHERE t.id = normalized_items.id
  AND EXISTS (
    SELECT 1
    FROM jsonb_array_elements(t.items) AS existing_item
    WHERE existing_item->>'program_slug' IN (
      '6-day-compass-reset',
      '90-day-smoke-free-journey',
      '14-day-sleep-reset',
      '21-day-energy-reset',
      'mens-vitality-reset-program',
      'radiance-journey'
    )
  );

COMMIT;
