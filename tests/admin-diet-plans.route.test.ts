import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const mocks = vi.hoisted(() => ({
  from: vi.fn(),
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

vi.mock("@/lib/supabase-admin", () => ({
  supabaseAdmin: {
    from: mocks.from,
  },
}));

import { POST as confirmPayment } from "@/app/api/admin/diet-plans/confirm-payment/route";
import { POST as triggerGeneration } from "@/app/api/admin/diet-plans/generate/route";
import { POST as createManualOrder } from "@/app/api/admin/diet-plans/manual-orders/route";

const ownerAdmin = {
  email: "owner@recoverycompass.co",
  role: "owner",
  source: "env_allowlist",
  userId: "admin-user",
} as const;
const dietOrderId = "550e8400-e29b-41d4-a716-446655440000";

function buildRequest(path: string, body: unknown) {
  return new NextRequest(`https://admin.recoverycompass.co${path}`, {
    body: JSON.stringify(body),
    headers: { "content-type": "application/json" },
    method: "POST",
  });
}

function mockInsertSingle(data: unknown) {
  const single = vi.fn().mockResolvedValue({ data, error: null });
  const select = vi.fn(() => ({ single }));
  const insert = vi.fn(() => ({ select }));
  mocks.from.mockReturnValueOnce({ insert });
  return { insert, select, single };
}

function mockSelectMaybeSingle(data: unknown) {
  const maybeSingle = vi.fn().mockResolvedValue({ data, error: null });
  const eq = vi.fn(() => ({ maybeSingle }));
  const select = vi.fn(() => ({ eq }));
  mocks.from.mockReturnValueOnce({ select });
  return { eq, maybeSingle, select };
}

function mockUpdateMaybeSingle(data: unknown) {
  const maybeSingle = vi.fn().mockResolvedValue({ data, error: null });
  const select = vi.fn(() => ({ maybeSingle }));
  const inFilter = vi.fn(() => ({ select }));
  const eq = vi.fn(() => ({ in: inFilter }));
  const update = vi.fn(() => ({ eq }));
  mocks.from.mockReturnValueOnce({ update });
  return { eq, inFilter, maybeSingle, select, update };
}

describe("admin diet plan manual order routes", () => {
  beforeEach(() => {
    mocks.from.mockReset();
    mocks.recordAdminAuditLog.mockReset();
    mocks.requireAdminApi.mockReset();
    delete process.env.DIET_PLAN_INTERNAL_SECRET;
  });

  it("denies viewer admins before creating a manual diet plan order", async () => {
    mocks.requireAdminApi.mockResolvedValueOnce({
      admin: { ...ownerAdmin, role: "viewer" },
    });

    const response = await createManualOrder(
      buildRequest("/api/admin/diet-plans/manual-orders", {
        email: "client@example.com",
        evidence: "whatsapp lead",
        paymentLinkUrl: "https://rzp.io/i/example",
        questionnaireData: { name: "Client" },
        reason: "client sent info",
      })
    );

    expect(response.status).toBe(403);
    expect(mocks.from).not.toHaveBeenCalled();
  });

  it("creates an admin manual diet plan order waiting for payment", async () => {
    mocks.requireAdminApi.mockResolvedValueOnce({ admin: ownerAdmin });
    const { insert } = mockInsertSingle({
      amount: 129900,
      currency: "INR",
      email: "client@example.com",
      id: "order-1",
      manual_payment_link_url: "https://rzp.io/i/example",
      name: "Client",
      source: "admin_manual",
      status: "awaiting_payment",
    });

    const response = await createManualOrder(
      buildRequest("/api/admin/diet-plans/manual-orders", {
        adminNotes: "Sent by WhatsApp",
        email: "CLIENT@EXAMPLE.COM",
        evidence: "whatsapp lead",
        paymentLinkUrl: "https://rzp.io/i/example",
        questionnaireData: { name: "Client", programFocus: ["Deep Sleep Reset Program"] },
        reason: "client sent info",
      })
    );

    const body = await response.clone().json();
    expect(response.status, JSON.stringify(body)).toBe(200);
    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "client@example.com",
        manual_created_by: "owner@recoverycompass.co",
        manual_payment_link_url: "https://rzp.io/i/example",
        source: "admin_manual",
        status: "awaiting_payment",
      })
    );
    expect(mocks.recordAdminAuditLog).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "diet_plan_manual_order_created",
        evidence: "whatsapp lead",
        reason: "client sent info",
        targetEmail: "client@example.com",
      })
    );
  });

  it("confirms manual payment and moves the order to pending", async () => {
    mocks.requireAdminApi.mockResolvedValueOnce({ admin: ownerAdmin });
    mockSelectMaybeSingle({
      email: "client@example.com",
      id: dietOrderId,
      manual_payment_confirmed_at: null,
      source: "admin_manual",
      status: "awaiting_payment",
    });
    const { update } = mockUpdateMaybeSingle({
      email: "client@example.com",
      id: "991d334c-1b55-460f-9944-d04043286345",
      manual_payment_confirmed_at: "2026-06-13T10:00:00.000Z",
      source: "admin_manual",
      status: "pending",
    });

    const response = await confirmPayment(
      buildRequest("/api/admin/diet-plans/confirm-payment", {
        evidence: "Razorpay payment link screenshot",
        orderId: dietOrderId,
        paymentReference: "pay_123",
        reason: "payment collected",
        triggerGeneration: false,
      })
    );

    expect(response.status).toBe(200);
    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({
        manual_payment_confirmed_by: "owner@recoverycompass.co",
        manual_payment_reference: "pay_123",
        status: "pending",
      })
    );
    expect(mocks.recordAdminAuditLog).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "diet_plan_manual_payment_confirmed",
        evidence: "Razorpay payment link screenshot",
        reason: "payment collected",
        targetEmail: "client@example.com",
      })
    );
  });

  it("blocks generation for unpaid manual diet plan orders", async () => {
    process.env.DIET_PLAN_INTERNAL_SECRET = "test-secret";
    mocks.requireAdminApi.mockResolvedValueOnce({ admin: ownerAdmin });
    mockSelectMaybeSingle({
      email: "client@example.com",
      id: dietOrderId,
      manual_payment_confirmed_at: null,
      source: "admin_manual",
      status: "pending",
    });

    const response = await triggerGeneration(
      buildRequest("/api/admin/diet-plans/generate", {
        evidence: "support retry",
        orderId: dietOrderId,
        reason: "retry failed delivery",
      })
    );

    const body = await response.clone().json();
    expect(response.status, JSON.stringify(body)).toBe(409);
    expect(await response.json()).toEqual({
      message: "Manual diet plan payment must be confirmed before generation.",
    });
    expect(mocks.recordAdminAuditLog).not.toHaveBeenCalled();
  });
});
