import crypto from "node:crypto";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  markTransactionPaid: vi.fn(),
}));

vi.mock("@/lib/commerce", () => ({
  markTransactionPaid: mocks.markTransactionPaid,
}));

import { POST } from "@/app/api/checkout/verify-payment/route";

function sign(orderId: string, paymentId: string, secret: string) {
  return crypto
    .createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
}

describe("POST /api/checkout/verify-payment", () => {
  beforeEach(() => {
    process.env.RAZORPAY_KEY_SECRET = "test_secret";
    mocks.markTransactionPaid.mockReset();
  });

  it("rejects invalid payment signatures", async () => {
    const response = await POST(
      {
        json: async () => ({
          razorpay_order_id: "order_1",
          razorpay_payment_id: "pay_1",
          razorpay_signature: "bad",
        }),
      } as never
    );

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ message: "Invalid payment signature" });
    expect(mocks.markTransactionPaid).not.toHaveBeenCalled();
  });

  it("returns already processed message on idempotent replay", async () => {
    mocks.markTransactionPaid.mockResolvedValueOnce({
      alreadyProcessed: true,
      transactionId: "txn_1",
    });

    const orderId = "order_1";
    const paymentId = "pay_1";
    const response = await POST(
      {
        json: async () => ({
          razorpay_order_id: orderId,
          razorpay_payment_id: paymentId,
          razorpay_signature: sign(orderId, paymentId, process.env.RAZORPAY_KEY_SECRET!),
        }),
      } as never
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      message: "Payment already processed",
      transactionId: "txn_1",
    });
  });
});
