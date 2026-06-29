import type { AdminUserSummary, AdminUserSummarySection } from "@/lib/admin/user-summary-schema";

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

function normalizeBullet(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

function dedupeSectionBullets(
  section: AdminUserSummarySection,
  seen: Set<string>
): AdminUserSummarySection {
  const bullets = section.bullets.filter((bullet) => {
    const key = normalizeBullet(bullet);
    if (!key || seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });

  return bullets.length === section.bullets.length ? section : { ...section, bullets };
}

export function dedupeAdminUserSummaryBullets(summary: AdminUserSummary): AdminUserSummary {
  const seen = new Set<string>();
  const next = { ...summary };

  for (const key of SECTION_PRIORITY) {
    next[key] = dedupeSectionBullets(summary[key], seen);
  }

  return next;
}
