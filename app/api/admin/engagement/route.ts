import { NextResponse, type NextRequest } from "next/server";
import { requireAdminApi, adminApiError } from "@/lib/admin/api";
import { getAdminDateRange } from "@/lib/admin/date-range";
import { getAdminEngagement } from "@/lib/admin/data";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = await requireAdminApi(request);
  if ("response" in auth) {
    return auth.response;
  }

  try {
    const range = getAdminDateRange(request.nextUrl.searchParams);
    return NextResponse.json(await getAdminEngagement(range));
  } catch (error) {
    return adminApiError(error);
  }
}
