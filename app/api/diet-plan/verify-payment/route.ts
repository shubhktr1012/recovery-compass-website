import { NextRequest, NextResponse, after } from "next/server";
import crypto from "crypto";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const DIET_PLAN_PRICE_PAISE = 59900;

function getErrorMessage(error: unknown) {
    if (error instanceof Error) {
        return error.message;
    }

    return "Something went wrong";
}

function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getBaseUrl(req: NextRequest) {
    return (
        process.env.NEXT_PUBLIC_SITE_URL ||
        new URL(req.url).origin
    ).replace(/\/$/, "");
}

export async function POST(req: NextRequest) {
    try {
        if (!process.env.RAZORPAY_KEY_SECRET) {
            return NextResponse.json(
                { message: "Razorpay is not configured" },
                { status: 500 }
            );
        }

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            email,
            name,
            questionnaire_data,
        } = await req.json();

        const normalizedEmail = String(email ?? "").trim().toLowerCase();

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return NextResponse.json(
                { message: "Payment verification details are required" },
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

        const sign = `${razorpay_order_id}|${razorpay_payment_id}`;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign)
            .digest("hex");

        if (razorpay_signature !== expectedSign) {
            return NextResponse.json(
                { message: "Invalid payment signature" },
                { status: 400 }
            );
        }

        const supabase = getSupabaseAdmin();

        const { data: existing, error: existingError } = await supabase
            .from("diet_plan_orders")
            .select("id, status")
            .eq("razorpay_order_id", razorpay_order_id)
            .maybeSingle();

        if (existingError) {
            throw new Error(`Failed to check existing diet plan order: ${existingError.message}`);
        }

        if (existing) {
            return NextResponse.json({
                message: "Payment already processed",
                orderId: existing.id,
                status: existing.status,
                alreadyProcessed: true,
            });
        }

        const { data: order, error: insertError } = await supabase
            .from("diet_plan_orders")
            .insert({
                email: normalizedEmail,
                name: typeof name === "string" && name.trim() ? name.trim() : null,
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
                amount: DIET_PLAN_PRICE_PAISE,
                currency: "INR",
                questionnaire_data,
                status: "pending",
            })
            .select("id")
            .single();

        if (insertError || !order) {
            throw new Error(insertError?.message ?? "Failed to record diet plan order");
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
            message: "Payment verified. Your personalised diet plan will be emailed within 30 minutes.",
            orderId: order.id,
        });
    } catch (error: unknown) {
        console.error("[DietPlan] Verify payment error:", error);
        return NextResponse.json(
            { message: getErrorMessage(error) },
            { status: 500 }
        );
    }
}
