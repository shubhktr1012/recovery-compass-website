import { NextResponse, type NextRequest } from "next/server";
import { getAdminApiAccess } from "@/lib/admin/auth";
import type { AdminSession } from "@/lib/admin/types";

type AdminApiGuard = { admin: AdminSession } | { response: NextResponse };

export async function requireAdminApi(request: NextRequest): Promise<AdminApiGuard> {
  const access = await getAdminApiAccess(request);

  if (!access.ok) {
    return {
      response: NextResponse.json(
        { message: access.message, reason: access.reason },
        { status: access.status }
      ),
    };
  }

  return { admin: access.admin };
}

export function adminApiError(error: unknown) {
  const message = error instanceof Error ? error.message : "Admin request failed";
  return NextResponse.json({ message }, { status: 500 });
}
