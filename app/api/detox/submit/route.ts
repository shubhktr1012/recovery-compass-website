import { NextResponse } from "next/server";
import {
    completeDetoxLead,
    consumeDetoxRateLimit,
    createDetoxLead,
    deliverDetoxProgram,
    getDetoxQuestionnaireData,
    isValidDetoxEmail,
    normalizeDetoxContactString,
    normalizeDetoxEmail,
} from "@/lib/detox-delivery";

function validationError(message: string) {
    return NextResponse.json({ error: message }, { status: 400 });
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const action = normalizeDetoxContactString(body?.action || "single_step");
        const name = normalizeDetoxContactString(body?.name);
        const email = normalizeDetoxEmail(body?.email);
        const phone = normalizeDetoxContactString(body?.phone);
        const source = normalizeDetoxContactString(body?.source || "homepage_modal");
        const emailConsent = body?.emailConsent !== false;
        const whatsappConsent = body?.whatsappConsent !== false;
        const primaryFocus = normalizeDetoxContactString(body?.primaryFocus);
        const questionnaireData = getDetoxQuestionnaireData(body?.questionnaireData);

        if (action === "create_lead") {
            if (!name || !email || !phone) {
                return validationError("Name, email, and WhatsApp number are required.");
            }

            if (!isValidDetoxEmail(email)) {
                return validationError("Please enter a valid email address.");
            }

            const rateAllowed = await consumeDetoxRateLimit(`${email}:${phone}`);
            if (!rateAllowed) {
                return NextResponse.json(
                    { error: "Too many requests. Please try again later." },
                    { status: 429 }
                );
            }

            const leadId = await createDetoxLead({
                name,
                email,
                phone,
                source,
                emailConsent,
                whatsappConsent,
            });

            return NextResponse.json({ success: true, leadId }, { status: 200 });
        }

        if (action === "complete_questionnaire") {
            const leadId = normalizeDetoxContactString(body?.leadId);
            if (!leadId || !primaryFocus) {
                return validationError("Lead ID and wellness focus are required.");
            }

            const result = await completeDetoxLead({
                leadId,
                primaryFocus,
                questionnaireData,
            });

            return NextResponse.json({ success: true, ...result }, { status: 200 });
        }

        if (!name || !email || !phone || !primaryFocus) {
            return validationError("Name, email, WhatsApp number, and wellness focus are required.");
        }

        if (!isValidDetoxEmail(email)) {
            return validationError("Please enter a valid email address.");
        }

        const rateAllowed = await consumeDetoxRateLimit(`${email}:${phone}`);
        if (!rateAllowed) {
            return NextResponse.json(
                { error: "Too many requests. Please try again later." },
                { status: 429 }
            );
        }

        const leadId = await createDetoxLead({
            name,
            email,
            phone,
            source,
            emailConsent,
            whatsappConsent,
        });

        const result = await deliverDetoxProgram({
            lead: {
                id: leadId,
                name,
                email,
                phone,
                primary_focus: primaryFocus,
                source,
                email_consent: emailConsent,
                whatsapp_consent: whatsappConsent,
            },
            primaryFocus,
            questionnaireData,
        });

        return NextResponse.json({ success: true, leadId, ...result }, { status: 200 });
    } catch (error) {
        console.error("[Detox Submit] Request failed:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Internal server error" },
            { status: 500 }
        );
    }
}
