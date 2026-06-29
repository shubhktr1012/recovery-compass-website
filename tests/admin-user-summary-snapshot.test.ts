import { describe, expect, it } from "vitest";

import type { AdminUserSummaryContext } from "@/lib/admin/user-summary-context";
import {
  buildAdminUserSummarySnapshot,
  EMPTY_SUMMARY_VALUE,
} from "@/lib/admin/user-summary-snapshot";
import { buildAppUsageSnapshot } from "@/lib/admin/user-app-usage";

function rowValue(
  snapshot: ReturnType<typeof buildAdminUserSummarySnapshot>,
  section: keyof ReturnType<typeof buildAdminUserSummarySnapshot>,
  key: string
) {
  return snapshot[section].find((row) => row.key === key)?.value;
}

function baseContext(overrides: Partial<AdminUserSummaryContext> = {}): AdminUserSummaryContext {
  const appUsage = buildAppUsageSnapshot({
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

  return {
    appUsage,
    contextVersion: 3,
    dataGaps: [],
    detail: {
      dayStates: [],
      dietOrders: [],
      emails: [],
      preference: null,
      profile: {
        createdAt: "2026-01-15T10:00:00.000Z",
        email: "prospect@example.com",
        id: "user-prospect",
        onboardingComplete: false,
        recommendedProgram: null,
      },
      programs: [],
      transactions: [],
    },
    extras: {
      consecutiveAbsentDays: 0,
      detoxLeads: [],
      consultationLeads: [],
      notificationsEnabled: false,
      onboardingCompletedAt: null,
      phoneNumber: null,
      phoneVerifiedAt: null,
      primaryConcern: null,
      pushOptIn: false,
      questionnaireAnswersSummary: {},
      questionnaireRuns: [],
      referralRedemptions: [],
      timezone: null,
      totalWebSpendInr: "₹0",
      whatsappMarketingConsentAt: null,
      whatsappServiceConsentAt: null,
    },
    generatedForRole: "ops",
    ...overrides,
  } as AdminUserSummaryContext;
}

describe("buildAdminUserSummarySnapshot", () => {
  it("renders fixed overview labels for a prospect with no activity", () => {
    const snapshot = buildAdminUserSummarySnapshot(baseContext());

    expect(snapshot.overview.map((row) => row.label)).toEqual([
      "Account type",
      "Member since",
      "Onboarding",
      "Recommended program",
      "Active preference",
      "Queue reviewed",
    ]);
    expect(rowValue(snapshot, "overview", "accountType")).toBe("Prospect / no program access");
    expect(rowValue(snapshot, "appUsageAndActivity", "engagement")).toBe(
      "Never started / no tracked activity"
    );
    expect(rowValue(snapshot, "appUsageAndActivity", "lastActive")).toBe(EMPTY_SUMMARY_VALUE);
  });

  it("formats Free Detox user rows with expected values", () => {
    const recentActivityAt = new Date().toISOString();
    const appUsage = buildAppUsageSnapshot({
      activity: [
        {
          detail: "Day 2 · card intro",
          eventType: "card_completed",
          id: "evt-1",
          label: "Card completed",
          occurredAt: recentActivityAt,
          programSlug: "free_detox_reset",
          userId: "user-fd",
        },
      ],
      dayStates: [],
      eventCountsLast30Days: { card_completed: 2 },
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
    });

    const snapshot = buildAdminUserSummarySnapshot(
      baseContext({
        appUsage,
        detail: {
          ...baseContext().detail,
          profile: {
            ...baseContext().detail.profile,
            onboardingComplete: true,
            recommendedProgram: "Smoking Reset",
          },
        },
      })
    );

    expect(rowValue(snapshot, "overview", "accountType")).toBe("Free Detox user");
    expect(rowValue(snapshot, "programOwnership", "freeDetoxStatus")).toBe("In progress");
    expect(rowValue(snapshot, "programOwnership", "freeDetoxProgress")).toBe("Day 2 of 6");
    expect(rowValue(snapshot, "appUsageAndActivity", "engagement")).toBe(
      "Active (used app within 7 days)"
    );
  });

  it("formats all programs for a paid multi-program user", () => {
    const snapshot = buildAdminUserSummarySnapshot(
      baseContext({
        appUsage: buildAppUsageSnapshot({
          activity: [],
          dayStates: [],
          eventCountsLast30Days: {},
          freeDetoxProgress: null,
          freeTierActivatedAt: null,
          journalCount: 0,
          journalLastEntryDate: null,
          programs: [
            {
              completedAt: null,
              currentDay: 12,
              pausedAt: null,
              priorityRank: null,
              program: "Smoking Reset",
              programSlug: "smoking_reset",
              programState: "active",
              purchaseState: "paid",
              scheduledStartDate: null,
              startedAt: "2026-05-01T00:00:00.000Z",
            },
            {
              completedAt: null,
              currentDay: 3,
              pausedAt: "2026-06-01T00:00:00.000Z",
              priorityRank: 2,
              program: "Mindfulness",
              programSlug: "mindfulness",
              programState: "paused",
              purchaseState: "paid",
              scheduledStartDate: null,
              startedAt: "2026-04-01T00:00:00.000Z",
            },
          ],
          reflectionCount: 0,
          reflectionLast: null,
          routineCheckinCount: 0,
          routineCheckinLastAt: null,
        }),
        detail: {
          ...baseContext().detail,
          programs: [
            {
              currentDay: 12,
              pausedAt: null,
              priorityRank: null,
              program: "Smoking Reset",
              programSlug: "smoking_reset",
              programState: "active",
              purchaseState: "paid",
            },
            {
              currentDay: 3,
              pausedAt: "2026-06-01T00:00:00.000Z",
              priorityRank: 2,
              program: "Mindfulness",
              programSlug: "mindfulness",
              programState: "paused",
              purchaseState: "paid",
            },
          ],
          transactions: [
            {
              amountInr: 4999,
              createdAt: "2026-05-01T00:00:00.000Z",
              id: "txn-1",
              paymentStatus: "paid",
              program: "Smoking Reset",
            },
          ],
        },
        extras: {
          ...baseContext().extras,
          totalWebSpendInr: "₹4,999",
        },
      })
    );

    expect(rowValue(snapshot, "overview", "accountType")).toBe("Paid program owner");
    expect(rowValue(snapshot, "programOwnership", "allPrograms")).toContain("Smoking Reset");
    expect(rowValue(snapshot, "programOwnership", "allPrograms")).toContain("day 12");
    expect(rowValue(snapshot, "programOwnership", "allPrograms")).toContain("Mindfulness");
    expect(rowValue(snapshot, "programOwnership", "allPrograms")).toContain("paused");
    expect(rowValue(snapshot, "purchasesAndRevenue", "webSpend")).toBe("₹4,999");
  });
});
