import { NextResponse, type NextRequest } from "next/server";
import { requireAdminApi, adminApiError } from "@/lib/admin/api";
import { searchAdminUsers } from "@/lib/admin/data";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = await requireAdminApi(request);
  if ("response" in auth) {
    return auth.response;
  }

  try {
    return NextResponse.json({
      users: await searchAdminUsers(request.nextUrl.searchParams.get("q") ?? ""),
    });
  } catch (error) {
    return adminApiError(error);
  }
}
