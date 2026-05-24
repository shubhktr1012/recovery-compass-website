const DEFAULT_ADMIN_HOST = "admin.recoverycompass.co";
const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

export function getAdminDashboardHost() {
  return (
    process.env.ADMIN_DASHBOARD_HOST?.trim().toLowerCase() ?? DEFAULT_ADMIN_HOST
  );
}

export function normalizeHost(host: string | null | undefined) {
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

export function getHostFromHeaders(headers: Headers) {
  return (
    headers.get("x-forwarded-host") ??
    headers.get("host") ??
    headers.get("x-vercel-forwarded-host")
  );
}
