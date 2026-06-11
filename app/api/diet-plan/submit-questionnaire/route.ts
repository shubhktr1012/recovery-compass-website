import { NextRequest, NextResponse, after } from "next/server";
import crypto from "crypto";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { normalizeQuestionnaireProgramValues } from "@/lib/diet-plan-program-options";

function getErrorMessage(error: unknown) {
    if (error instanceof Error) {
        return error.message;
    }
    return "Something went wrong";
}

function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidUuid(value: string) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function hashClaimToken(token: string) {
    return crypto.createHash("sha256").update(token).digest("hex");
}

function getBaseUrl(req: NextRequest) {
    return (
        process.env.NEXT_PUBLIC_SITE_URL ||
        new URL(req.url).origin
    ).replace(/\/$/, "");
}

export async function POST(req: NextRequest) {
    try {
        const {
            diet_order_id,
            claim_token,
            email,
            name,
            questionnaire_data,
        } = await req.json();

        const dietOrderId = String(diet_order_id ?? "").trim();
        const claimToken = String(claim_token ?? "").trim();
        const normalizedEmail = String(email ?? "").trim().toLowerCase();

        if (!isValidUuid(dietOrderId) || claimToken.length < 32) {
            return NextResponse.json(
                { message: "A valid paid diet plan claim link is required." },
                { status: 400 }
            );
        }

        if (!isValidEmail(normalizedEmail)) {
            return NextResponse.json(
                { message: "A valid email address is required to deliver your plan." },
                { status: 400 }
            );
        }

        if (
            !questionnaire_data ||
            typeof questionnaire_data !== "object" ||
            Array.isArray(questionnaire_data)
        ) {
            return NextResponse.json(
                { message: "Questionnaire data is required." },
                { status: 400 }
            );
        }

        const normalizedQuestionnaireData = normalizeQuestionnaireProgramValues(
            questionnaire_data as Record<string, unknown>
        );

        const supabase = getSupabaseAdmin();
        const claimTokenHash = hashClaimToken(claimToken);

        const { data: order, error: fetchError } = await supabase
            .from("diet_plan_orders")
            .select("id, status, source")
            .eq("id", dietOrderId)
            .eq("claim_token_hash", claimTokenHash)
            .maybeSingle();

        if (fetchError) {
            throw new Error(`Failed to check diet plan order: ${fetchError.message}`);
        }

        if (!order || order.source !== "checkout_addon") {
            return NextResponse.json(
                { message: "No matching paid diet plan order found for this claim link." },
                { status: 404 }
            );
        }

        if (["pending", "generating", "fulfilled"].includes(order.status)) {
            return NextResponse.json({
                message: "Profile already submitted. Your personalised diet plan will be emailed shortly.",
                orderId: order.id,
                alreadySubmitted: true,
            });
        }

        // Update the order with the questionnaire data
        const { error: updateError } = await supabase
            .from("diet_plan_orders")
            .update({
                email: normalizedEmail,
                name: typeof name === "string" && name.trim() ? name.trim() : null,
                questionnaire_data: normalizedQuestionnaireData,
                status: "pending",
                claimed_at: new Date().toISOString(),
                error_message: null,
            })
            .eq("id", order.id)
            .in("status", ["awaiting_questionnaire", "failed"]);

        if (updateError) {
            throw new Error(`Failed to update diet plan order: ${updateError.message}`);
        }

        const baseUrl = getBaseUrl(req);

        after(async () => {
            try {
                if (!process.env.DIET_PLAN_INTERNAL_SECRET) {
                    await supabase
                        .from("diet_plan_orders")
                        .update({
                            status: "failed",
                            error_message: "DIET_PLAN_INTERNAL_SECRET is not configured",
                        })
                        .eq("id", order.id);
                    return;
                }

                const response = await fetch(`${baseUrl}/api/diet-plan/generate`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-internal-secret": process.env.DIET_PLAN_INTERNAL_SECRET,
                    },
                    body: JSON.stringify({ orderId: order.id }),
                });

                if (!response.ok) {
                    const body = await response.text().catch(() => "(unreadable)");
                    console.error(`[DietPlan] Generation trigger failed (${response.status}): ${body}`);
                }
            } catch (error) {
                console.error("[DietPlan] Failed to trigger generation:", error);
            }
        });

        return NextResponse.json({
            message: "Profile submitted successfully. Your personalised diet plan will be emailed within 30-45 minutes.",
            orderId: order.id,
        });
    } catch (error: unknown) {
        console.error("[DietPlan] Submit questionnaire error:", error);
        return NextResponse.json(
            { message: getErrorMessage(error) },
            { status: 500 }
        );
    }
}
