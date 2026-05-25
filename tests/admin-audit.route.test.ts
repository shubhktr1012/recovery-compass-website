import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const mocks = vi.hoisted(() => ({
  recordAdminAuditLog: vi.fn(),
  requireAdminApi: vi.fn(),
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

import { POST } from "@/app/api/admin/audit/route";

function buildRequest(body: unknown) {
  return new NextRequest("https://admin.recoverycompass.co/api/admin/audit", {
    body: JSON.stringify(body),
    headers: { "content-type": "application/json" },
    method: "POST",
  });
}

const opsAdmin = {
  email: "ops@recoverycompass.co",
  role: "ops",
  source: "env_allowlist",
  userId: "admin-user",
} as const;

describe("POST /api/admin/audit", () => {
  beforeEach(() => {
    mocks.recordAdminAuditLog.mockReset();
    mocks.requireAdminApi.mockReset();
  });

  it("returns the admin auth failure response", async () => {
    mocks.requireAdminApi.mockResolvedValueOnce({
      response: Response.json({ message: "Unauthorized" }, { status: 401 }),
    });

    const response = await POST(buildRequest({ action: "support_packet_copied" }));

    expect(response.status).toBe(401);
    expect(mocks.recordAdminAuditLog).not.toHaveBeenCalled();
  });

  it("rejects unsupported client-provided audit actions", async () => {
    mocks.requireAdminApi.mockResolvedValueOnce({ admin: opsAdmin });

    const response = await POST(buildRequest({ action: "program_granted" }));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ message: "Unsupported audit action." });
    expect(mocks.recordAdminAuditLog).not.toHaveBeenCalled();
  });

  it("records supported support-copy audit actions", async () => {
    mocks.requireAdminApi.mockResolvedValueOnce({ admin: opsAdmin });

    const response = await POST(
      buildRequest({
        action: "support_packet_copied",
        metadata: { label: "Copy support packet" },
        targetEmail: "user@example.com",
        targetUserId: "user-1",
      })
    );

    expect(response.status).toBe(200);
    expect(mocks.recordAdminAuditLog).toHaveBeenCalledWith({
      action: "support_packet_copied",
      admin: opsAdmin,
      metadata: {
        label: "Copy support packet",
        source: "admin_dashboard",
      },
      targetEmail: "user@example.com",
      targetProgram: null,
      targetUserId: "user-1",
    });
  });
});
