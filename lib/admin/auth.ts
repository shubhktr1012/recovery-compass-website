import type { User } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import type { AdminAccessResult, AdminRole, AdminSession } from "@/lib/admin/types";

const DEFAULT_ADMIN_HOST = "admin.recoverycompass.co";
const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);
const validRoles = new Set<AdminRole>(["owner", "ops", "viewer"]);

export function normalizeAdminEmail(email: string | null | undefined) {
  return email?.trim().toLowerCase() ?? "";
}

export function parseAdminEmails(value = process.env.ADMIN_EMAILS) {
  const entries = new Map<string, AdminRole>();

  value
    ?.split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .forEach((item) => {
      const [maybeRole, maybeEmail] = item.includes(":")
        ? item.split(":")
        : ["owner", item];
      const email = normalizeAdminEmail(maybeEmail);
      const role = validRoles.has(maybeRole as AdminRole)
        ? (maybeRole as AdminRole)
        : "owner";

      if (email) {
        entries.set(email, role);
      }
    });

  return entries;
}

export function getAdminDashboardHost() {
  return (
    process.env.ADMIN_DASHBOARD_HOST?.trim().toLowerCase() ?? DEFAULT_ADMIN_HOST
  );
}

function normalizeHost(host: string | null | undefined) {
  const firstHost = host?.split(",")[0]?.trim().toLowerCase();
  if (!firstHost) {
    return "";
  }

  if (firstHost.startsWith("[")) {
    return firstHost.replace(/^\[|\](?::\d+)?$/g, "");
  }

  return firstHost.replace(/:\d+$/, "");
}

export function isAdminHost(host: string | null | undefined) {
  const normalizedHost = normalizeHost(host);
  if (!normalizedHost) {
    return false;
  }

  if (LOCAL_HOSTS.has(normalizedHost) || normalizedHost.endsWith(".localhost")) {
    return process.env.NODE_ENV !== "production";
  }

  return normalizedHost === normalizeHost(getAdminDashboardHost());
}

export function getRequestHost(request: Request | NextRequest) {
  return (
    request.headers.get("x-forwarded-host") ??
    request.headers.get("host") ??
    request.headers.get("x-vercel-forwarded-host")
  );
}

export function resolveAdminUser(user: Pick<User, "id" | "email"> | null | undefined) {
  const email = normalizeAdminEmail(user?.email);
  if (!user?.id || !email) {
    return null;
  }

  const role = parseAdminEmails().get(email);
  if (!role) {
    return null;
  }

  return {
    userId: user.id,
    email,
    role,
    source: "env_allowlist",
  } satisfies AdminSession;
}

export async function getAdminAccess(): Promise<AdminAccessResult> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return {
      ok: false,
      reason: "unauthenticated",
      status: 401,
      message: "Sign in with an approved admin account.",
    };
  }

  const admin = resolveAdminUser(data.user);
  if (!admin) {
    return {
      ok: false,
      reason: "not_admin",
      status: 403,
      message: "This account is not approved for admin access.",
    };
  }

  return { ok: true, admin };
}

export async function getAdminApiAccess(
  request: Request | NextRequest
): Promise<AdminAccessResult> {
  if (!isAdminHost(getRequestHost(request))) {
    return {
      ok: false,
      reason: "wrong_host",
      status: 404,
      message: "Admin API is only available on the admin host.",
    };
  }

  return getAdminAccess();
}
