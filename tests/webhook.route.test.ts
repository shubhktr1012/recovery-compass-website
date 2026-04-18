import crypto from "node:crypto";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  markTransactionPaid: vi.fn(),
  markTransactionFailed: vi.fn(),
}));

vi.mock("@/lib/commerce", () => ({
  markTransactionPaid: mocks.markTransactionPaid,
  markTransactionFailed: mocks.markTransactionFailed,
}));

import { POST } from "@/app/api/checkout/webhook/route";

function sign(body: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(body).digest("hex");
}

function buildWebhookRequest(rawBody: string, signature?: string) {
  const headers = new Headers();
  if (signature) {
    headers.set("x-razorpay-signature", signature);
  }

  return {
    text: async () => rawBody,
    headers: {
      get(name: string) {
        return headers.get(name);
      },
    },
  } as never;
}

describe("POST /api/checkout/webhook", () => {
  beforeEach(() => {
    process.env.RAZORPAY_WEBHOOK_SECRET = "webhook_secret";
    mocks.markTransactionPaid.mockReset();
    mocks.markTransactionFailed.mockReset();
  });

  it("rejects invalid webhook signatures", async () => {
    const body = JSON.stringify({
      event: "payment.captured",
      payload: { payment: { entity: { order_id: "order_1", id: "pay_1" } } },
    });

    const response = await POST(buildWebhookRequest(body, "bad-signature"));
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ message: "Invalid signature" });
  });

  it("processes payment.captured events", async () => {
    const body = JSON.stringify({
      event: "payment.captured",
      payload: { payment: { entity: { order_id: "order_1", id: "pay_1" } } },
    });

    mocks.markTransactionPaid.mockResolvedValueOnce({
      alreadyProcessed: false,
      transactionId: "txn_1",
    });

    const response = await POST(buildWebhookRequest(body, sign(body, process.env.RAZORPAY_WEBHOOK_SECRET!)));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ status: "ok" });
    expect(mocks.markTransactionPaid).toHaveBeenCalledWith(
      expect.objectContaining({
        providerOrderId: "order_1",
        providerPaymentId: "pay_1",
      })
    );
  });

  it("processes payment.failed events", async () => {
    const body = JSON.stringify({
      event: "payment.failed",
      payload: {
        payment: {
          entity: {
            order_id: "order_2",
            id: "pay_2",
            error_code: "BAD_REQUEST_ERROR",
            error_description: "Payment failed",
            error_reason: "payment_declined",
          },
        },
      },
    });

    const response = await POST(buildWebhookRequest(body, sign(body, process.env.RAZORPAY_WEBHOOK_SECRET!)));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ status: "ok" });
    expect(mocks.markTransactionFailed).toHaveBeenCalledWith(
      "order_2",
      expect.objectContaining({
        webhook_event: "payment.failed",
        error_code: "BAD_REQUEST_ERROR",
      })
    );
  });
});
