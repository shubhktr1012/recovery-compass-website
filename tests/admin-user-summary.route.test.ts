import { describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const mocks = vi.hoisted(() => ({
  buildAdminUserSummaryContext: vi.fn(),
  buildUserSummaryPromptContext: vi.fn(),
  generateAdminUserSummary: vi.fn(),
  readCachedSummary: vi.fn(),
  recordAdminAuditLog: vi.fn(),
  requireAdminApi: vi.fn(),
  supabaseUpsert: vi.fn(),
}));

vi.mock("@/lib/admin/api", () => ({
  adminApiError: (error: unknown) =>
    Response.json(
      { message: error instanceof Error ? error.message : "Admin request failed" },
      { status: 500 }
    ),
  requireAdminApi: mocks.requireAdminApi,
}));

vi.mock("@/lib/admin/audit", () => ({
  recordAdminAuditLog: mocks.recordAdminAuditLog,
}));

vi.mock("@/lib/admin/user-summary-context", () => ({
  ADMIN_USER_SUMMARY_CONTEXT_VERSION: 1,
  buildAdminUserSummaryContext: mocks.buildAdminUserSummaryContext,
  buildUserSummaryPromptContext: mocks.buildUserSummaryPromptContext,
}));

vi.mock("@/lib/admin/user-summary-generation", () => ({
  generateAdminUserSummary: mocks.generateAdminUserSummary,
  resolveAdminUserSummaryModel: () => "gemini-3.5-flash",
}));

vi.mock("@/lib/supabase-admin", () => ({
  supabaseAdmin: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          maybeSingle: mocks.readCachedSummary,
        })),
      })),
      upsert: mocks.supabaseUpsert,
    })),
  },
}));

import { GET, POST } from "@/app/api/admin/users/[userId]/summary/route";

const admin = {
  email: "ops@example.com",
  role: "ops" as const,
  source: "env_allowlist" as const,
  userId: "admin-1",
};

const sampleSummary = {
  headline: "Test user",
  overview: { summary: "Overview", bullets: [] },
  programOwnership: { summary: "Programs", bullets: [] },
  appUsageAndActivity: { summary: "Usage", bullets: [] },
  purchasesAndRevenue: { summary: "Purchases", bullets: [] },
  dietAndAddOns: { summary: "Diet", bullets: [] },
  profileAndIntent: { summary: "Intent", bullets: [] },
  communication: { summary: "Comms", bullets: [] },
  salesAndOutreach: { summary: "Sales", bullets: [] },
  risksAndOpenIssues: { summary: "Risks", bullets: [] },
  nextBestAction: "Follow up",
};

describe("admin user summary route", () => {
  it("returns cached summary on GET", async () => {
    mocks.requireAdminApi.mockResolvedValueOnce({ admin });
    mocks.readCachedSummary.mockResolvedValueOnce({
      data: {
        context_version: 1,
        generated_at: "2026-06-27T10:00:00.000Z",
        generated_by_admin_email: "ops@example.com",
        model: "gemini-3.5-flash",
        summary: sampleSummary,
        updated_at: "2026-06-27T10:00:00.000Z",
        user_id: "user-1",
      },
      error: null,
    });

    const response = await GET(
      new NextRequest("https://admin.recoverycompass.co/api/admin/users/user-1/summary"),
      { params: Promise.resolve({ userId: "user-1" }) }
    );

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.summary.summary.headline).toBe("Test user");
    expect(mocks.recordAdminAuditLog).toHaveBeenCalledWith(
      expect.objectContaining({ action: "user_ai_summary_viewed" })
    );
  });

  it("generates and returns a fresh summary on POST", async () => {
    mocks.requireAdminApi.mockResolvedValueOnce({ admin });
    mocks.readCachedSummary.mockResolvedValueOnce({ data: null, error: null });
    mocks.buildAdminUserSummaryContext.mockResolvedValueOnce({ detail: { profile: { id: "user-1" } } });
    mocks.buildUserSummaryPromptContext.mockReturnValueOnce({ account: { id: "user-1" } });
    mocks.generateAdminUserSummary.mockResolvedValueOnce({
      model: "gemini-3.5-flash",
      summary: sampleSummary,
    });
    mocks.supabaseUpsert.mockResolvedValueOnce({ error: null });

    const response = await POST(
      new NextRequest("https://admin.recoverycompass.co/api/admin/users/user-1/summary", {
        body: JSON.stringify({ force: true }),
        method: "POST",
      }),
      { params: Promise.resolve({ userId: "user-1" }) }
    );

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.summary.summary.headline).toBe("Test user");
    expect(mocks.generateAdminUserSummary).toHaveBeenCalled();
    expect(mocks.recordAdminAuditLog).toHaveBeenCalledWith(
      expect.objectContaining({ action: "user_ai_summary_generated" })
    );
  });
});
