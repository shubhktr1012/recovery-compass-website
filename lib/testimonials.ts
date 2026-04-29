import { createSupabaseServerClient } from "@/lib/supabase-server";

export interface HomepageTestimonial {
  id: string;
  quote: string;
  displayName: string;
  attribution: string | null;
  programSlug: string | null;
}

type FeaturedHomepageTestimonialRow = {
  id: string;
  quote: string;
  display_name: string;
  age: number | null;
  city: string | null;
  program_slug: string | null;
  sort_order: number;
  created_at: string;
};

export function formatTestimonialAttribution(age: number | null, city: string | null) {
  const parts = [
    typeof age === "number" ? String(age) : null,
    typeof city === "string" && city.trim().length > 0 ? city.trim() : null,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(" · ") : null;
}

export async function getFeaturedHomepageTestimonials(): Promise<HomepageTestimonial[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("id, quote, display_name, age, city, program_slug, sort_order, created_at")
    .eq("is_active", true)
    .eq("is_featured_homepage", true)
    .eq("consent_status", "approved")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load homepage testimonials", error);
    return [];
  }

  return ((data ?? []) as FeaturedHomepageTestimonialRow[]).map((testimonial) => ({
    id: testimonial.id,
    quote: testimonial.quote,
    displayName: testimonial.display_name,
    attribution: formatTestimonialAttribution(testimonial.age, testimonial.city),
    programSlug: testimonial.program_slug,
  }));
}
