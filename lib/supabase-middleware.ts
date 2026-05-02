import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

function isRefreshTokenNotFoundError(error: unknown) {
  if (!error || typeof error !== "object") {
    return false;
  }

  const authError = error as { code?: string; message?: string; name?: string };
  const haystack = `${authError.code ?? ""} ${authError.name ?? ""} ${authError.message ?? ""}`.toLowerCase();

  return (
    authError.code === "refresh_token_not_found" ||
    haystack.includes("refresh token not found") ||
    haystack.includes("invalid refresh token")
  );
}

function clearSupabaseCookies(request: NextRequest, response: NextResponse) {
  request.cookies
    .getAll()
    .filter(({ name }) => name.startsWith("sb-"))
    .forEach(({ name }) => {
      response.cookies.set(name, "", {
        maxAge: 0,
        path: "/",
      });
    });
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));

          response = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  try {
    await supabase.auth.getUser();
  } catch (error) {
    if (isRefreshTokenNotFoundError(error)) {
      clearSupabaseCookies(request, response);
      return response;
    }

    throw error;
  }

  return response;
}
