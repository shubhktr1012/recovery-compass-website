import { createHash, randomBytes } from "node:crypto";

export const APP_HANDOFF_TOKEN_TTL_SECONDS = 60;
export const APP_HANDOFF_DEFAULT_NEXT_PATH = "/diet-plan";
export const APP_HANDOFF_ALLOWED_NEXT_PATHS = [
  "/",
  "/checkout",
  "/diet-plan",
  "/program-finder",
] as const;

const ALLOWED_NEXT_PATH_SET = new Set<string>(APP_HANDOFF_ALLOWED_NEXT_PATHS);

export function createAppHandoffToken() {
  return randomBytes(32).toString("base64url");
}

export function hashAppHandoffToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function normalizeAppHandoffNextPath(value: unknown) {
  if (typeof value !== "string") {
    return APP_HANDOFF_DEFAULT_NEXT_PATH;
  }

  const trimmed = value.trim();
  if (!trimmed || trimmed.startsWith("//")) {
    return APP_HANDOFF_DEFAULT_NEXT_PATH;
  }

  try {
    const parsed = new URL(trimmed, "https://recoverycompass.co");

    if (parsed.origin !== "https://recoverycompass.co" && /^[a-z][a-z\d+.-]*:/i.test(trimmed)) {
      return APP_HANDOFF_DEFAULT_NEXT_PATH;
    }

    return ALLOWED_NEXT_PATH_SET.has(parsed.pathname)
      ? parsed.pathname
      : APP_HANDOFF_DEFAULT_NEXT_PATH;
  } catch {
    return APP_HANDOFF_DEFAULT_NEXT_PATH;
  }
}

export function getAppHandoffBaseUrl(request: Request) {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configuredUrl) {
    return configuredUrl.replace(/\/+$/, "");
  }

  return new URL(request.url).origin;
}
