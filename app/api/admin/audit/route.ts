import { NextResponse, type NextRequest } from "next/server";
import { requireAdminApi, adminApiError } from "@/lib/admin/api";
import { recordAdminAuditLog } from "@/lib/admin/audit";

const allowedCopyActions = new Set([
  "diagnostic_sql_copied",
  "support_packet_copied",
  "grant_review_request_copied",
  "queue_repair_request_copied",
  "fulfillment_review_copied",
]);

type AdminAuditRequest = {
  action?: string;
  metadata?: Record<string, unknown>;
  targetEmail?: string | null;
  targetProgram?: string | null;
  targetUserId?: string | null;
};

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const auth = await requireAdminApi(request);
  if ("response" in auth) {
    return auth.response;
  }

  try {
    const body = (await request.json()) as AdminAuditRequest;
    const action = normalizeText(body.action);

    if (!allowedCopyActions.has(action)) {
      return NextResponse.json({ message: "Unsupported audit action." }, { status: 400 });
    }

    await recordAdminAuditLog({
      action,
      admin: auth.admin,
      metadata: {
        ...(body.metadata ?? {}),
        source: "admin_dashboard",
      },
      targetEmail: normalizeText(body.targetEmail) || null,
      targetProgram: normalizeText(body.targetProgram) || null,
      targetUserId: normalizeText(body.targetUserId) || null,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return adminApiError(error);
  }
}
