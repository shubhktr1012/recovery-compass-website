import { supabaseAdmin } from "@/lib/supabase-admin";
export { calculateReferralDiscount, normalizeReferralCode } from "@/lib/referral-utils";
import { normalizeReferralCode } from "@/lib/referral-utils";

export type ReferralValidation =
  | {
      valid: true;
      partnerId: string;
      partnerName: string;
      code: string;
      discountPct: number;
      commissionPct: number;
    }
  | { valid: false; code: string; reason: string };

type ReferralSnapshot = {
  partnerId: string;
  partnerName: string;
  code: string;
  discountPct: number;
  commissionPct: number;
  originalAmountPaise: number;
  discountAmountPaise: number;
  finalAmountPaise: number;
};

export async function validateReferralForCheckout({
  code: rawCode,
  userEmail,
  userId,
}: {
  code: unknown;
  userEmail?: string | null;
  userId: string;
}): Promise<ReferralValidation> {
  const code = normalizeReferralCode(rawCode);
  if (code.length < 3) {
    return { valid: false, code, reason: "Enter a valid referral code." };
  }

  const { data: partner, error: partnerError } = await supabaseAdmin
    .from("partner_referrals")
    .select("id,name,email,referral_code,status,discount_pct,commission_pct,expires_at,max_uses")
    .eq("referral_code", code)
    .maybeSingle();

  if (partnerError) throw new Error(`Failed to validate referral code: ${partnerError.message}`);
  if (!partner || partner.status !== "active") {
    return { valid: false, code, reason: "This referral code is not active." };
  }
  if (partner.expires_at && new Date(partner.expires_at).getTime() <= Date.now()) {
    return { valid: false, code, reason: "This referral code has expired." };
  }
  if (partner.email && userEmail && partner.email.trim().toLowerCase() === userEmail.trim().toLowerCase()) {
    return { valid: false, code, reason: "A partner cannot use their own referral code." };
  }

  const [{ count: ownedCount, error: ownedError }, { count: redemptionCount, error: redemptionError }] =
    await Promise.all([
      supabaseAdmin
        .from("program_access")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .neq("purchase_state", "not_owned"),
      supabaseAdmin
        .from("referral_redemptions")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId),
    ]);

  if (ownedError) throw new Error(`Failed to check program ownership: ${ownedError.message}`);
  if (redemptionError) throw new Error(`Failed to check referral history: ${redemptionError.message}`);
  if ((ownedCount ?? 0) > 0 || (redemptionCount ?? 0) > 0) {
    return { valid: false, code, reason: "Referral discounts are available on your first program purchase." };
  }

  if (partner.max_uses) {
    const { count: useCount, error: useError } = await supabaseAdmin
      .from("referral_redemptions")
      .select("id", { count: "exact", head: true })
      .eq("partner_referral_id", partner.id)
      .eq("redemption_status", "active");

    if (useError) throw new Error(`Failed to check referral usage: ${useError.message}`);
    if ((useCount ?? 0) >= partner.max_uses) {
      return { valid: false, code, reason: "This referral code has reached its usage limit." };
    }
  }

  return {
    valid: true,
    partnerId: partner.id,
    partnerName: partner.name,
    code,
    discountPct: Number(partner.discount_pct),
    commissionPct: Number(partner.commission_pct),
  };
}

export function readReferralSnapshot(metadata: unknown): ReferralSnapshot | null {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) return null;
  const referral = (metadata as Record<string, unknown>).referral;
  if (!referral || typeof referral !== "object" || Array.isArray(referral)) return null;

  const value = referral as Record<string, unknown>;
  if (
    typeof value.partnerId !== "string" ||
    typeof value.partnerName !== "string" ||
    typeof value.code !== "string" ||
    typeof value.originalAmountPaise !== "number" ||
    typeof value.discountAmountPaise !== "number" ||
    typeof value.finalAmountPaise !== "number" ||
    typeof value.discountPct !== "number" ||
    typeof value.commissionPct !== "number"
  ) {
    return null;
  }

  return value as ReferralSnapshot;
}

export async function recordReferralRedemption({
  metadata,
  transactionId,
  userId,
}: {
  metadata: unknown;
  transactionId: string;
  userId: string;
}) {
  const referral = readReferralSnapshot(metadata);
  if (!referral) return;

  const { error } = await supabaseAdmin.from("referral_redemptions").upsert(
    {
      partner_referral_id: referral.partnerId,
      transaction_id: transactionId,
      user_id: userId,
      referral_code_snapshot: referral.code,
      partner_name_snapshot: referral.partnerName,
      original_amount_paise: referral.originalAmountPaise,
      discount_amount_paise: referral.discountAmountPaise,
      final_amount_paise: referral.finalAmountPaise,
      commission_amount_paise: referral.discountAmountPaise,
    },
    { onConflict: "transaction_id", ignoreDuplicates: true }
  );

  if (error) throw new Error(`Failed to record referral commission: ${error.message}`);
}

export async function markReferralRedemptionRefunded(transactionId: string) {
  const { error } = await supabaseAdmin
    .from("referral_redemptions")
    .update({ redemption_status: "refunded" })
    .eq("transaction_id", transactionId)
    .neq("redemption_status", "refunded");

  if (error) throw new Error(`Failed to update referral refund: ${error.message}`);
}
