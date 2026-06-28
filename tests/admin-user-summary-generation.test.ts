import { describe, expect, it } from "vitest";

import {
  buildAdminUserSummaryPrompt,
  formatAdminUserSummaryError,
  isRetryableGeminiApiStatus,
} from "@/lib/admin/user-summary-generation";

describe("admin user summary generation prompt", () => {
  it("includes the serialized user context in the prompt", () => {
    const prompt = buildAdminUserSummaryPrompt({
      account: { displayName: "Pankaj Yadav" },
      appUsage: { engagementLevel: "active" },
    });

    expect(prompt).toContain("Pankaj Yadav");
    expect(prompt).toContain("appUsage");
    expect(prompt).toContain("USER CONTEXT");
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
