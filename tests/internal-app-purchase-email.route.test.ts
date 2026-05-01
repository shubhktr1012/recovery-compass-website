import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  const state = {
    existingDelivery: null as null | {
      id: string;
      status: "pending" | "sent" | "failed";
      updated_at?: string | null;
      created_at?: string | null;
    },
    existingDeliveryError: null as null | { message: string },
    createdDelivery: { id: "delivery_1" },
    createDeliveryError: null as null | { message: string; code?: string },
    profile: { email: "member@example.com", display_name: "Member" } as null | {
      email: string | null;
      display_name: string | null;
    },
    profileError: null as null | { message: string },
    updateErrors: [] as Array<null | { message: string }>,
    updateCalls: [] as Array<{ table: string; values: Record<string, unknown>; eq: Array<[string, string]> }>,
    insertCalls: [] as Array<{ table: string; values: Record<string, unknown> }>,
    sendAppPurchaseWelcomeEmail: vi.fn(),
  };

  const supabaseAdmin = {
    from(table: string) {
      return {
        select() {
          return this;
        },
        eq(column: string, value: string) {
          if (table === "outbound_email_deliveries") {
            const self = this as typeof this & { filters?: Array<[string, string]> };
            self.filters = [...(self.filters ?? []), [column, value]];
          }

          return this;
        },
        maybeSingle: vi.fn(async function () {
          if (table === "outbound_email_deliveries") {
            return { data: state.existingDelivery, error: state.existingDeliveryError };
          }

          if (table === "profiles") {
            return { data: state.profile, error: state.profileError };
          }

          return { data: null, error: null };
        }),
        insert(values: Record<string, unknown>) {
          state.insertCalls.push({ table, values });

          return {
            select() {
              return this;
            },
            single: async () => ({
              data: state.createDeliveryError ? null : state.createdDelivery,
              error: state.createDeliveryError,
            }),
          };
        },
        update(values: Record<string, unknown>) {
          const call = { table, values, eq: [] as Array<[string, string]> };
          state.updateCalls.push(call);

          return {
            eq(column: string, value: string) {
              call.eq.push([column, value]);
              return Promise.resolve({ error: state.updateErrors.shift() ?? null });
            },
          };
        },
      };
    },
  };

  return {
    state,
    supabaseAdmin,
  };
});

vi.mock("@/lib/mail", () => ({
  sendAppPurchaseWelcomeEmail: mocks.state.sendAppPurchaseWelcomeEmail,
}));

vi.mock("@/lib/supabase-admin", () => ({
  supabaseAdmin: mocks.supabaseAdmin,
}));

import { POST } from "@/app/api/internal/app-purchase-email/route";

describe("POST /api/internal/app-purchase-email", () => {
  beforeEach(() => {
    process.env.APP_PURCHASE_EMAIL_SECRET = "secret_123";
    mocks.state.existingDelivery = null;
    mocks.state.existingDeliveryError = null;
    mocks.state.createdDelivery = { id: "delivery_1" };
    mocks.state.createDeliveryError = null;
    mocks.state.profile = { email: "member@example.com", display_name: "Member" };
    mocks.state.profileError = null;
    mocks.state.updateErrors = [];
    mocks.state.updateCalls = [];
    mocks.state.insertCalls = [];
    mocks.state.sendAppPurchaseWelcomeEmail.mockReset();
    mocks.state.sendAppPurchaseWelcomeEmail.mockResolvedValue({ success: true, id: "email_1" });
  });

  it("rejects unauthorized requests", async () => {
    const response = await POST(
      new Request("http://localhost/api/internal/app-purchase-email", {
        method: "POST",
        body: JSON.stringify({ userId: "user_1", programSlug: "six_day_reset" }),
      })
    );

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ success: false, error: "Unauthorized" });
  });

  it("dedupes previously sent emails", async () => {
    mocks.state.existingDelivery = { id: "delivery_1", status: "sent" };

    const response = await POST(
      new Request("http://localhost/api/internal/app-purchase-email", {
        method: "POST",
        headers: {
          authorization: "Bearer secret_123",
          "content-type": "application/json",
        },
        body: JSON.stringify({ userId: "user_1", programSlug: "six_day_reset", revenueCatEventId: "evt_1" }),
      })
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ success: true, deduped: true });
    expect(mocks.state.sendAppPurchaseWelcomeEmail).not.toHaveBeenCalled();
  });

  it("dedupes a recent pending delivery", async () => {
    mocks.state.existingDelivery = {
      id: "delivery_1",
      status: "pending",
      updated_at: new Date().toISOString(),
    };

    const response = await POST(
      new Request("http://localhost/api/internal/app-purchase-email", {
        method: "POST",
        headers: {
          authorization: "Bearer secret_123",
          "content-type": "application/json",
        },
        body: JSON.stringify({ userId: "user_1", programSlug: "six_day_reset", revenueCatEventId: "evt_1" }),
      })
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ success: true, deduped: true });
    expect(mocks.state.sendAppPurchaseWelcomeEmail).not.toHaveBeenCalled();
  });

  it("retries a stale pending delivery", async () => {
    mocks.state.existingDelivery = {
      id: "delivery_1",
      status: "pending",
      updated_at: new Date(Date.now() - 11 * 60 * 1000).toISOString(),
    };

    const response = await POST(
      new Request("http://localhost/api/internal/app-purchase-email", {
        method: "POST",
        headers: {
          authorization: "Bearer secret_123",
          "content-type": "application/json",
        },
        body: JSON.stringify({ userId: "user_1", programSlug: "six_day_reset", revenueCatEventId: "evt_1" }),
      })
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ success: true, emailId: "email_1" });
    expect(mocks.state.sendAppPurchaseWelcomeEmail).toHaveBeenCalledTimes(1);
    expect(mocks.state.insertCalls).toHaveLength(0);
    expect(mocks.state.updateCalls[0]?.values).toMatchObject({
      status: "pending",
      last_error: null,
    });
    expect(mocks.state.updateCalls.at(-1)?.values).toMatchObject({
      status: "sent",
      last_error: null,
      recipient_email: "member@example.com",
    });
  });

  it("sends the email and marks the delivery as sent", async () => {
    const response = await POST(
      new Request("http://localhost/api/internal/app-purchase-email", {
        method: "POST",
        headers: {
          authorization: "Bearer secret_123",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          userId: "user_1",
          programSlug: "six_day_reset",
          revenueCatEventId: "evt_1",
          providerTransactionId: "txn_1",
          revenueCatProductId: "six_day_control",
          store: "app_store",
        }),
      })
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ success: true, emailId: "email_1" });
    expect(mocks.state.insertCalls).toHaveLength(1);
    expect(mocks.state.sendAppPurchaseWelcomeEmail).toHaveBeenCalledWith({
      to: "member@example.com",
      customerName: "Member",
      programSlug: "six_day_reset",
      store: "app_store",
    });
    expect(mocks.state.updateCalls.at(-1)?.values).toMatchObject({
      status: "sent",
      last_error: null,
      recipient_email: "member@example.com",
    });
  });

  it("marks the delivery as failed when mail sending fails", async () => {
    mocks.state.sendAppPurchaseWelcomeEmail.mockResolvedValue({
      success: false,
      error: "blocked by provider",
    });

    const response = await POST(
      new Request("http://localhost/api/internal/app-purchase-email", {
        method: "POST",
        headers: {
          authorization: "Bearer secret_123",
          "content-type": "application/json",
        },
        body: JSON.stringify({ userId: "user_1", programSlug: "six_day_reset", revenueCatEventId: "evt_1" }),
      })
    );

    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({ success: false, error: "blocked by provider" });
    expect(mocks.state.updateCalls.at(-1)?.values).toMatchObject({
      status: "failed",
      last_error: "blocked by provider",
      recipient_email: "member@example.com",
    });
  });

  it("returns 500 when marking the delivery as sent fails", async () => {
    mocks.state.updateErrors = [{ message: "write blocked" }];

    const response = await POST(
      new Request("http://localhost/api/internal/app-purchase-email", {
        method: "POST",
        headers: {
          authorization: "Bearer secret_123",
          "content-type": "application/json",
        },
        body: JSON.stringify({ userId: "user_1", programSlug: "six_day_reset", revenueCatEventId: "evt_1" }),
      })
    );

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      success: false,
      error: "Failed to mark outbound_email_deliveries row delivery_1 as sent: write blocked",
    });
    expect(mocks.state.sendAppPurchaseWelcomeEmail).toHaveBeenCalledTimes(1);
  });
});
