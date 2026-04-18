import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getFulfillmentHealthSnapshot: vi.fn(),
}));

vi.mock("@/lib/commerce", () => ({
  getFulfillmentHealthSnapshot: mocks.getFulfillmentHealthSnapshot,
}));

import { GET } from "@/app/api/checkout/fulfillment-health/route";

function buildRequest(headers?: Record<string, string>) {
  const map = new Headers(headers ?? {});
  return {
    headers: {
      get(name: string) {
        return map.get(name);
      },
    },
  } as never;
}

describe("GET /api/checkout/fulfillment-health", () => {
  it("returns 500 when monitoring secret is missing", async () => {
    delete process.env.COMMERCE_RECONCILE_SECRET;
    const response = await GET(buildRequest());
    expect(response.status).toBe(500);
  });

  it("returns 401 when secret is invalid", async () => {
    process.env.COMMERCE_RECONCILE_SECRET = "secret-123";
    const response = await GET(buildRequest({ authorization: "Bearer wrong" }));
    expect(response.status).toBe(401);
  });

  it("returns health snapshot for authorized requests", async () => {
    process.env.COMMERCE_RECONCILE_SECRET = "secret-123";
    mocks.getFulfillmentHealthSnapshot.mockResolvedValueOnce({
      paidPendingCount: 1,
      paidFailedCount: 2,
      paidFulfilledCount: 10,
      oldestStalledTransaction: {
        id: "txn-1",
        provider_order_id: "order_1",
        updated_at: "2026-04-18T00:00:00.000Z",
        fulfillment_status: "pending",
      },
    });

    const response = await GET(buildRequest({ "x-reconcile-secret": "secret-123" }));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      status: "ok",
      snapshot: {
        paidPendingCount: 1,
        paidFailedCount: 2,
        paidFulfilledCount: 10,
        oldestStalledTransaction: {
          id: "txn-1",
          provider_order_id: "order_1",
          updated_at: "2026-04-18T00:00:00.000Z",
          fulfillment_status: "pending",
        },
      },
    });
  });
});
