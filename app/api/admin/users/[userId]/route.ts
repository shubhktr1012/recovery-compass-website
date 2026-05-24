import { NextResponse, type NextRequest } from "next/server";
import { requireAdminApi, adminApiError } from "@/lib/admin/api";
import { getAdminUserDetail } from "@/lib/admin/data";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  const auth = await requireAdminApi(request);
  if ("response" in auth) {
    return auth.response;
  }

  try {
    const { userId } = await context.params;
    const user = await getAdminUserDetail(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    return adminApiError(error);
  }
}
