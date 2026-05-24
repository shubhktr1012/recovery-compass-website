import { afterEach, describe, expect, it, vi } from "vitest";
import {
  isAdminHost,
  normalizeAdminEmail,
  parseAdminEmails,
  resolveAdminUser,
} from "@/lib/admin/auth";
import { getAdminDateRange } from "@/lib/admin/date-range";
import { maskEmail } from "@/lib/admin/format";

describe("admin auth helpers", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("normalizes and parses temporary admin email allowlist entries", () => {
    const allowlist = parseAdminEmails(
      "OWNER:Founder@RecoveryCompass.co, ops:ops@example.com, viewer@example.com"
    );

    expect(allowlist.get("founder@recoverycompass.co")).toBe("owner");
    expect(allowlist.get("ops@example.com")).toBe("ops");
    expect(allowlist.get("viewer@example.com")).toBe("owner");
    expect(normalizeAdminEmail("  TEAM@Example.COM ")).toBe("team@example.com");
  });

  it("resolves only allowlisted signed-in users as admins", () => {
    vi.stubEnv("ADMIN_EMAILS", "ops:ops@example.com");

    expect(resolveAdminUser({ id: "user-1", email: "ops@example.com" })).toEqual({
      email: "ops@example.com",
      role: "ops",
      source: "env_allowlist",
      userId: "user-1",
    });
    expect(resolveAdminUser({ id: "user-2", email: "not-admin@example.com" })).toBeNull();
  });

  it("allows only the admin host in production", () => {
    vi.stubEnv("NODE_ENV", "production");

    expect(isAdminHost("admin.recoverycompass.co")).toBe(true);
    expect(isAdminHost("recoverycompass.co")).toBe(false);
    expect(isAdminHost("localhost:3000")).toBe(false);
  });

  it("allows localhost only outside production for local development", () => {
    vi.stubEnv("NODE_ENV", "development");

    expect(isAdminHost("localhost:3000")).toBe(true);
    expect(isAdminHost("127.0.0.1:3000")).toBe(true);
  });
});

describe("admin display helpers", () => {
  it("defaults date range to seven days and caps options at thirty days", () => {
    const range = getAdminDateRange(
      new URLSearchParams({ range: "not-supported" }),
      new Date("2026-05-24T12:00:00.000Z")
    );
    const thirty = getAdminDateRange(
      new URLSearchParams({ range: "30d" }),
      new Date("2026-05-24T12:00:00.000Z")
    );

    expect(range.key).toBe("7d");
    expect(range.days).toBe(7);
    expect(thirty.key).toBe("30d");
    expect(thirty.days).toBe(30);
  });

  it("masks email addresses in list views", () => {
    expect(maskEmail("shubh@example.com")).toBe("sh***@e***.com");
    expect(maskEmail(null)).toBe("No email");
  });
});
