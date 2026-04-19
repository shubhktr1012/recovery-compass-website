import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  const createOrder = vi.fn();
  const createTransaction = vi.fn();
  const getUser = vi.fn();
  const createSupabaseServerClient = vi.fn(async () => ({
    auth: {
      getUser,
    },
  }));

  const state = {
    activeProgramsResponse: { data: [] as Array<{ owned_program: string }>, error: null as unknown },
  };

  const from = vi.fn((table: string) => {
    if (table !== "program_access") {
      throw new Error(`Unexpected table: ${table}`);
    }

    const query: {
      select: ReturnType<typeof vi.fn>;
      eq: ReturnType<typeof vi.fn>;
    } = {
      select: vi.fn(),
      eq: vi.fn(),
    };

    query.select.mockReturnValue(query);
    query.eq.mockImplementation(() => {
      if (query.eq.mock.calls.length >= 2) {
        return Promise.resolve(state.activeProgramsResponse);
      }
      return query;
    });

    return query;
  });

  return {
    createOrder,
    createTransaction,
    getUser,
    createSupabaseServerClient,
    state,
    from,
  };
});

vi.mock("razorpay", () => ({
  default: class Razorpay {
    orders = {
      create: mocks.createOrder,
    };
  },
}));

vi.mock("@/lib/supabase-server", () => ({
  createSupabaseServerClient: mocks.createSupabaseServerClient,
}));

vi.mock("@/lib/commerce", () => ({
  createTransaction: mocks.createTransaction,
  supabaseAdmin: {
    from: mocks.from,
  },
}));

import { POST } from "@/app/api/checkout/create-order/route";

function buildRequest(body: unknown) {
  return {
    json: async () => body,
  } as unknown;
}

describe("POST /api/checkout/create-order", () => {
  beforeEach(() => {
    mocks.createOrder.mockReset();
    mocks.createTransaction.mockReset();
    mocks.getUser.mockReset();
    mocks.from.mockClear();
    mocks.state.activeProgramsResponse = { data: [], error: null };

    mocks.getUser.mockResolvedValue({
      data: { user: { id: "user-1" } },
      error: null,
    });

    mocks.createOrder.mockResolvedValue({
      id: "order_123",
      amount: 149900,
      currency: "INR",
    });
  });

  it("rejects unauthenticated checkout requests", async () => {
    mocks.getUser.mockResolvedValueOnce({
      data: { user: null },
      error: null,
    });

    const response = await POST(
      buildRequest({
        amount: 1499,
        userId: "user-1",
        items: [{ program_slug: "21-day-energy-reset", title: "Energy", price_inr: 1499, quantity: 1 }],
      }) as never
    );

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ message: "Unauthorized" });
  });

  it("rejects mismatched user IDs from client payload", async () => {
    const response = await POST(
      buildRequest({
        amount: 1499,
        userId: "different-user",
        items: [{ program_slug: "21-day-energy-reset", title: "Energy", price_inr: 1499, quantity: 1 }],
      }) as never
    );

    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({ message: "User mismatch" });
  });

  it("blocks second purchase if active program already exists", async () => {
    mocks.state.activeProgramsResponse = {
      data: [{ owned_program: "energy_vitality" }],
      error: null,
    };

    const response = await POST(
      buildRequest({
        amount: 1499,
        userId: "user-1",
        items: [{ program_slug: "14-day-sleep-reset", title: "Sleep", price_inr: 1499, quantity: 1 }],
      }) as never
    );

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      message: "You already have an active program. Please finish it before purchasing a new one.",
    });
    expect(mocks.createOrder).not.toHaveBeenCalled();
    expect(mocks.createTransaction).not.toHaveBeenCalled();
  });

  it("creates order + transaction with canonical authenticated user ID", async () => {
    const response = await POST(
      buildRequest({
        amount: 1499,
        items: [{ program_slug: "21-day-energy-reset", title: "Energy", price_inr: 1499, quantity: 1 }],
      }) as never
    );

    expect(response.status).toBe(200);
    expect(mocks.createOrder).toHaveBeenCalledWith(
      expect.objectContaining({
        amount: 149900,
        currency: "INR",
        notes: expect.objectContaining({
          user_id: "user-1",
          payment_source: "web_checkout",
        }),
      })
    );
    expect(mocks.createTransaction).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "user-1",
        providerOrderId: "order_123",
        amount: 149900,
      })
    );
  });
});
