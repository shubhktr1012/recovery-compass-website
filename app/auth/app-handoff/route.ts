import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

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

function setNoStoreHeaders(response: NextResponse) {
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
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
  const response = NextResponse.redirect(new URL(nextPath, baseUrl));
  setNoStoreHeaders(response);

  const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
    type: "magiclink",
    email: data.email,
  });

  const generatedTokenHash = linkData?.properties?.hashed_token;
  if (linkError || !generatedTokenHash) {
    console.error("[AppHandoff] failed to generate web session link", {
      message: linkError?.message ?? "missing token hash",
      userId: data.user_id,
    });
    return redirectToFallback(request, "session");
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { error: verifyError } = await supabase.auth.verifyOtp({
    token_hash: generatedTokenHash,
    type: "magiclink",
  });

  if (verifyError) {
    console.error("[AppHandoff] failed to establish web session", {
      message: verifyError.message,
      userId: data.user_id,
    });
    return redirectToFallback(request, "session");
  }

  return response;
}
