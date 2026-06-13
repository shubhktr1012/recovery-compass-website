import { after, NextResponse, type NextRequest } from "next/server";
import { requireAdminApi, adminApiError } from "@/lib/admin/api";
import { canManageDietPlans } from "@/lib/admin/auth";
import {
  getAdminRouteBaseUrl,
  parseManualDietPlanPaymentPayload,
  triggerDietPlanGeneration,
} from "@/lib/admin/diet-plan-actions";
import { recordAdminAuditLog } from "@/lib/admin/audit";
import { supabaseAdmin } from "@/lib/supabase-admin";

type ManualDietPlanOrder = {
  email: string | null;
  id: string;
  manual_payment_confirmed_at: string | null;
  source: string | null;
  status: string | null;
};

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
      { message: "Only owner and ops admins can confirm diet plan payments." },
      { status: 403 }
    );
  }

  let parsed: ReturnType<typeof parseManualDietPlanPaymentPayload>;
  try {
    parsed = parseManualDietPlanPaymentPayload(await request.json());
  } catch (error) {
    return NextResponse.json({ message: getErrorMessage(error) }, { status: 400 });
  }

  try {
    if (parsed.triggerGeneration && !process.env.DIET_PLAN_INTERNAL_SECRET) {
      return NextResponse.json(
        { message: "DIET_PLAN_INTERNAL_SECRET is not configured." },
        { status: 500 }
      );
    }

    const { data: order, error: fetchError } = await supabaseAdmin
      .from("diet_plan_orders")
      .select("id,email,status,source,manual_payment_confirmed_at")
      .eq("id", parsed.orderId)
      .maybeSingle();

    if (fetchError) {
      throw new Error(fetchError.message);
    }

    if (!order) {
      return NextResponse.json({ message: "Diet plan order not found." }, { status: 404 });
    }

    const manualOrder = order as ManualDietPlanOrder;
    if (manualOrder.source !== "admin_manual") {
      return NextResponse.json(
        { message: "Only admin-created manual diet plan orders can be confirmed here." },
        { status: 409 }
      );
    }

    if (!["awaiting_payment", "failed"].includes(manualOrder.status ?? "")) {
      return NextResponse.json(
        { message: `Order is not waiting for manual payment. Current status: ${manualOrder.status ?? "unknown"}.` },
        { status: 409 }
      );
    }

    const now = new Date().toISOString();
    const { data: updatedOrder, error: updateError } = await supabaseAdmin
      .from("diet_plan_orders")
      .update({
        error_message: null,
        manual_payment_confirmed_at: now,
        manual_payment_confirmed_by: auth.admin.email,
        manual_payment_reference: parsed.paymentReference,
        status: "pending",
      })
      .eq("id", parsed.orderId)
      .in("status", ["awaiting_payment", "failed"])
      .select("id,email,status,source,manual_payment_confirmed_at")
      .maybeSingle();

    if (updateError) {
      throw new Error(updateError.message);
    }

    if (!updatedOrder) {
      return NextResponse.json(
        { message: "Order was already updated by another request." },
        { status: 409 }
      );
    }

    await recordAdminAuditLog({
      action: "diet_plan_manual_payment_confirmed",
      admin: auth.admin,
      evidence: parsed.evidence,
      metadata: {
        orderId: parsed.orderId,
        paymentReference: parsed.paymentReference,
        triggerGeneration: parsed.triggerGeneration,
      },
      reason: parsed.reason,
      targetEmail: manualOrder.email,
    });

    if (parsed.triggerGeneration) {
      const baseUrl = getAdminRouteBaseUrl(request);
      after(async () => {
        try {
          await triggerDietPlanGeneration({ baseUrl, orderId: parsed.orderId });
        } catch (error) {
          console.error("[admin] Failed to trigger diet plan generation after payment confirmation", {
            error: error instanceof Error ? error.message : "Unknown error",
            orderId: parsed.orderId,
          });
        }
      });
    }

    return NextResponse.json({
      generationQueued: parsed.triggerGeneration,
      order: updatedOrder,
      success: true,
    });
  } catch (error) {
    return adminApiError(error);
  }
}
