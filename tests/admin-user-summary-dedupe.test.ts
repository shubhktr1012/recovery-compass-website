import { describe, expect, it } from "vitest";

import { dedupeAdminUserSummaryBullets } from "@/lib/admin/user-summary-dedupe";
import type { AdminUserSummary } from "@/lib/admin/user-summary-schema";
import { ADMIN_USER_SUMMARY_SYSTEM_PROMPT } from "@/lib/admin/user-summary-generation";

function buildSummary(overrides: Partial<AdminUserSummary> = {}): AdminUserSummary {
  const emptySection = { summary: "Section summary.", facts: [], bullets: [] as string[] };

  return {
    headline: "Test user headline",
    overview: { summary: "Overview.", facts: [], bullets: [] },
    programOwnership: emptySection,
    appUsageAndActivity: emptySection,
    purchasesAndRevenue: emptySection,
    dietAndAddOns: emptySection,
    profileAndIntent: emptySection,
    communication: emptySection,
    salesAndOutreach: emptySection,
    risksAndOpenIssues: emptySection,
    nextBestAction: "Send a check-in.",
    ...overrides,
  };
}

describe("dedupeAdminUserSummaryBullets", () => {
  it("removes identical bullets from later sections", () => {
    const summary = buildSummary({
      overview: {
        summary: "Free Detox user.",
        facts: [],
        bullets: ["Completed onboarding"],
      },
      profileAndIntent: {
        summary: "Smoking focus.",
        facts: [],
        bullets: ["Completed onboarding", "Primary concern: smoking"],
      },
      salesAndOutreach: {
        summary: "Warm outreach.",
        facts: [],
        bullets: ["Completed onboarding"],
      },
    });

    const deduped = dedupeAdminUserSummaryBullets(summary);

    expect(deduped.overview.bullets).toEqual(["Completed onboarding"]);
    expect(deduped.profileAndIntent.bullets).toEqual(["Primary concern: smoking"]);
    expect(deduped.salesAndOutreach.bullets).toEqual([]);
  });

  it("removes identical facts from later sections", () => {
    const summary = buildSummary({
      overview: {
        summary: "",
        facts: [{ label: "Onboarding", value: "Complete" }],
        bullets: [],
      },
      profileAndIntent: {
        summary: "",
        facts: [
          { label: "Onboarding", value: "Complete" },
          { label: "Primary concern", value: "Smoking" },
        ],
        bullets: [],
      },
    });

    const deduped = dedupeAdminUserSummaryBullets(summary);

    expect(deduped.overview.facts).toEqual([{ label: "Onboarding", value: "Complete" }]);
    expect(deduped.profileAndIntent.facts).toEqual([
      { label: "Primary concern", value: "Smoking" },
    ]);
  });

  it("treats punctuation-only differences as duplicates", () => {
    const summary = buildSummary({
      overview: {
        summary: "Overview.",
        facts: [],
        bullets: ["5 programs owned."],
      },
      programOwnership: {
        summary: "Programs.",
        facts: [],
        bullets: ["5 programs owned"],
      },
    });

    const deduped = dedupeAdminUserSummaryBullets(summary);

    expect(deduped.overview.bullets).toEqual(["5 programs owned."]);
    expect(deduped.programOwnership.bullets).toEqual([]);
  });

  it("keeps unique bullets in each section", () => {
    const summary = buildSummary({
      overview: { summary: "Overview.", facts: [], bullets: ["Onboarded"] },
      appUsageAndActivity: {
        summary: "Active.",
        facts: [],
        bullets: ["Last active yesterday"],
      },
    });

    const deduped = dedupeAdminUserSummaryBullets(summary);

    expect(deduped.overview.bullets).toEqual(["Onboarded"]);
    expect(deduped.appUsageAndActivity.bullets).toEqual(["Last active yesterday"]);
  });
});

describe("admin user summary anti-redundancy prompt", () => {
  it("includes section ownership and deduplication rules", () => {
    expect(ADMIN_USER_SUMMARY_SYSTEM_PROMPT).toContain("Do not repeat the same fact");
    expect(ADMIN_USER_SUMMARY_SYSTEM_PROMPT).toContain("Section ownership");
    expect(ADMIN_USER_SUMMARY_SYSTEM_PROMPT).toContain("profileAndIntent");
    expect(ADMIN_USER_SUMMARY_SYSTEM_PROMPT).toContain("do not restate raw counts");
    expect(ADMIN_USER_SUMMARY_SYSTEM_PROMPT).toContain("facts array");
  });
});
