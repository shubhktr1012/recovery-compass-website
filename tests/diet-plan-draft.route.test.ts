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
    update: vi.fn(() => query),
    maybeSingle: vi.fn(async () => result),
    then: (resolve: (value: QueryResult) => unknown, reject: (reason: unknown) => unknown) =>
      Promise.resolve(result).then(resolve, reject),
  };

  return query;
}

const mocks = vi.hoisted(() => {
  const from = vi.fn();
  const getSupabaseAdmin = vi.fn(() => ({
    from,
  }));

  return {
    from,
    getSupabaseAdmin,
  };
});

vi.mock("@/lib/supabase-admin", () => ({
  getSupabaseAdmin: mocks.getSupabaseAdmin,
}));

import { PUT } from "@/app/api/diet-plan/draft/route";

function buildRequest(body: unknown) {
  return {
    json: async () => body,
  } as never;
}

describe("PUT /api/diet-plan/draft", () => {
  beforeEach(() => {
    mocks.from.mockReset();
    mocks.getSupabaseAdmin.mockClear();
  });

  it("rejects requests without a valid claim link", async () => {
    const response = await PUT(
      buildRequest({
        diet_order_id: "not-a-uuid",
        claim_token: "short",
        questionnaire_data: {},
      })
    );

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      message: "A valid paid diet plan claim link is required.",
    });
    expect(mocks.from).not.toHaveBeenCalled();
  });

  it("returns not found when the claim does not match an add-on order", async () => {
    const orderQuery = createQuery({ data: null, error: null });
    mocks.from.mockReturnValue(orderQuery);

    const response = await PUT(
      buildRequest({
        diet_order_id: "00000000-0000-4000-8000-000000000000",
        claim_token: "a".repeat(43),
        questionnaire_data: { name: "Shubh" },
      })
    );

    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body).toEqual({
      message: "No matching paid diet plan order found for this claim link.",
    });
  });

  it("saves questionnaire drafts for awaiting add-on orders", async () => {
    const orderQuery = createQuery({
      data: {
        id: "00000000-0000-4000-8000-000000000000",
        status: "awaiting_questionnaire",
        source: "checkout_addon",
      },
      error: null,
    });
    const updateQuery = createQuery({ data: null, error: null });

    mocks.from.mockImplementation((table: string) => {
      expect(table).toBe("diet_plan_orders");
      return orderQuery.select.mock.calls.length === 0 ? orderQuery : updateQuery;
    });

    const response = await PUT(
      buildRequest({
        diet_order_id: "00000000-0000-4000-8000-000000000000",
        claim_token: "a".repeat(43),
        email: "SHUBH@example.com",
        name: " Shubh ",
        questionnaire_data: { name: "Shubh", programs: ["Sleep Reset"] },
      })
    );

    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      message: "Draft saved.",
      saved: true,
      status: "awaiting_questionnaire",
    });
    expect(updateQuery.update).toHaveBeenCalledWith({
      email: "shubh@example.com",
      name: "Shubh",
      questionnaire_data: { name: "Shubh", programs: ["Sleep Reset"] },
    });
    expect(updateQuery.eq).toHaveBeenCalledWith("id", "00000000-0000-4000-8000-000000000000");
    expect(updateQuery.in).toHaveBeenCalledWith("status", ["awaiting_questionnaire", "failed"]);
  });
});
