import { NextResponse } from "next/server";

import {
  APP_HANDOFF_TOKEN_TTL_SECONDS,
  createAppHandoffToken,
  getAppHandoffBaseUrl,
  hashAppHandoffToken,
  normalizeAppHandoffNextPath,
} from "@/lib/app-handoff";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

function getBearerToken(request: Request) {
  const authorization = request.headers.get("authorization") ?? "";
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() ?? null;
}

async function consumeHandoffRateLimit(userId: string) {
  const { data, error } = await supabaseAdmin.rpc("consume_rate_limit", {
    p_bucket: "app_web_handoff",
    p_identifier: userId,
    p_max_requests: 10,
    p_window_seconds: 300,
  });

  if (error) {
    console.warn("[AppHandoff] rate limit unavailable", { message: error.message });
    return true;
  }

  const firstRow = Array.isArray(data) ? data[0] : null;
  return firstRow?.allowed !== false;
}

export async function POST(request: Request) {
  const accessToken = getBearerToken(request);
  if (!accessToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { data: userResult, error: userError } = await supabaseAdmin.auth.getUser(accessToken);
  const user = userResult.user;
  if (userError || !user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!user.email) {
    return NextResponse.json({ message: "Email is required for web handoff" }, { status: 422 });
  }

  const isAllowed = await consumeHandoffRateLimit(user.id);
  if (!isAllowed) {
    return NextResponse.json({ message: "Too many handoff requests" }, { status: 429 });
  }

  const body = await request.json().catch(() => ({}));
  const nextPath = normalizeAppHandoffNextPath((body as { next?: unknown }).next);
  const token = createAppHandoffToken();
  const tokenHash = hashAppHandoffToken(token);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + APP_HANDOFF_TOKEN_TTL_SECONDS * 1000);

  const { error: insertError } = await supabaseAdmin
    .from("app_web_handoff_tokens")
    .insert({
      token_hash: tokenHash,
      user_id: user.id,
      email: user.email,
      next_path: nextPath,
      platform: request.headers.get("x-rc-platform"),
      user_agent: request.headers.get("user-agent"),
      expires_at: expiresAt.toISOString(),
      metadata: {
        source: "recovery_compass_app",
      },
    });

  if (insertError) {
    console.error("[AppHandoff] failed to create token", { message: insertError.message });
    return NextResponse.json({ message: "Could not create handoff" }, { status: 500 });
  }

  const baseUrl = getAppHandoffBaseUrl(request);
  const url = new URL("/auth/app-handoff", baseUrl);
  url.searchParams.set("token", token);

  return NextResponse.json({
    expiresAt: expiresAt.toISOString(),
    url: url.toString(),
  });
}
