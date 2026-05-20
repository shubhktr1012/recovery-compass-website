import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const DRAFTABLE_STATUSES = ["awaiting_questionnaire", "failed"];

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

export async function PUT(req: NextRequest) {
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

        if (
            !questionnaire_data ||
            typeof questionnaire_data !== "object" ||
            Array.isArray(questionnaire_data)
        ) {
            return NextResponse.json(
                { message: "Questionnaire draft data is required." },
                { status: 400 }
            );
        }

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

        if (!DRAFTABLE_STATUSES.includes(order.status)) {
            return NextResponse.json({
                message: "This diet plan is already submitted.",
                saved: false,
                status: order.status,
            });
        }

        const updates: Record<string, unknown> = {
            questionnaire_data,
        };

        if (isValidEmail(normalizedEmail)) {
            updates.email = normalizedEmail;
        }

        if (typeof name === "string" && name.trim()) {
            updates.name = name.trim();
        }

        const { error: updateError } = await supabase
            .from("diet_plan_orders")
            .update(updates)
            .eq("id", order.id)
            .in("status", DRAFTABLE_STATUSES);

        if (updateError) {
            throw new Error(`Failed to save diet plan draft: ${updateError.message}`);
        }

        return NextResponse.json({
            message: "Draft saved.",
            saved: true,
            status: order.status,
        });
    } catch (error: unknown) {
        console.error("[DietPlan] Draft save error:", error);
        return NextResponse.json(
            { message: getErrorMessage(error) },
            { status: 500 }
        );
    }
}
