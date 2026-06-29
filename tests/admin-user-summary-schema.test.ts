import { describe, expect, it } from "vitest";

import { buildAppUsageSnapshot } from "@/lib/admin/user-app-usage";
import {
  formatAdminUserSummaryPlainText,
  isAdminUserSummaryV3,
  validateAdminUserSummaryInsights,
} from "@/lib/admin/user-summary-schema";
import { buildAdminUserSummarySnapshot } from "@/lib/admin/user-summary-snapshot";
import type { AdminUserSummaryContext } from "@/lib/admin/user-summary-context";

const sampleInsights = {
  headline: "Active Free Detox user exploring paid programs",
  salesTalkingPoints: ["Reference Free Detox progress", "Offer Smoking Reset trial"],
  recommendedTone: "Warm and encouraging",
  risks: ["No paid purchase yet"],
  nextBestAction: "Send a WhatsApp check-in about day 2 progress.",
};

function minimalContext(): AdminUserSummaryContext {
  return {
    appUsage: buildAppUsageSnapshot({
      activity: [],
      dayStates: [],
      eventCountsLast30Days: {},
      freeDetoxProgress: {
        completedAt: null,
        completedDays: [1],
        currentDay: 2,
        partialDays: [],
        updatedAt: "2026-06-20T12:00:00.000Z",
      },
      freeTierActivatedAt: "2026-06-18T10:00:00.000Z",
      journalCount: 1,
      journalLastEntryDate: "2026-06-19",
      programs: [],
      reflectionCount: 0,
      reflectionLast: null,
      routineCheckinCount: 0,
      routineCheckinLastAt: null,
    }),
    contextVersion: 3,
    dataGaps: [],
    detail: {
      dayStates: [],
      dietOrders: [],
      emails: [],
      preference: null,
      profile: {
        createdAt: "2026-01-15T10:00:00.000Z",
        email: "user@example.com",
        id: "user-1",
        onboardingComplete: true,
        recommendedProgram: "Smoking Reset",
      },
      programs: [],
      transactions: [],
    },
    extras: {
      consecutiveAbsentDays: 0,
      detoxLeads: [],
      consultationLeads: [],
      notificationsEnabled: true,
      onboardingCompletedAt: "2026-01-16T10:00:00.000Z",
      phoneNumber: null,
      phoneVerifiedAt: null,
      primaryConcern: "Smoking",
      pushOptIn: true,
      questionnaireAnswersSummary: {},
      questionnaireRuns: [],
      referralRedemptions: [],
      timezone: "Asia/Kolkata",
      totalWebSpendInr: "₹0",
      whatsappMarketingConsentAt: null,
      whatsappServiceConsentAt: null,
    },
    generatedForRole: "ops",
  } as AdminUserSummaryContext;
}

describe("admin user summary schema v3", () => {
  it("validates insights payload", () => {
    const result = validateAdminUserSummaryInsights(sampleInsights);
    expect(result.success).toBe(true);
  });

  it("rejects invalid insights array lengths", () => {
    const result = validateAdminUserSummaryInsights({
      ...sampleInsights,
      salesTalkingPoints: [],
    });
    expect(result.success).toBe(false);
  });

  it("formats plain text from snapshot + insights", () => {
    const snapshot = buildAdminUserSummarySnapshot(minimalContext());
    const summary = {
      schemaVersion: 3 as const,
      snapshot,
      insights: sampleInsights,
    };

    expect(isAdminUserSummaryV3(summary)).toBe(true);

    const text = formatAdminUserSummaryPlainText(summary);
    expect(text).toContain("Active Free Detox user exploring paid programs");
    expect(text).toContain("Account type: Free Detox user");
    expect(text).toContain("## Sales & outreach");
    expect(text).toContain("Next best action");
    expect(text).not.toContain("Note:");
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
