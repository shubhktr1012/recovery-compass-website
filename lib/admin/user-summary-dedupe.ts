import type {
  AdminUserSummary,
  AdminUserSummaryFact,
  AdminUserSummarySection,
} from "@/lib/admin/user-summary-schema";

const SECTION_PRIORITY = [
  "overview",
  "profileAndIntent",
  "programOwnership",
  "appUsageAndActivity",
  "purchasesAndRevenue",
  "dietAndAddOns",
  "communication",
  "salesAndOutreach",
  "risksAndOpenIssues",
] as const satisfies ReadonlyArray<keyof AdminUserSummary>;

function normalizeText(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

function factKey(fact: AdminUserSummaryFact) {
  return `${normalizeText(fact.label)}::${normalizeText(fact.value)}`;
}

function dedupeSectionFacts(
  section: AdminUserSummarySection,
  seen: Set<string>
): AdminUserSummarySection {
  if (!section.facts?.length) {
    return section;
  }

  const facts = section.facts.filter((fact) => {
    const key = factKey(fact);
    if (!key || seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });

  return facts.length === section.facts.length ? section : { ...section, facts };
}

function dedupeSectionBullets(
  section: AdminUserSummarySection,
  seen: Set<string>
): AdminUserSummarySection {
  const bullets = section.bullets.filter((bullet) => {
    const key = normalizeText(bullet);
    if (!key || seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });

  return bullets.length === section.bullets.length ? section : { ...section, bullets };
}

function dedupeSection(section: AdminUserSummarySection, seen: Set<string>) {
  return dedupeSectionBullets(dedupeSectionFacts(section, seen), seen);
}

export function dedupeAdminUserSummaryBullets(summary: AdminUserSummary): AdminUserSummary {
  const seen = new Set<string>();
  const next = { ...summary };

  for (const key of SECTION_PRIORITY) {
    next[key] = dedupeSection(summary[key], seen);
  }

  return next;
}
