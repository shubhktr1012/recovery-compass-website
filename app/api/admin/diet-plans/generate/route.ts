import { after, NextResponse, type NextRequest } from "next/server";
import { requireAdminApi, adminApiError } from "@/lib/admin/api";
import { canManageDietPlans } from "@/lib/admin/auth";
import {
  getAdminRouteBaseUrl,
  parseDietPlanGenerationPayload,
  triggerDietPlanGeneration,
} from "@/lib/admin/diet-plan-actions";
import { recordAdminAuditLog } from "@/lib/admin/audit";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { isDietPlanGenerationStale } from "@/lib/diet-plan-generation-state";

type DietPlanOrder = {
  email: string | null;
  id: string;
  manual_payment_confirmed_at: string | null;
  claimed_at: string | null;
  source: string | null;
  status: string | null;
  updated_at: string | null;
};

export const dynamic = "force-dynamic";
export const maxDuration = 300;

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
      { message: "Only owner and ops admins can trigger diet plan generation." },
      { status: 403 }
    );
  }

  if (!process.env.DIET_PLAN_INTERNAL_SECRET) {
    return NextResponse.json(
      { message: "DIET_PLAN_INTERNAL_SECRET is not configured." },
      { status: 500 }
    );
  }

  let parsed: ReturnType<typeof parseDietPlanGenerationPayload>;
  try {
    parsed = parseDietPlanGenerationPayload(await request.json());
  } catch (error) {
    return NextResponse.json({ message: getErrorMessage(error) }, { status: 400 });
  }

  try {
    const { data: order, error } = await supabaseAdmin
      .from("diet_plan_orders")
      .select("id,email,status,source,manual_payment_confirmed_at,claimed_at,updated_at")
      .eq("id", parsed.orderId)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (!order) {
      return NextResponse.json({ message: "Diet plan order not found." }, { status: 404 });
    }

    const dietOrder = order as DietPlanOrder;
    const isStaleGeneration = isDietPlanGenerationStale({
      claimedAt: dietOrder.claimed_at,
      status: dietOrder.status,
      updatedAt: dietOrder.updated_at,
    });

    if (!["pending", "failed"].includes(dietOrder.status ?? "") && !isStaleGeneration) {
      return NextResponse.json(
        { message: `Order is not ready for generation. Current status: ${dietOrder.status ?? "unknown"}.` },
        { status: 409 }
      );
    }

    if (dietOrder.source === "admin_manual" && !dietOrder.manual_payment_confirmed_at) {
      return NextResponse.json(
        { message: "Manual diet plan payment must be confirmed before generation." },
        { status: 409 }
      );
    }

    await recordAdminAuditLog({
      action: "diet_plan_generation_triggered",
      admin: auth.admin,
      evidence: parsed.evidence,
      metadata: {
        orderId: parsed.orderId,
        source: dietOrder.source,
        status: dietOrder.status,
        recoveredStaleAttempt: isStaleGeneration,
      },
      reason: parsed.reason,
      targetEmail: dietOrder.email,
    });

    const baseUrl = getAdminRouteBaseUrl(request);
    after(async () => {
      try {
        await triggerDietPlanGeneration({ baseUrl, orderId: parsed.orderId });
      } catch (triggerError) {
        console.error("[admin] Failed to trigger diet plan generation", {
          error: triggerError instanceof Error ? triggerError.message : "Unknown error",
          orderId: parsed.orderId,
        });
      }
    });

    return NextResponse.json({ generationQueued: true, success: true });
  } catch (error) {
    return adminApiError(error);
  }
}
