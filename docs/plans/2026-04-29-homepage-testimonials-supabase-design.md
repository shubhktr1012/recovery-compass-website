## Summary

Move homepage testimonials out of hardcoded UI arrays and into Supabase so Recovery Compass can curate, activate, and reorder public testimonials without code edits.

## Goals

- Let non-developers manage homepage testimonials in the Supabase dashboard.
- Keep homepage rendering limited to approved, live testimonials.
- Preserve a clean migration path to a CMS later by isolating data access from presentation.

## Non-Goals

- Building an internal admin UI.
- Seeding fabricated testimonials into production.
- Solving long-form testimonial management for every future page in this change.

## Data Model

Create `public.testimonials` in the website Supabase schema with:

- `quote`
- `display_name`
- `age`
- `city`
- `program_slug`
- `source_type`
- `consent_status`
- `is_active`
- `is_featured_homepage`
- `sort_order`
- `internal_notes`
- timestamps

Use text checks for `source_type` and `consent_status` so the dashboard stays simple while the values remain constrained.

## Access Model

Enable RLS and allow public `select` only for rows where:

- `is_active = true`
- `consent_status = 'approved'`

Grant `service_role` full access for internal operations. Public users should never be able to read drafts, rejected entries, or inactive rows.

## Rendering Model

Homepage data flow:

1. `app/page.tsx` fetches featured testimonials on the server.
2. The data is passed into `home-page-client.tsx`.
3. `HeroOmega` receives the array and passes it to `TestimonialMarquee`.
4. The marquee becomes a pure renderer with no embedded content source.

If no approved featured testimonials exist, the hero strip should not render.

## Presentation Changes

- Remove implied 5-star ratings because the testimonial source data does not include ratings.
- Stop using stock-looking avatar images. Use initials fallback only.
- Show attribution as a compact line built from age and city when present.

## Operational Workflow

Anjan manages testimonials directly in Supabase:

1. Create a row.
2. Leave `is_active = false` until cleared for publication.
3. Set `consent_status = 'approved'` once usable.
4. Set `is_featured_homepage = true` for homepage candidates.
5. Adjust `sort_order` to control the marquee order.

## Risks

- Empty state after launch if no approved testimonials are added.
- Inconsistent `program_slug` naming if editorial input is not normalized.

## Mitigations

- Hide the strip when there is no published data.
- Keep data access behind one helper so CMS migration later only swaps the source layer.
