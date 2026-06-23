import { NextResponse, type NextRequest } from "next/server";
import { requireAdminApi, adminApiError } from "@/lib/admin/api";
import { canManageReferrals } from "@/lib/admin/auth";
import { recordAdminAuditLog } from "@/lib/admin/audit";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function PATCH(request: NextRequest) {
  const auth = await requireAdminApi(request);
  if ("response" in auth) return auth.response;
  if (!canManageReferrals(auth.admin)) {
    return NextResponse.json({ message: "Only owner and ops admins can record payouts." }, { status: 403 });
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const partnerId = typeof body.partnerId === "string" ? body.partnerId : "";
    const payoutNote = typeof body.payoutNote === "string" ? body.payoutNote.trim() : "";
    if (!partnerId || payoutNote.length < 3) {
      return NextResponse.json({ message: "Partner and payout reference are required." }, { status: 400 });
    }

    const { data: rows, error } = await supabaseAdmin
      .from("referral_redemptions")
      .update({
        payout_status: "paid",
        paid_at: new Date().toISOString(),
        paid_by: auth.admin.email,
        payout_note: payoutNote,
      })
      .eq("partner_referral_id", partnerId)
      .eq("redemption_status", "active")
      .eq("payout_status", "unpaid")
      .select("id,commission_amount_paise");

    if (error) throw new Error(error.message);
    if (!rows || rows.length === 0) {
      return NextResponse.json({ message: "No unpaid commissions were found for this partner." }, { status: 409 });
    }

    await recordAdminAuditLog({
      action: "referral_commissions_paid",
      admin: auth.admin,
      evidence: payoutNote,
      metadata: {
        partnerId,
        redemptionIds: rows.map((row) => row.id),
        totalPaidPaise: rows.reduce((sum, row) => sum + row.commission_amount_paise, 0),
      },
      reason: "Partner commission payout recorded",
    });

    return NextResponse.json({ paidCount: rows.length, success: true });
  } catch (error) {
    return adminApiError(error);
  }
}
