import { NextResponse } from "next/server";
import crypto from "crypto";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const RECOVERABLE_STATUSES = ["awaiting_questionnaire", "failed"];

function getErrorMessage(error: unknown) {
    if (error instanceof Error) {
        return error.message;
    }

    return "Something went wrong";
}

function createClaimToken() {
    return crypto.randomBytes(32).toString("base64url");
}

function hashClaimToken(token: string) {
    return crypto.createHash("sha256").update(token).digest("hex");
}

function buildDietPlanHref(orderId: string, claimToken: string) {
    const params = new URLSearchParams({
        cart_checkout: "true",
        diet_order_id: orderId,
        token: claimToken,
    });

    return `/diet-plan?${params.toString()}`;
}

export async function GET() {
    try {
        const authClient = await createSupabaseServerClient();
        const {
            data: { user },
            error: userError,
        } = await authClient.auth.getUser();

        if (userError || !user) {
            return NextResponse.json({ pending: false }, { status: 401 });
        }

        const supabase = getSupabaseAdmin();

        const { data: transactions, error: transactionsError } = await supabase
            .from("transactions")
            .select("id")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(50);

        if (transactionsError) {
            throw new Error(`Failed to load user transactions: ${transactionsError.message}`);
        }

        const transactionIds = (transactions ?? [])
            .map((transaction) => transaction.id)
            .filter((id): id is string => typeof id === "string" && id.length > 0);

        if (transactionIds.length === 0) {
            return NextResponse.json({ pending: false });
        }

        const { data: order, error: orderError } = await supabase
            .from("diet_plan_orders")
            .select("id, status")
            .eq("source", "checkout_addon")
            .in("status", RECOVERABLE_STATUSES)
            .in("source_transaction_id", transactionIds)
            .order("updated_at", { ascending: false })
            .limit(1)
            .maybeSingle();

        if (orderError) {
            throw new Error(`Failed to load pending diet plan order: ${orderError.message}`);
        }

        if (!order?.id) {
            return NextResponse.json({ pending: false });
        }

        const claimToken = createClaimToken();
        const { error: updateError } = await supabase
            .from("diet_plan_orders")
            .update({ claim_token_hash: hashClaimToken(claimToken) })
            .eq("id", order.id);

        if (updateError) {
            throw new Error(`Failed to refresh diet plan claim link: ${updateError.message}`);
        }

        return NextResponse.json({
            pending: true,
            href: buildDietPlanHref(order.id, claimToken),
            orderId: order.id,
            status: order.status,
        });
    } catch (error: unknown) {
        console.error("[DietPlan] Pending claim recovery error:", error);
        return NextResponse.json(
            { message: getErrorMessage(error) },
            { status: 500 }
        );
    }
}
