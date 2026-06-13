import { NextResponse, type NextRequest } from "next/server";
import { requireAdminApi, adminApiError } from "@/lib/admin/api";
import { canManageDietPlans } from "@/lib/admin/auth";
import { parseManualDietPlanOrderPayload } from "@/lib/admin/diet-plan-actions";
import { recordAdminAuditLog } from "@/lib/admin/audit";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Invalid request.";
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminApi(request);
  if ("response" in auth) {
    return auth.response;
  }

  if (!canManageDietPlans(auth.admin)) {
    return NextResponse.json(
      { message: "Only owner and ops admins can create manual diet plan orders." },
      { status: 403 }
    );
  }

  let parsed: ReturnType<typeof parseManualDietPlanOrderPayload>;
  try {
    parsed = parseManualDietPlanOrderPayload(await request.json());
  } catch (error) {
    return NextResponse.json({ message: getErrorMessage(error) }, { status: 400 });
  }

  try {
    const { data: order, error } = await supabaseAdmin
      .from("diet_plan_orders")
      .insert({
        admin_notes: parsed.adminNotes,
        amount: parsed.amount,
        currency: "INR",
        email: parsed.email,
        manual_created_by: auth.admin.email,
        manual_payment_link_url: parsed.paymentLinkUrl,
        name: parsed.name,
        questionnaire_data: parsed.questionnaireData,
        source: "admin_manual",
        status: "awaiting_payment",
      })
      .select("id,email,name,amount,currency,status,source,manual_payment_link_url,created_at")
      .single();

    if (error || !order) {
      throw new Error(error?.message ?? "Failed to create manual diet plan order.");
    }

    await recordAdminAuditLog({
      action: "diet_plan_manual_order_created",
      admin: auth.admin,
      evidence: parsed.evidence,
      metadata: {
        amount: parsed.amount,
        orderId: order.id,
        paymentLinkUrl: parsed.paymentLinkUrl,
        source: "admin_manual",
      },
      reason: parsed.reason,
      targetEmail: parsed.email,
    });

    return NextResponse.json({ order, success: true });
  } catch (error) {
    return adminApiError(error);
  }
}
