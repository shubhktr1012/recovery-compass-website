import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  const from = vi.fn();
  const rpc = vi.fn();
  const sendWelcomeEmail = vi.fn();
  const sendOpsAlertEmail = vi.fn();
  const transactionUpdates: unknown[] = [];
  const programAccessInserts: unknown[] = [];
  const transactionItems: unknown[] = [];

  return {
    from,
    rpc,
    sendOpsAlertEmail,
    sendWelcomeEmail,
    transactionUpdates,
    programAccessInserts,
    transactionItems,
  };
});

vi.mock("@/lib/supabase-admin", () => ({
  supabaseAdmin: {
    from: mocks.from,
    rpc: mocks.rpc,
  },
}));

vi.mock("@/lib/mail", () => ({
  sendOpsAlertEmail: mocks.sendOpsAlertEmail,
  sendWelcomeEmail: mocks.sendWelcomeEmail,
}));

import { markTransactionPaid } from "@/lib/commerce";

function buildTransactionsTable() {
  let selectColumns = "";

  return {
    select(columns: string) {
      selectColumns = columns;
      return this;
    },
    eq() {
      return this;
    },
    async single() {
      if (selectColumns === "*") {
        return {
          data: {
            id: "txn-1",
            user_id: "user-1",
            provider_order_id: "order_123",
            provider_payment_id: "pay_123",
            provider_signature: "sig_123",
            amount: 149900,
            currency: "INR",
            items: mocks.transactionItems,
            payment_status: "paid",
            fulfillment_status: "pending",
            metadata: {},
            created_at: "2026-05-21T00:00:00.000Z",
          },
          error: null,
        };
      }

      return {
        data: {
          id: "txn-1",
          payment_status: "created",
          fulfillment_status: "pending",
        },
        error: null,
      };
    },
    update(payload: unknown) {
      mocks.transactionUpdates.push(payload);
      return {
        eq: async () => ({ error: null }),
      };
    },
  };
}

function buildProgramAccessTable() {
  return {
    select() {
      return this;
    },
    eq() {
      return this;
    },
    async in() {
      return { data: [], error: null };
    },
    async insert(payload: Record<string, unknown>) {
      mocks.programAccessInserts.push(payload);

      if ("priority_rank" in payload) {
        return {
          error: {
            code: "PGRST204",
            message: "Could not find the 'priority_rank' column of 'program_access' in the schema cache",
          },
        };
      }

      return { error: null };
    },
  };
}

function buildProfilesTable() {
  return {
    select() {
      return this;
    },
    eq() {
      return this;
    },
    async maybeSingle() {
      return {
        data: {
          display_name: "Test User",
          email: "test@example.com",
        },
        error: null,
      };
    },
  };
}

describe("commerce legacy DB contract", () => {
  beforeEach(() => {
    mocks.from.mockReset();
    mocks.rpc.mockReset();
    mocks.sendOpsAlertEmail.mockReset();
    mocks.sendWelcomeEmail.mockReset();
    mocks.transactionUpdates.length = 0;
    mocks.programAccessInserts.length = 0;
    mocks.transactionItems.length = 0;
    mocks.transactionItems.push({
      program_slug: "energy_vitality",
      title: "Energy Restore",
      price_inr: 1499,
      quantity: 1,
      queue_rank: 1,
    });

    mocks.from.mockImplementation((table: string) => {
      if (table === "transactions") return buildTransactionsTable();
      if (table === "program_access") return buildProgramAccessTable();
      if (table === "profiles") return buildProfilesTable();
      throw new Error(`Unexpected table: ${table}`);
    });

    mocks.rpc.mockResolvedValue({
      error: {
        code: "PGRST202",
        message: "Could not find the function public.normalize_owned_program_priority_queue",
      },
    });

    mocks.sendWelcomeEmail.mockResolvedValue({ success: true });
  });

  it("fulfills program purchases when queue columns and RPC are not deployed yet", async () => {
    const result = await markTransactionPaid({
      providerOrderId: "order_123",
      providerPaymentId: "pay_123",
      providerSignature: "sig_123",
    });

    expect(result).toEqual({ alreadyProcessed: false, transactionId: "txn-1" });
    expect(mocks.programAccessInserts).toEqual([
      expect.objectContaining({
        owned_program: "energy_vitality",
        priority_rank: 1,
      }),
      expect.not.objectContaining({
        priority_rank: expect.anything(),
      }),
    ]);
    expect(mocks.rpc).toHaveBeenCalledWith("normalize_owned_program_priority_queue", {
      p_user_id: "user-1",
    });
    expect(mocks.transactionUpdates).toContainEqual(
      expect.objectContaining({
        fulfillment_status: "fulfilled",
      })
    );
  });

  it("does not grant app-only Free Detox if a malformed stored transaction contains it", async () => {
    mocks.transactionItems.length = 0;
    mocks.transactionItems.push({
      program_slug: "free_detox_reset",
      title: "Free Detox Program",
      price_inr: 0,
      quantity: 1,
      queue_rank: 1,
    });

    const result = await markTransactionPaid({
      providerOrderId: "order_123",
      providerPaymentId: "pay_123",
      providerSignature: "sig_123",
    });

    expect(result).toEqual({ alreadyProcessed: false, transactionId: "txn-1" });
    expect(mocks.programAccessInserts).toEqual([]);
    expect(mocks.transactionUpdates).toContainEqual(
      expect.objectContaining({
        fulfillment_status: "fulfillment_failed",
      })
    );
    expect(mocks.sendOpsAlertEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: "[Recovery Compass] Fulfillment failed (mark_paid)",
        message: expect.stringContaining("No grantable checkout items found for transaction txn-1"),
      })
    );
  });
});
