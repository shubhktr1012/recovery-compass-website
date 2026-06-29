import { describe, expect, it } from "vitest";

import {
  buildAdminUserSummaryPrompt,
  formatAdminUserSummaryError,
  isRetryableGeminiApiStatus,
} from "@/lib/admin/user-summary-generation";
import { buildAdminUserSummarySnapshot } from "@/lib/admin/user-summary-snapshot";
import { buildAppUsageSnapshot } from "@/lib/admin/user-app-usage";
import type { AdminUserSummaryContext } from "@/lib/admin/user-summary-context";

describe("admin user summary generation prompt", () => {
  it("includes the snapshot in the insights prompt", () => {
    const context = {
      appUsage: buildAppUsageSnapshot({
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
      }),
      contextVersion: 3,
      dataGaps: ["No questionnaire run"],
      detail: {
        dayStates: [],
        dietOrders: [],
        emails: [],
        preference: null,
        profile: {
          createdAt: "2026-01-15T10:00:00.000Z",
          email: "pankaj@example.com",
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
        notificationsEnabled: false,
        onboardingCompletedAt: null,
        phoneNumber: null,
        phoneVerifiedAt: null,
        primaryConcern: "Smoking",
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
    } as AdminUserSummaryContext;

    const snapshot = buildAdminUserSummarySnapshot(context);
    const prompt = buildAdminUserSummaryPrompt({
      dataGaps: context.dataGaps,
      snapshot,
    });

    expect(prompt).toContain("USER SNAPSHOT");
    expect(prompt).toContain("Account type");
    expect(prompt).toContain("No questionnaire run");
    expect(prompt).toContain("do not repeat its values");
  });
});

describe("admin user summary Gemini resilience", () => {
  it("treats 503 as retryable", () => {
    expect(isRetryableGeminiApiStatus(503)).toBe(true);
    expect(isRetryableGeminiApiStatus(429)).toBe(true);
    expect(isRetryableGeminiApiStatus(400)).toBe(false);
  });

  it("formats 503 errors for admins without raw JSON", () => {
    const message = formatAdminUserSummaryError(
      new Error(
        'Gemini API error 503 for model gemini-3.5-flash: { "error": { "status": "UNAVAILABLE" } }'
      )
    );

    expect(message).toContain("temporarily busy");
    expect(message).not.toContain("UNAVAILABLE");
  });

  it("formats MAX_TOKENS errors for admins", () => {
    const message = formatAdminUserSummaryError(
      new Error("Gemini stopped before completing summary (MAX_TOKENS)")
    );

    expect(message).toContain("cut off");
  });
});
