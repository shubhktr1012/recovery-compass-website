import { describe, expect, it, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const mocks = vi.hoisted(() => ({
  profileEmailList: vi.fn(),
  profileSingle: vi.fn(),
  requireAdminApi: vi.fn(),
  rpc: vi.fn(),
}));

vi.mock("@/lib/admin/api", () => ({
  adminApiError: (error: unknown) =>
    Response.json(
      { message: error instanceof Error ? error.message : "Admin request failed" },
      { status: 500 }
    ),
  requireAdminApi: mocks.requireAdminApi,
}));

vi.mock("@/lib/supabase-admin", () => ({
  supabaseAdmin: {
    from: (table: string) => {
      if (table !== "profiles") {
        throw new Error(`Unexpected table ${table}`);
      }

      return {
        select: () => ({
          eq: () => ({
            maybeSingle: mocks.profileSingle,
          }),
          ilike: () => ({
            limit: mocks.profileEmailList,
          }),
        }),
      };
    },
    rpc: mocks.rpc,
  },
}));

import { POST as grantProgram } from "@/app/api/admin/program-grants/route";
import { POST as legacyGrantProgram } from "@/app/api/internal/program-grants/route";

function buildRequest(body: unknown) {
  return new NextRequest("https://admin.recoverycompass.co/api/admin/program-grants", {
    body: JSON.stringify(body),
    headers: { "content-type": "application/json" },
    method: "POST",
  });
}

const ownerAdmin = {
  email: "owner@recoverycompass.co",
  role: "owner",
  source: "env_allowlist",
  userId: "admin-user",
} as const;

describe("POST /api/admin/program-grants", () => {
  beforeEach(() => {
    mocks.profileEmailList.mockReset();
    mocks.profileSingle.mockReset();
    mocks.requireAdminApi.mockReset();
    mocks.rpc.mockReset();
  });

  it("denies viewer admins before resolving the target user", async () => {
    mocks.requireAdminApi.mockResolvedValueOnce({
      admin: { ...ownerAdmin, role: "viewer" },
    });

    const response = await grantProgram(
      buildRequest({
        evidence: "support-ticket-1",
        programSlug: "energy_vitality",
        reason: "support correction",
        userId: "user-1",
      })
    );

    expect(response.status).toBe(403);
    expect(mocks.profileSingle).not.toHaveBeenCalled();
    expect(mocks.rpc).not.toHaveBeenCalled();
  });

  it("rejects invalid grant input before calling the database RPC", async () => {
    mocks.requireAdminApi.mockResolvedValueOnce({ admin: ownerAdmin });

    const response = await grantProgram(
      buildRequest({
        evidence: "ok",
        programSlug: "not_a_program",
        reason: "ok",
        userId: "user-1",
      })
    );

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ message: "Invalid program slug." });
    expect(mocks.rpc).not.toHaveBeenCalled();
  });

  it("rejects retired legacy programs from manual grants", async () => {
    mocks.requireAdminApi.mockResolvedValueOnce({ admin: ownerAdmin });

    const response = await grantProgram(
      buildRequest({
        evidence: "legacy correction",
        programSlug: "six_day_reset",
        reason: "support correction",
        userId: "user-1",
      })
    );

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ message: "Invalid program slug." });
    expect(mocks.profileSingle).not.toHaveBeenCalled();
    expect(mocks.rpc).not.toHaveBeenCalled();
  });

  it("uses the audited grant RPC and returns the preserved access state", async () => {
    mocks.requireAdminApi.mockResolvedValueOnce({ admin: ownerAdmin });
    mocks.profileSingle.mockResolvedValueOnce({
      data: { email: "user@example.com", id: "user-1" },
      error: null,
    });
    mocks.rpc.mockResolvedValueOnce({
      data: [
        {
          already_owned: true,
          completion_state: "in_progress",
          current_day: 4,
          owned_program: "energy_vitality",
          priority_rank: 2,
          program_state: "purchased",
          purchase_state: "owned_active",
          target_email: "user@example.com",
          updated_at: "2026-05-25T10:00:00.000Z",
          user_id: "user-1",
        },
      ],
      error: null,
    });

    const response = await grantProgram(
      buildRequest({
        evidence: "razorpay_order_123",
        programSlug: "energy_vitality",
        reason: "support correction",
        userId: "user-1",
      })
    );

    expect(response.status).toBe(200);
    expect(mocks.rpc).toHaveBeenCalledWith("admin_grant_program_access", {
      p_admin_email: "owner@recoverycompass.co",
      p_admin_role: "owner",
      p_admin_user_id: "admin-user",
      p_evidence: "razorpay_order_123",
      p_metadata: { source: "admin_dashboard" },
      p_program_id: "energy_vitality",
      p_reason: "support correction",
      p_target_user_id: "user-1",
    });
    expect(await response.json()).toMatchObject({
      grant: {
        alreadyOwned: true,
        currentDay: 4,
        priorityRank: 2,
        programSlug: "energy_vitality",
        programState: "purchased",
      },
      success: true,
    });
  });
});

describe("POST /api/internal/program-grants", () => {
  it("keeps the old shared-secret grant endpoint disabled", async () => {
    const response = await legacyGrantProgram();

    expect(response.status).toBe(410);
    expect(await response.json()).toEqual({
      message:
        "This unaudited grant endpoint has been disabled. Use the admin dashboard grant workflow.",
    });
  });
});
