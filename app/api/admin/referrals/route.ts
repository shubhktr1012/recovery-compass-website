import { NextResponse, type NextRequest } from "next/server";
import { requireAdminApi, adminApiError } from "@/lib/admin/api";
import { canManageReferrals } from "@/lib/admin/auth";
import { recordAdminAuditLog } from "@/lib/admin/audit";
import { getAdminReferralDashboard, parseReferralPartnerInput } from "@/lib/admin/referrals";
import { normalizeReferralCode } from "@/lib/referral-utils";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = await requireAdminApi(request);
  if ("response" in auth) return auth.response;

  try {
    return NextResponse.json(await getAdminReferralDashboard());
  } catch (error) {
    return adminApiError(error);
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminApi(request);
  if ("response" in auth) return auth.response;
  if (!canManageReferrals(auth.admin)) {
    return NextResponse.json({ message: "Only owner and ops admins can create partners." }, { status: 403 });
  }

  try {
    const parsed = parseReferralPartnerInput(await request.json());
    const { data: partner, error } = await supabaseAdmin
      .from("partner_referrals")
      .insert({
        name: parsed.name,
        email: parsed.email,
        phone: parsed.phone,
        partner_type: parsed.partnerType,
        referral_code: parsed.code,
        expires_at: parsed.expiresAt,
        max_uses: parsed.maxUses,
        notes: parsed.notes,
        created_by: auth.admin.email,
      })
      .select("id,name,referral_code")
      .single();

    if (error || !partner) {
      const status = error?.code === "23505" ? 409 : 500;
      return NextResponse.json(
        { message: status === 409 ? "That email or referral code is already in use." : error?.message },
        { status }
      );
    }

    await recordAdminAuditLog({
      action: "referral_partner_created",
      admin: auth.admin,
      metadata: { partnerId: partner.id, referralCode: partner.referral_code },
      reason: "Partner referral account created",
      targetEmail: parsed.email,
    });

    return NextResponse.json({ partner, success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid partner details.";
    return NextResponse.json({ message }, { status: 400 });
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await requireAdminApi(request);
  if ("response" in auth) return auth.response;
  if (!canManageReferrals(auth.admin)) {
    return NextResponse.json({ message: "Only owner and ops admins can update partners." }, { status: 403 });
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const partnerId = typeof body.partnerId === "string" ? body.partnerId : "";
    const status = body.status === "active" || body.status === "paused" ? body.status : null;
    const code = body.code === undefined ? undefined : normalizeReferralCode(body.code);
    const name = typeof body.name === "string" ? body.name.trim() : undefined;
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() || null : undefined;
    const phone = typeof body.phone === "string" ? body.phone.trim() || null : undefined;
    const notes = typeof body.notes === "string" ? body.notes.trim() || null : undefined;
    const expiresAt = typeof body.expiresAt === "string" ? body.expiresAt.trim() || null : undefined;
    const maxUses = body.maxUses === "" || body.maxUses === null
      ? null
      : body.maxUses === undefined
        ? undefined
        : Number(body.maxUses);
    const partnerType = ['coach', 'mentor', 'nutritionist'].includes(String(body.partnerType))
      ? body.partnerType
      : undefined;
    if (!partnerId || (!status && code === undefined && name === undefined && email === undefined && phone === undefined && notes === undefined && expiresAt === undefined && maxUses === undefined && partnerType === undefined)) {
      return NextResponse.json({ message: "Partner and update are required." }, { status: 400 });
    }
    if (code !== undefined && code.length < 3) {
      return NextResponse.json({ message: "Referral code must contain at least 3 letters or numbers." }, { status: 400 });
    }
    if (name !== undefined && name.length < 2) {
      return NextResponse.json({ message: "Partner name is required." }, { status: 400 });
    }
    if (maxUses !== undefined && maxUses !== null && (!Number.isInteger(maxUses) || maxUses <= 0)) {
      return NextResponse.json({ message: "Maximum uses must be a positive whole number." }, { status: 400 });
    }

    const updates: Record<string, unknown> = {};
    if (status) updates.status = status;
    if (code !== undefined) updates.referral_code = code;
    if (name !== undefined) updates.name = name;
    if (email !== undefined) updates.email = email;
    if (phone !== undefined) updates.phone = phone;
    if (notes !== undefined) updates.notes = notes;
    if (expiresAt !== undefined) updates.expires_at = expiresAt;
    if (maxUses !== undefined) updates.max_uses = maxUses;
    if (partnerType !== undefined) updates.partner_type = partnerType;

    const { data: partner, error } = await supabaseAdmin
      .from("partner_referrals")
      .update(updates)
      .eq("id", partnerId)
      .select("id,name,email,referral_code,status")
      .single();
    if (error || !partner) throw new Error(error?.message ?? "Partner not found.");

    await recordAdminAuditLog({
      action: "referral_partner_updated",
      admin: auth.admin,
      metadata: { partnerId, referralCode: partner.referral_code, status: partner.status },
      reason: "Partner referral account updated",
      targetEmail: partner.email,
    });

    return NextResponse.json({ partner, success: true });
  } catch (error) {
    return adminApiError(error);
  }
}
