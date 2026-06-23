import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { validateReferralForCheckout } from "@/lib/referrals";

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { code } = await request.json();
    const result = await validateReferralForCheckout({
      code,
      userEmail: user.email,
      userId: user.id,
    });

    if (!result.valid) {
      return NextResponse.json(
        { valid: false, code: result.code, message: result.reason },
        { status: 400 }
      );
    }

    return NextResponse.json({
      valid: true,
      code: result.code,
      partnerName: result.partnerName,
      discountPct: result.discountPct,
    });
  } catch (error) {
    console.error("Referral validation failed", error);
    return NextResponse.json(
      { message: "Unable to validate this referral code right now." },
      { status: 500 }
    );
  }
}
