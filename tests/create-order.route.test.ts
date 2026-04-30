import { beforeEach, describe, expect, it, vi } from "vitest";
import { MAX_CART_ITEMS } from "@/lib/program-commerce-policy";

const mocks = vi.hoisted(() => {
  const createOrder = vi.fn();
  const createTransaction = vi.fn();
  const getUser = vi.fn();
  const createSupabaseServerClient = vi.fn(async () => ({
    auth: {
      getUser,
    },
  }));
  return {
    createOrder,
    createTransaction,
    getUser,
    createSupabaseServerClient,
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
        items: [{ program_slug: "14-day-energy-restore", title: "Energy", price_inr: 1499, quantity: 1 }],
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
        items: [{ program_slug: "14-day-energy-restore", title: "Energy", price_inr: 1499, quantity: 1 }],
      }) as never
    );

    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({ message: "User mismatch" });
  });

  it("creates order + transaction with canonical authenticated user ID", async () => {
    const response = await POST(
      buildRequest({
        amount: 1499,
        items: [{ program_slug: "14-day-energy-restore", title: "Energy", price_inr: 1499, quantity: 1 }],
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

  it("accepts a multi-program checkout payload within the configured limit", async () => {
    const response = await POST(
      buildRequest({
        amount: 2998,
        items: [
          { program_slug: "14-day-energy-restore", title: "Energy", price_inr: 1499, quantity: 1 },
          { program_slug: "21-day-deep-sleep-reset", title: "Sleep", price_inr: 1499, quantity: 1 },
        ],
      }) as never
    );

    expect(response.status).toBe(200);
    expect(mocks.createTransaction).toHaveBeenCalledWith(
      expect.objectContaining({
        amount: 299800,
        items: expect.arrayContaining([
          expect.objectContaining({ program_slug: "14-day-energy-restore" }),
          expect.objectContaining({ program_slug: "21-day-deep-sleep-reset" }),
        ]),
      })
    );
  });

  it("rejects checkout payloads that exceed the configured cart limit", async () => {
    const response = await POST(
      buildRequest({
        amount: 1499 * (MAX_CART_ITEMS + 1),
        items: Array.from({ length: MAX_CART_ITEMS + 1 }, (_, index) => ({
          program_slug: `program-${index + 1}`,
          title: `Program ${index + 1}`,
          price_inr: 1499,
          quantity: 1,
        })),
      }) as never
    );

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      message: `You can purchase up to ${MAX_CART_ITEMS} programs at once.`,
    });
  });
});
