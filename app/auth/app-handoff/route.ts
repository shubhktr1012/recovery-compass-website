import { NextResponse } from "next/server";

import {
  getAppHandoffBaseUrl,
  hashAppHandoffToken,
  normalizeAppHandoffNextPath,
} from "@/lib/app-handoff";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

type ConsumedHandoffToken = {
  email: string;
  next_path: string;
  user_id: string;
};

function redirectToFallback(request: Request, reason: string) {
  const fallbackUrl = new URL("/diet-plan", request.url);
  fallbackUrl.searchParams.set("handoff_error", reason);
  return NextResponse.redirect(fallbackUrl);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token")?.trim();

  if (!token) {
    return redirectToFallback(request, "missing");
  }

  const tokenHash = hashAppHandoffToken(token);
  const nowIso = new Date().toISOString();
  const { data, error } = await supabaseAdmin
    .from("app_web_handoff_tokens")
    .update({ consumed_at: nowIso })
    .eq("token_hash", tokenHash)
    .is("consumed_at", null)
    .gt("expires_at", nowIso)
    .select("email,next_path,user_id")
    .maybeSingle<ConsumedHandoffToken>();

  if (error) {
    console.error("[AppHandoff] failed to consume token", { message: error.message });
    return redirectToFallback(request, "unavailable");
  }

  if (!data?.email) {
    return redirectToFallback(request, "expired");
  }

  const nextPath = normalizeAppHandoffNextPath(data.next_path);
  const baseUrl = getAppHandoffBaseUrl(request);
  const callbackUrl = new URL("/auth/callback", baseUrl);
  callbackUrl.searchParams.set("next", nextPath);

  const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
    type: "magiclink",
    email: data.email,
    options: {
      redirectTo: callbackUrl.toString(),
    },
  });

  const actionLink = linkData?.properties?.action_link;
  if (linkError || !actionLink) {
    console.error("[AppHandoff] failed to generate web session link", {
      message: linkError?.message ?? "missing action link",
      userId: data.user_id,
    });
    return redirectToFallback(request, "session");
  }

  return NextResponse.redirect(actionLink);
}
