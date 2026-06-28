import { describe, expect, it } from "vitest";

import { buildAppUsageSnapshot } from "@/lib/admin/user-app-usage";
import {
  formatAdminUserSummaryPlainText,
  validateAdminUserSummaryJson,
} from "@/lib/admin/user-summary-schema";

describe("admin user summary schema", () => {
  const validSummary = {
    headline: "Active Free Detox user exploring paid programs",
    overview: {
      summary: "Signed up recently and completed onboarding.",
      bullets: ["Recommended Smoking Reset"],
    },
    programOwnership: {
      summary: "No paid programs yet.",
      bullets: ["Free Detox activated"],
    },
    appUsageAndActivity: {
      summary: "Working through Free Detox day 2.",
      bullets: ["Last active yesterday"],
    },
    purchasesAndRevenue: {
      summary: "No web purchases.",
      bullets: [],
    },
    dietAndAddOns: {
      summary: "No diet plan orders.",
      bullets: [],
    },
    profileAndIntent: {
      summary: "Primary concern is smoking.",
      bullets: [],
    },
    communication: {
      summary: "Push opt-in enabled.",
      bullets: [],
    },
    salesAndOutreach: {
      summary: "Pitch Smoking Reset while momentum is high.",
      bullets: ["Reference Free Detox progress"],
    },
    risksAndOpenIssues: {
      summary: "No open delivery issues.",
      bullets: [],
    },
    nextBestAction: "Send a WhatsApp check-in about day 2 progress.",
  };

  it("validates a complete summary payload", () => {
    const result = validateAdminUserSummaryJson(validSummary);
    expect(result.success).toBe(true);
  });

  it("formats plain text for copy/export", () => {
    const result = validateAdminUserSummaryJson(validSummary);
    if (!result.success) {
      throw new Error("Expected valid summary");
    }

    const text = formatAdminUserSummaryPlainText(result.data);
    expect(text).toContain("Active Free Detox user");
    expect(text).toContain("## Sales & outreach");
    expect(text).toContain("Next best action");
  });
});

describe("buildAppUsageSnapshot", () => {
  it("marks Free Detox-only users as in progress", () => {
    const snapshot = buildAppUsageSnapshot({
      activity: [
        {
          detail: "Day 2 · card intro",
          eventType: "card_completed",
          id: "evt-1",
          label: "Card completed",
          occurredAt: new Date().toISOString(),
          programSlug: "free_detox_reset",
          userId: "user-1",
        },
      ],
      dayStates: [],
      eventCountsLast30Days: { card_completed: 2 },
      freeDetoxProgress: {
        completedAt: null,
        completedDays: [1],
        currentDay: 2,
        partialDays: [],
        updatedAt: new Date().toISOString(),
      },
      freeTierActivatedAt: new Date().toISOString(),
      journalCount: 1,
      journalLastEntryDate: "2026-06-20",
      programs: [],
      reflectionCount: 0,
      reflectionLast: null,
      routineCheckinCount: 0,
      routineCheckinLastAt: null,
    });

    expect(snapshot.freeDetox.status).toBe("in_progress");
    expect(snapshot.freeDetox.currentDay).toBe(2);
    expect(snapshot.engagementLevel).toBe("active");
  });

  it("marks dormant users without recent events", () => {
    const snapshot = buildAppUsageSnapshot({
      activity: [],
      dayStates: [],
      eventCountsLast30Days: {},
      freeDetoxProgress: null,
      freeTierActivatedAt: null,
      journalCount: 0,
      journalLastEntryDate: null,
      programs: [],
      reflectionCount: 0,
      reflectionLast: null,
      routineCheckinCount: 0,
      routineCheckinLastAt: null,
    });

    expect(snapshot.engagementLevel).toBe("never_started");
    expect(snapshot.freeDetox.status).toBe("not_activated");
  });
});
