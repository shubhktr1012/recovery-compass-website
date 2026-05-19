import { beforeEach, describe, expect, it, vi } from "vitest";

type QueryResult = {
  data?: unknown;
  error?: { message: string } | null;
};

function createQuery(result: QueryResult) {
  const query = {
    select: vi.fn(() => query),
    eq: vi.fn(() => query),
    in: vi.fn(() => query),
    order: vi.fn(() => query),
    limit: vi.fn(() => query),
    update: vi.fn(() => query),
    maybeSingle: vi.fn(async () => result),
    then: (resolve: (value: QueryResult) => unknown, reject: (reason: unknown) => unknown) =>
      Promise.resolve(result).then(resolve, reject),
  };

  return query;
}

const mocks = vi.hoisted(() => {
  const getUser = vi.fn();
  const from = vi.fn();
  const createSupabaseServerClient = vi.fn(async () => ({
    auth: {
      getUser,
    },
  }));
  const getSupabaseAdmin = vi.fn(() => ({
    from,
  }));

  return {
    getUser,
    from,
    createSupabaseServerClient,
    getSupabaseAdmin,
  };
});

vi.mock("@/lib/supabase-server", () => ({
  createSupabaseServerClient: mocks.createSupabaseServerClient,
}));

vi.mock("@/lib/supabase-admin", () => ({
  getSupabaseAdmin: mocks.getSupabaseAdmin,
}));

import { GET } from "@/app/api/diet-plan/pending-claim/route";

describe("GET /api/diet-plan/pending-claim", () => {
  beforeEach(() => {
    mocks.getUser.mockReset();
    mocks.from.mockReset();
    mocks.createSupabaseServerClient.mockClear();
    mocks.getSupabaseAdmin.mockClear();
  });

  it("does not expose pending claims to unauthenticated users", async () => {
    mocks.getUser.mockResolvedValueOnce({
      data: { user: null },
      error: null,
    });

    const response = await GET();

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ pending: false });
    expect(mocks.from).not.toHaveBeenCalled();
  });

  it("returns no pending claim when the user has no matching transactions", async () => {
    const transactionsQuery = createQuery({ data: [], error: null });

    mocks.getUser.mockResolvedValueOnce({
      data: { user: { id: "user-1" } },
      error: null,
    });
    mocks.from.mockImplementation((table: string) => {
      expect(table).toBe("transactions");
      return transactionsQuery;
    });

    const response = await GET();

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ pending: false });
    expect(transactionsQuery.eq).toHaveBeenCalledWith("user_id", "user-1");
  });

  it("rotates a claim token and returns a fresh questionnaire link for pending add-ons", async () => {
    const transactionsQuery = createQuery({
      data: [{ id: "txn-1" }, { id: "txn-2" }],
      error: null,
    });
    const orderQuery = createQuery({
      data: {
        id: "8181a1e1-4eb3-4824-91ff-39bb96ff2793",
        status: "awaiting_questionnaire",
      },
      error: null,
    });
    const updateQuery = createQuery({ data: null, error: null });

    mocks.getUser.mockResolvedValueOnce({
      data: { user: { id: "user-1" } },
      error: null,
    });
    mocks.from.mockImplementation((table: string) => {
      if (table === "transactions") {
        return transactionsQuery;
      }
      if (table === "diet_plan_orders" && orderQuery.select.mock.calls.length === 0) {
        return orderQuery;
      }
      if (table === "diet_plan_orders") {
        return updateQuery;
      }
      throw new Error(`Unexpected table: ${table}`);
    });

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      pending: true,
      orderId: "8181a1e1-4eb3-4824-91ff-39bb96ff2793",
      status: "awaiting_questionnaire",
    });
    expect(body.href).toMatch(
      /^\/diet-plan\?cart_checkout=true&diet_order_id=8181a1e1-4eb3-4824-91ff-39bb96ff2793&token=/
    );
    expect(orderQuery.eq).toHaveBeenCalledWith("source", "checkout_addon");
    expect(orderQuery.in).toHaveBeenCalledWith("status", ["awaiting_questionnaire", "failed"]);
    expect(orderQuery.in).toHaveBeenCalledWith("source_transaction_id", ["txn-1", "txn-2"]);
    expect(updateQuery.update).toHaveBeenCalledWith({
      claim_token_hash: expect.stringMatching(/^[a-f0-9]{64}$/),
    });
    expect(updateQuery.eq).toHaveBeenCalledWith("id", "8181a1e1-4eb3-4824-91ff-39bb96ff2793");
  });
});
