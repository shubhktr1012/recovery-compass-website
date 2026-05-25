import type { User } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getHostFromHeaders, isAdminHost } from "@/lib/admin/host";
import type { AdminAccessResult, AdminRole, AdminSession } from "@/lib/admin/types";

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

export function getRequestHost(request: Request | NextRequest) {
  return getHostFromHeaders(request.headers);
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

type AdminUserRow = {
  email: string | null;
  role: AdminRole | null;
  status: string | null;
  user_id: string | null;
};

async function resolveAdminUserFromDb(user: Pick<User, "id" | "email">) {
  const email = normalizeAdminEmail(user.email);
  if (!user.id || !email) {
    return null;
  }

  const { data: userIdMatch, error: userIdError } = await supabaseAdmin
    .from("admin_users")
    .select("user_id,email,role,status")
    .eq("user_id", user.id)
    .maybeSingle();

  if (userIdError) {
    console.warn("[admin] Failed to resolve admin user by id", userIdError);
  }

  const matchedById =
    (userIdMatch as AdminUserRow | null)?.status === "active"
      ? (userIdMatch as AdminUserRow)
      : null;

  const emailMatch = matchedById
    ? null
    : await supabaseAdmin
        .from("admin_users")
        .select("user_id,email,role,status")
        .ilike("email", email)
        .maybeSingle();

  if (emailMatch?.error) {
    console.warn("[admin] Failed to resolve admin user by email", emailMatch.error);
  }

  const emailMatchRow = emailMatch?.data as AdminUserRow | null | undefined;
  const row = matchedById ?? (emailMatchRow?.status === "active" ? emailMatchRow : null);
  const role = row?.role;

  if (!row || !role || !validRoles.has(role)) {
    return null;
  }

  return {
    userId: row.user_id ?? user.id,
    email: normalizeAdminEmail(row.email) || email,
    role,
    source: "admin_users",
  } satisfies AdminSession;
}

export function canViewFullAdminPii(admin: Pick<AdminSession, "role">) {
  return admin.role === "owner" || admin.role === "ops";
}

export function canGrantPrograms(admin: Pick<AdminSession, "role">) {
  return admin.role === "owner" || admin.role === "ops";
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

  const admin = resolveAdminUser(data.user) ?? (await resolveAdminUserFromDb(data.user));
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
