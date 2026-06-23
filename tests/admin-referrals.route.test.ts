import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireAdminApi: vi.fn(),
  recordAdminAuditLog: vi.fn(),
  insertSingle: vi.fn(),
  payoutSelect: vi.fn(),
}));

vi.mock("@/lib/admin/api", () => ({
  requireAdminApi: mocks.requireAdminApi,
  adminApiError: (error: unknown) =>
    Response.json({ message: error instanceof Error ? error.message : "Admin request failed" }, { status: 500 }),
}));

vi.mock("@/lib/admin/audit", () => ({ recordAdminAuditLog: mocks.recordAdminAuditLog }));

vi.mock("@/lib/supabase-admin", () => ({
  supabaseAdmin: {
    from: () => ({
      insert: () => ({ select: () => ({ single: mocks.insertSingle }) }),
      update: () => {
        const chain = {
          eq: () => chain,
          select: mocks.payoutSelect,
        };
        return chain;
      },
    }),
  },
}));

import { POST as createPartner } from "@/app/api/admin/referrals/route";
import { PATCH as markPayoutsPaid } from "@/app/api/admin/referrals/payouts/route";

function request(body: unknown) {
  return { json: async () => body } as never;
}

describe("admin referral routes", () => {
  beforeEach(() => {
    mocks.requireAdminApi.mockReset();
    mocks.recordAdminAuditLog.mockReset();
    mocks.insertSingle.mockReset();
    mocks.payoutSelect.mockReset();
    mocks.requireAdminApi.mockResolvedValue({
      admin: { userId: "admin-1", email: "ops@example.com", role: "ops", source: "admin_users" },
    });
  });

  it("creates one normalized partner code and audits it", async () => {
    mocks.insertSingle.mockResolvedValue({
      data: { id: "partner-1", name: "Anjan", referral_code: "ANJAN10" },
      error: null,
    });

    const response = await createPartner(request({
      name: "Anjan",
      code: "anjan-10",
      partnerType: "coach",
      email: "anjan@example.com",
    }));

    expect(response.status).toBe(200);
    expect(mocks.recordAdminAuditLog).toHaveBeenCalledWith(
      expect.objectContaining({ action: "referral_partner_created" })
    );
  });

  it("marks a partner payout batch paid and records the total", async () => {
    mocks.payoutSelect.mockResolvedValue({
      data: [
        { id: "redemption-1", commission_amount_paise: 10000 },
        { id: "redemption-2", commission_amount_paise: 20000 },
      ],
      error: null,
    });

    const response = await markPayoutsPaid(request({
      partnerId: "partner-1",
      payoutNote: "UTR123",
    }));

    expect(response.status).toBe(200);
    expect(mocks.recordAdminAuditLog).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "referral_commissions_paid",
        metadata: expect.objectContaining({ totalPaidPaise: 30000 }),
      })
    );
  });

  it("blocks payout writes for viewer admins", async () => {
    mocks.requireAdminApi.mockResolvedValueOnce({
      admin: { userId: "viewer-1", email: "viewer@example.com", role: "viewer", source: "admin_users" },
    });

    const response = await markPayoutsPaid(request({ partnerId: "partner-1", payoutNote: "UTR123" }));
    expect(response.status).toBe(403);
    expect(mocks.payoutSelect).not.toHaveBeenCalled();
  });
});
