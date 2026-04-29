insert into public.testimonials (
  quote,
  display_name,
  age,
  city,
  program_slug,
  source_type,
  consent_status,
  is_active,
  is_featured_homepage,
  sort_order,
  internal_notes
)
select
  testimonial.quote,
  testimonial.display_name,
  testimonial.age,
  testimonial.city,
  testimonial.program_slug,
  testimonial.source_type,
  testimonial.consent_status,
  testimonial.is_active,
  testimonial.is_featured_homepage,
  testimonial.sort_order,
  testimonial.internal_notes
from (
  values
    (
      'I had been smoking for 11 years. Tried patches, tried cold turkey twice. The daily cards made it feel less like punishment and more like something I was actually doing for myself. 34 days now.',
      'Arjun M.',
      31,
      'Bengaluru',
      '90-day-smoke-free-journey',
      'sample',
      'approved',
      true,
      true,
      10,
      'Founder-provided sample testimonial copy for homepage rotation.'
    ),
    (
      'My husband noticed before I did. I was sleeping through the night for the first time in years. The program is quiet and consistent - no drama, just results.',
      'Sunita R.',
      44,
      'Pune',
      '90-day-smoke-free-journey',
      'sample',
      'approved',
      true,
      true,
      20,
      'Founder-provided sample testimonial copy for homepage rotation.'
    ),
    (
      'I used to set four alarms and still wake up exhausted. Two weeks in I was falling asleep before 11 without trying. Something actually shifted.',
      'Karan P.',
      28,
      'Mumbai',
      '21-day-deep-sleep-reset',
      'sample',
      'approved',
      true,
      true,
      30,
      'Founder-provided sample testimonial copy for homepage rotation.'
    ),
    (
      'As a working mother of two I had completely given up on sleeping well. This gave me a structure I could actually follow. Simple, not overwhelming.',
      'Priya N.',
      38,
      'Chennai',
      '21-day-deep-sleep-reset',
      'sample',
      'approved',
      true,
      true,
      40,
      'Founder-provided sample testimonial copy for homepage rotation.'
    ),
    (
      'I was skeptical because I''ve tried everything. By week three my colleague asked if I''d changed my skincare. I hadn''t - just the exercises and the sleep routine.',
      'Meera S.',
      42,
      'Delhi',
      'radiance-journey',
      'sample',
      'approved',
      true,
      true,
      50,
      'Founder-provided sample testimonial copy for homepage rotation.'
    ),
    (
      'The science explanations made me trust it. I''m not someone who does things without understanding why. 45 days in and my jawline is visibly different.',
      'Ananya K.',
      39,
      'Hyderabad',
      'radiance-journey',
      'sample',
      'approved',
      true,
      true,
      60,
      'Founder-provided sample testimonial copy for homepage rotation.'
    ),
    (
      'Worth every rupee. I keep recommending it to people and they don''t believe me until they try it.',
      'Rohit V.',
      35,
      'Ahmedabad',
      null,
      'sample',
      'approved',
      true,
      true,
      70,
      'Founder-provided sample testimonial copy for homepage rotation.'
    ),
    (
      'I downloaded it on a bad night and just started. That was 60 days ago.',
      'Divya T.',
      29,
      'Bangalore',
      null,
      'sample',
      'approved',
      true,
      true,
      80,
      'Founder-provided sample testimonial copy for homepage rotation.'
    )
) as testimonial(
  quote,
  display_name,
  age,
  city,
  program_slug,
  source_type,
  consent_status,
  is_active,
  is_featured_homepage,
  sort_order,
  internal_notes
)
where not exists (
  select 1
  from public.testimonials existing
  where existing.quote = testimonial.quote
    and existing.display_name = testimonial.display_name
);
