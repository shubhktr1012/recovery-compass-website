import {
  CANONICAL_PROGRAM_DISPLAY_NAMES,
  CANONICAL_PROGRAM_SLUGS,
  checkoutPrograms,
  type CanonicalProgramSlug,
} from "@/lib/public-programs";

export const PROGRAM_OPTIONS = checkoutPrograms.map((program) => ({
  slug: program.dbSlug,
  label: program.title,
})) satisfies ReadonlyArray<{ slug: CanonicalProgramSlug; label: string }>;

export type ProgramSlug = CanonicalProgramSlug;

export const PROGRAM_LABELS = CANONICAL_PROGRAM_DISPLAY_NAMES;

export function isProgramSlug(value: string): value is ProgramSlug {
  return CANONICAL_PROGRAM_SLUGS.includes(value as ProgramSlug);
}

export function isAdminGrantableProgramSlug(value: string): value is ProgramSlug {
  return PROGRAM_OPTIONS.some((program) => program.slug === value);
}
