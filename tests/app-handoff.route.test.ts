import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  const generateLink = vi.fn();
  const getUser = vi.fn();
  const rpc = vi.fn();
  const from = vi.fn();

  return {
    from,
    generateLink,
    getUser,
    rpc,
  };
});

vi.mock("@/lib/supabase-admin", () => ({
  supabaseAdmin: {
    auth: {
      admin: {
        generateLink: mocks.generateLink,
      },
      getUser: mocks.getUser,
    },
    from: mocks.from,
    rpc: mocks.rpc,
  },
}));

import { POST } from "@/app/api/auth/app-handoff/route";
import { GET } from "@/app/auth/app-handoff/route";
import { hashAppHandoffToken, normalizeAppHandoffNextPath } from "@/lib/app-handoff";

function buildPostRequest(body: unknown, token = "app-token") {
  return new Request("https://recoverycompass.co/api/auth/app-handoff", {
    body: JSON.stringify(body),
    headers: token ? { authorization: `Bearer ${token}` } : undefined,
    method: "POST",
  });
}

function createConsumeQuery(result: unknown) {
  const query = {
    eq: vi.fn(() => query),
    gt: vi.fn(() => query),
    is: vi.fn(() => query),
    maybeSingle: vi.fn(async () => result),
    select: vi.fn(() => query),
    update: vi.fn(() => query),
  };

  return query;
}

describe("app web handoff", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://recoverycompass.co";
    mocks.from.mockReset();
    mocks.generateLink.mockReset();
    mocks.getUser.mockReset();
    mocks.rpc.mockReset();

    mocks.getUser.mockResolvedValue({
      data: { user: { email: "user@example.com", id: "user-1" } },
      error: null,
    });
    mocks.rpc.mockResolvedValue({
      data: [{ allowed: true, remaining: 9, reset_at: new Date().toISOString() }],
      error: null,
    });
  });

  it("normalizes handoff next paths to the v1 allowlist", () => {
    expect(normalizeAppHandoffNextPath("/diet-plan")).toBe("/diet-plan");
    expect(normalizeAppHandoffNextPath("/checkout?ignored=true")).toBe("/checkout");
    expect(normalizeAppHandoffNextPath("/admin")).toBe("/diet-plan");
    expect(normalizeAppHandoffNextPath("https://evil.example/diet-plan")).toBe("/diet-plan");
  });

  it("creates a short-lived handoff token for a valid app session", async () => {
    const insert = vi.fn(async () => ({ error: null }));
    mocks.from.mockReturnValue({ insert });

    const response = await POST(buildPostRequest({ next: "/checkout" }));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.url).toMatch(/^https:\/\/recoverycompass\.co\/auth\/app-handoff\?token=/);
    expect(mocks.getUser).toHaveBeenCalledWith("app-token");
    expect(mocks.rpc).toHaveBeenCalledWith("consume_rate_limit", expect.objectContaining({
      p_bucket: "app_web_handoff",
      p_identifier: "user-1",
    }));
    expect(insert).toHaveBeenCalledWith(expect.objectContaining({
      email: "user@example.com",
      next_path: "/checkout",
      token_hash: expect.stringMatching(/^[a-f0-9]{64}$/),
      user_id: "user-1",
    }));
  });

  it("rejects invalid app sessions", async () => {
    mocks.getUser.mockResolvedValueOnce({
      data: { user: null },
      error: null,
    });

    const response = await POST(buildPostRequest({ next: "/diet-plan" }));

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ message: "Unauthorized" });
    expect(mocks.from).not.toHaveBeenCalled();
  });

  it("burns a valid token and redirects through Supabase magic-link auth", async () => {
    const consumeQuery = createConsumeQuery({
      data: {
        email: "user@example.com",
        next_path: "/checkout",
        user_id: "user-1",
      },
      error: null,
    });
    mocks.from.mockReturnValue(consumeQuery);
    mocks.generateLink.mockResolvedValue({
      data: { properties: { action_link: "https://supabase.example/action-link" } },
      error: null,
    });

    const response = await GET(new Request("https://recoverycompass.co/auth/app-handoff?token=handoff-token"));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("https://supabase.example/action-link");
    expect(consumeQuery.update).toHaveBeenCalledWith({ consumed_at: expect.any(String) });
    expect(consumeQuery.eq).toHaveBeenCalledWith("token_hash", hashAppHandoffToken("handoff-token"));
    expect(consumeQuery.is).toHaveBeenCalledWith("consumed_at", null);
    expect(mocks.generateLink).toHaveBeenCalledWith({
      email: "user@example.com",
      options: {
        redirectTo: "https://recoverycompass.co/auth/callback?next=%2Fcheckout",
      },
      type: "magiclink",
    });
  });

  it("does not replay consumed or expired tokens", async () => {
    const consumeQuery = createConsumeQuery({ data: null, error: null });
    mocks.from.mockReturnValue(consumeQuery);

    const response = await GET(new Request("https://recoverycompass.co/auth/app-handoff?token=old-token"));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("https://recoverycompass.co/diet-plan?handoff_error=expired");
    expect(mocks.generateLink).not.toHaveBeenCalled();
  });
});
