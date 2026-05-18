export const PROGRAM_OPTIONS = [
  { slug: "six_day_reset", label: "6-Day Control" },
  { slug: "ninety_day_transform", label: "90-Day Smoking Reset" },
  { slug: "sleep_disorder_reset", label: "21-Day Deep Sleep Reset" },
  { slug: "energy_vitality", label: "14-Day Energy Restore" },
  { slug: "age_reversal", label: "90-Day Biohacking Reset" },
  { slug: "male_sexual_health", label: "30-Day Men's Vitality Reset" },
] as const;

export type ProgramSlug = (typeof PROGRAM_OPTIONS)[number]["slug"];

export const PROGRAM_LABELS: Record<ProgramSlug, string> = Object.fromEntries(
  PROGRAM_OPTIONS.map((option) => [option.slug, option.label])
) as Record<ProgramSlug, string>;

export function isProgramSlug(value: string): value is ProgramSlug {
  return PROGRAM_OPTIONS.some((option) => option.slug === value);
}
