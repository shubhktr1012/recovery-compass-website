import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import {
    consumeDetoxRateLimit,
    createDetoxLead,
    deliverDetoxProgram,
    getDetoxQuestionnaireData,
    normalizeDetoxContactString,
    normalizeDetoxPhoneInput,
} from "@/lib/detox-delivery";

export async function POST(request: Request) {
    try {
        const authClient = await createSupabaseServerClient();
        const {
            data: { user },
            error: userError,
        } = await authClient.auth.getUser();

        if (userError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const phone = normalizeDetoxPhoneInput(body?.phone, body?.countryCode);
        const primaryFocus = normalizeDetoxContactString(body?.primaryFocus);
        const questionnaireData = getDetoxQuestionnaireData(body?.questionnaireData);

        if (!phone || !primaryFocus) {
            return NextResponse.json(
                { error: "WhatsApp number and wellness focus are required." },
                { status: 400 }
            );
        }

        const email = user.email;
        if (!email) {
            return NextResponse.json(
                { error: "No email address found on user profile." },
                { status: 400 }
            );
        }

        const rateAllowed = await consumeDetoxRateLimit(`${user.id}:${phone}`);
        if (!rateAllowed) {
            return NextResponse.json(
                { error: "Too many requests. Please try again later." },
                { status: 429 }
            );
        }

        const supabase = getSupabaseAdmin();
        const { data: profile } = await supabase
            .from("profiles")
            .select("full_name, display_name")
            .eq("id", user.id)
            .single();

        const name =
            profile?.full_name ||
            profile?.display_name ||
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            "Seeker";

        const leadId = await createDetoxLead({
            name,
            email,
            phone,
            source: "checkout_success",
            emailConsent: true,
            whatsappConsent: true,
        });

        const result = await deliverDetoxProgram({
            lead: {
                id: leadId,
                name,
                email,
                phone,
                primary_focus: primaryFocus,
                source: "checkout_success",
                email_consent: true,
                whatsapp_consent: true,
            },
            primaryFocus,
            questionnaireData,
        });

        return NextResponse.json({ success: true, leadId, ...result }, { status: 200 });
    } catch (error) {
        console.error("[Detox Claim Bonus] Request failed:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Internal server error" },
            { status: 500 }
        );
    }
}
