import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/commerce";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    // if "next" is in search params, use it as the redirection URL
    const next = searchParams.get("next") ?? "/";
    const redirectUrl = new URL(`/auth/complete?next=${encodeURIComponent(next)}`, request.url);
    let response = NextResponse.redirect(redirectUrl);
    response.headers.set("Cache-Control", "private, no-store");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");

    if (code) {
        const cookieStore = await cookies(); // Next.js 15+ requires await
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
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            const { data: userData, error: userError } = await supabase.auth.getUser();

            if (userError) {
                console.error("[Auth Callback] getUser after exchange failed:", userError);
            } else if (userData.user?.id) {
                const { error: profileError } = await supabaseAdmin
                    .from("profiles")
                    .upsert(
                        {
                            id: userData.user.id,
                            email: userData.user.email ?? null,
                            updated_at: new Date().toISOString(),
                        },
                        { onConflict: "id" }
                    );

                if (profileError) {
                    console.error("[Auth Callback] profile bootstrap upsert failed:", profileError);
                }
            }

            return response;
        }

        console.error("[Auth Callback] exchangeCodeForSession failed:", error);
    }

    // On error, send back to homepage rather than a non-existent error page
    return NextResponse.redirect(`${origin}/?auth_error=true`);
}
