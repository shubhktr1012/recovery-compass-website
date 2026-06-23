import { supabaseAdmin } from "@/lib/supabase-admin";
import { normalizeReferralCode } from "@/lib/referral-utils";

export type AdminReferralPartner = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  partnerType: "coach" | "mentor" | "nutritionist";
  code: string;
  status: "active" | "paused";
  discountPct: number;
  expiresAt: string | null;
  maxUses: number | null;
  notes: string | null;
  successfulReferrals: number;
  unpaidCommissionPaise: number;
  lastRedemptionAt: string | null;
};

export type AdminReferralRedemption = {
  id: string;
  partnerId: string;
  partnerName: string;
  code: string;
  customerEmail: string | null;
  originalAmountPaise: number;
  discountAmountPaise: number;
  finalAmountPaise: number;
  commissionAmountPaise: number;
  redemptionStatus: "active" | "cancelled" | "refunded";
  payoutStatus: "unpaid" | "paid";
  paidAt: string | null;
  payoutNote: string | null;
  createdAt: string;
};

export type AdminReferralDashboard = {
  partners: AdminReferralPartner[];
  redemptions: AdminReferralRedemption[];
};

function optionalText(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export function parseReferralPartnerInput(value: unknown) {
  const body = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const name = optionalText(body.name);
  const code = normalizeReferralCode(body.code || name);
  const partnerType = body.partnerType;

  if (!name || name.length < 2) throw new Error("Partner name is required.");
  if (code.length < 3) throw new Error("Referral code must contain at least 3 letters or numbers.");
  if (!['coach', 'mentor', 'nutritionist'].includes(String(partnerType))) {
    throw new Error("Choose a valid partner type.");
  }

  const maxUses = body.maxUses === null || body.maxUses === "" || body.maxUses === undefined
    ? null
    : Number(body.maxUses);
  if (maxUses !== null && (!Number.isInteger(maxUses) || maxUses <= 0)) {
    throw new Error("Maximum uses must be a positive whole number.");
  }

  return {
    name,
    code,
    partnerType: partnerType as "coach" | "mentor" | "nutritionist",
    email: optionalText(body.email)?.toLowerCase() ?? null,
    phone: optionalText(body.phone),
    notes: optionalText(body.notes),
    expiresAt: optionalText(body.expiresAt),
    maxUses,
  };
}

export async function getAdminReferralDashboard(): Promise<AdminReferralDashboard> {
  const [{ data: partners, error: partnerError }, { data: redemptions, error: redemptionError }] =
    await Promise.all([
      supabaseAdmin.from("partner_referrals").select("*").order("created_at", { ascending: false }),
      supabaseAdmin.from("referral_redemptions").select("*").order("created_at", { ascending: false }),
    ]);

  if (partnerError) throw new Error(`Failed to load referral partners: ${partnerError.message}`);
  if (redemptionError) throw new Error(`Failed to load referral payouts: ${redemptionError.message}`);

  const userIds = Array.from(new Set((redemptions ?? []).map((row) => row.user_id)));
  const profileById = new Map<string, string | null>();
  if (userIds.length > 0) {
    const { data: profiles, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("id,email")
      .in("id", userIds);
    if (profileError) throw new Error(`Failed to load referral customers: ${profileError.message}`);
    profiles?.forEach((profile) => profileById.set(profile.id, profile.email));
  }

  const normalizedRedemptions: AdminReferralRedemption[] = (redemptions ?? []).map((row) => ({
    id: row.id,
    partnerId: row.partner_referral_id,
    partnerName: row.partner_name_snapshot,
    code: row.referral_code_snapshot,
    customerEmail: profileById.get(row.user_id) ?? null,
    originalAmountPaise: row.original_amount_paise,
    discountAmountPaise: row.discount_amount_paise,
    finalAmountPaise: row.final_amount_paise,
    commissionAmountPaise: row.commission_amount_paise,
    redemptionStatus: row.redemption_status,
    payoutStatus: row.payout_status,
    paidAt: row.paid_at,
    payoutNote: row.payout_note,
    createdAt: row.created_at,
  }));

  return {
    redemptions: normalizedRedemptions,
    partners: (partners ?? []).map((partner) => {
      const rows = normalizedRedemptions.filter((row) => row.partnerId === partner.id);
      const activeRows = rows.filter((row) => row.redemptionStatus === "active");
      return {
        id: partner.id,
        name: partner.name,
        email: partner.email,
        phone: partner.phone,
        partnerType: partner.partner_type,
        code: partner.referral_code,
        status: partner.status,
        discountPct: Number(partner.discount_pct),
        expiresAt: partner.expires_at,
        maxUses: partner.max_uses,
        notes: partner.notes,
        successfulReferrals: activeRows.length,
        unpaidCommissionPaise: activeRows
          .filter((row) => row.payoutStatus === "unpaid")
          .reduce((sum, row) => sum + row.commissionAmountPaise, 0),
        lastRedemptionAt: rows[0]?.createdAt ?? null,
      };
    }),
  };
}
