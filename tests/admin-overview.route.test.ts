import { describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const mocks = vi.hoisted(() => ({
  getAdminOverview: vi.fn(),
  requireAdminApi: vi.fn(),
}));

vi.mock("@/lib/admin/api", () => ({
  adminApiError: (error: unknown) =>
    Response.json(
      { message: error instanceof Error ? error.message : "Admin request failed" },
      { status: 500 }
    ),
  requireAdminApi: mocks.requireAdminApi,
}));

vi.mock("@/lib/admin/data", () => ({
  getAdminOverview: mocks.getAdminOverview,
}));

import { GET } from "@/app/api/admin/overview/route";

describe("GET /api/admin/overview", () => {
  it("returns the admin auth failure response before loading data", async () => {
    mocks.requireAdminApi.mockResolvedValueOnce({
      response: Response.json({ message: "Unauthorized" }, { status: 401 }),
    });

    const response = await GET(
      new NextRequest("https://admin.recoverycompass.co/api/admin/overview")
    );

    expect(response.status).toBe(401);
    expect(mocks.getAdminOverview).not.toHaveBeenCalled();
  });

  it("returns shaped overview data for authorized admin requests", async () => {
    mocks.requireAdminApi.mockResolvedValueOnce({
      admin: { email: "ops@example.com", role: "ops", source: "env_allowlist", userId: "user-1" },
    });
    mocks.getAdminOverview.mockResolvedValueOnce({
      kpis: [],
      range: { key: "7d" },
      trend: [],
    });

    const response = await GET(
      new NextRequest("https://admin.recoverycompass.co/api/admin/overview?range=7d")
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      kpis: [],
      range: { key: "7d" },
      trend: [],
    });
  });
});
