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

vi.mock("@/lib/commerce", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/commerce")>();
  return {
    ...actual,
    createTransaction: mocks.createTransaction,
  };
});

import { POST } from "@/app/api/checkout/create-order/route";

function buildRequest(body: unknown) {
  return {
    json: async () => body,
  } as unknown;
}

describe("POST /api/checkout/create-order", () => {
  beforeEach(() => {
    process.env.RAZORPAY_KEY_ID = "rzp_test_unit";
    process.env.RAZORPAY_KEY_SECRET = "test_secret";

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
        items: [
          expect.objectContaining({
            program_slug: "energy_vitality",
            queue_rank: 1,
          }),
        ],
      })
    );
  });

  it("accepts a multi-program checkout payload and persists queue priority", async () => {
    const response = await POST(
      buildRequest({
        amount: 2998,
        programOrder: ["21-day-deep-sleep-reset", "14-day-energy-restore"],
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
        items: [
          expect.objectContaining({ program_slug: "energy_vitality", queue_rank: 2 }),
          expect.objectContaining({ program_slug: "sleep_disorder_reset", queue_rank: 1 }),
        ],
      })
    );
  });

  it("rejects a queue priority payload that does not match the cart", async () => {
    const response = await POST(
      buildRequest({
        amount: 2998,
        programOrder: ["21-day-deep-sleep-reset"],
        items: [
          { program_slug: "14-day-energy-restore", title: "Energy", price_inr: 1499, quantity: 1 },
          { program_slug: "21-day-deep-sleep-reset", title: "Sleep", price_inr: 1499, quantity: 1 },
        ],
      }) as never
    );

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      message: "Program priority must match the programs in your cart.",
    });
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

  it("rejects crafted checkout payloads containing only legacy or free detox program slugs", async () => {
    // legacy program
    const legacyResponse = await POST(
      buildRequest({
        amount: 5999,
        items: [{ program_slug: "six_day_reset", title: "Control", price_inr: 5999, quantity: 1 }],
      }) as never
    );
    expect(legacyResponse.status).toBe(400);
    expect(await legacyResponse.json()).toEqual({ message: "No valid checkout items were found." });

    // free detox program
    const freeDetoxResponse = await POST(
      buildRequest({
        amount: 1499,
        items: [{ program_slug: "free_detox_reset", title: "Free Detox Program", price_inr: 0, quantity: 1 }],
      }) as never
    );
    expect(freeDetoxResponse.status).toBe(400);
    expect(await freeDetoxResponse.json()).toEqual({ message: "No valid checkout items were found." });
  });
});
