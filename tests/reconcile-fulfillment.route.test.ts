import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  reconcilePendingFulfillments: vi.fn(),
}));

vi.mock("@/lib/commerce", () => ({
  reconcilePendingFulfillments: mocks.reconcilePendingFulfillments,
}));

import { POST } from "@/app/api/checkout/reconcile-fulfillment/route";

function buildRequest(options: {
  headers?: Record<string, string>;
  jsonBody?: unknown;
  throwOnJson?: boolean;
}) {
  const headerMap = new Headers(options.headers ?? {});

  return {
    headers: {
      get(name: string) {
        return headerMap.get(name);
      },
    },
    json: async () => {
      if (options.throwOnJson) {
        throw new Error("Bad JSON");
      }
      return options.jsonBody ?? {};
    },
  } as never;
}

describe("POST /api/checkout/reconcile-fulfillment", () => {
  beforeEach(() => {
    mocks.reconcilePendingFulfillments.mockReset();
    delete process.env.COMMERCE_RECONCILE_SECRET;
  });

  it("returns 500 when reconcile secret is not configured", async () => {
    const response = await POST(buildRequest({ headers: { "content-length": "0" } }));
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      message: "COMMERCE_RECONCILE_SECRET is not configured",
    });
  });

  it("returns 401 on unauthorized requests", async () => {
    process.env.COMMERCE_RECONCILE_SECRET = "secret-123";
    const response = await POST(buildRequest({ headers: { "content-length": "0" } }));
    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ message: "Unauthorized" });
  });

  it("returns 400 on invalid JSON payload", async () => {
    process.env.COMMERCE_RECONCILE_SECRET = "secret-123";
    const response = await POST(
      buildRequest({
        headers: {
          authorization: "Bearer secret-123",
          "content-length": "12",
        },
        throwOnJson: true,
      })
    );

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ message: "Invalid JSON body" });
  });

  it("runs reconciliation for authorized requests", async () => {
    process.env.COMMERCE_RECONCILE_SECRET = "secret-123";
    mocks.reconcilePendingFulfillments.mockResolvedValueOnce({
      scanned: 2,
      attempted: 2,
      fulfilled: 2,
      failed: 0,
      failures: [],
    });

    const response = await POST(
      buildRequest({
        headers: {
          "x-reconcile-secret": "secret-123",
          "content-length": "20",
        },
        jsonBody: {
          limit: 20,
          maxAgeMinutes: 10,
        },
      })
    );

    expect(response.status).toBe(200);
    expect(mocks.reconcilePendingFulfillments).toHaveBeenCalledWith({
      limit: 20,
      maxAgeMinutes: 10,
    });
    expect(await response.json()).toEqual({
      status: "ok",
      result: {
        scanned: 2,
        attempted: 2,
        fulfilled: 2,
        failed: 0,
        failures: [],
      },
    });
  });
});
