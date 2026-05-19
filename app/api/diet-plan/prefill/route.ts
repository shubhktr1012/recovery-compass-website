import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const DB_PROGRAM_TO_DIET_FORM_VALUE: Record<string, string> = {
    six_day_reset: "6-Day Control",
    ninety_day_transform: "90-Day Master",
    sleep_disorder_reset: "Sleep Reset",
    energy_vitality: "Energy Vitality",
    age_reversal: "Female Age Reversal",
    male_sexual_health: "Men's Vitality",
};

function getErrorMessage(error: unknown) {
    if (error instanceof Error) {
        return error.message;
    }
    return "Something went wrong";
}

function isValidUuid(value: string) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function hashClaimToken(token: string) {
    return crypto.createHash("sha256").update(token).digest("hex");
}

function mapProgramSlugToDietFormValue(slug: unknown) {
    if (typeof slug !== "string") {
        return null;
    }

    return DB_PROGRAM_TO_DIET_FORM_VALUE[slug] ?? null;
}

function extractTransactionProgramValues(items: unknown) {
    if (!Array.isArray(items)) {
        return [];
    }

    return items
        .map((item) => {
            if (!item || typeof item !== "object") {
                return null;
            }
            return mapProgramSlugToDietFormValue((item as { program_slug?: unknown }).program_slug);
        })
        .filter((value): value is string => Boolean(value));
}

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const dietOrderId = searchParams.get("diet_order_id")?.trim() ?? "";
        const claimToken = searchParams.get("token")?.trim() ?? "";

        if (!isValidUuid(dietOrderId) || claimToken.length < 32) {
            return NextResponse.json(
                { message: "A valid paid diet plan claim link is required." },
                { status: 400 }
            );
        }

        const supabase = getSupabaseAdmin();
        const claimTokenHash = hashClaimToken(claimToken);

        const { data: order, error: orderError } = await supabase
            .from("diet_plan_orders")
            .select("id, email, name, source, source_transaction_id, questionnaire_data")
            .eq("id", dietOrderId)
            .eq("claim_token_hash", claimTokenHash)
            .maybeSingle();

        if (orderError) {
            throw new Error(`Failed to load diet plan order: ${orderError.message}`);
        }

        if (!order || order.source !== "checkout_addon" || !order.source_transaction_id) {
            return NextResponse.json(
                { message: "No matching paid diet plan order found for this claim link." },
                { status: 404 }
            );
        }

        const { data: transaction, error: transactionError } = await supabase
            .from("transactions")
            .select("id, user_id, items")
            .eq("id", order.source_transaction_id)
            .maybeSingle();

        if (transactionError) {
            throw new Error(`Failed to load source transaction: ${transactionError.message}`);
        }

        if (!transaction?.user_id) {
            return NextResponse.json(
                { message: "Source transaction not found for this diet plan order." },
                { status: 404 }
            );
        }

        const [{ data: profile, error: profileError }, { data: accessRows, error: accessError }] =
            await Promise.all([
                supabase
                    .from("profiles")
                    .select("display_name, email")
                    .eq("id", transaction.user_id)
                    .maybeSingle(),
                supabase
                    .from("program_access")
                    .select("owned_program, purchase_state")
                    .eq("user_id", transaction.user_id)
                    .in("purchase_state", ["owned_active", "owned_completed", "owned_archived"]),
            ]);

        if (profileError) {
            throw new Error(`Failed to load profile: ${profileError.message}`);
        }

        if (accessError) {
            throw new Error(`Failed to load owned programs: ${accessError.message}`);
        }

        const ownedProgramValues = (accessRows ?? [])
            .map((row) => mapProgramSlugToDietFormValue(row.owned_program))
            .filter((value): value is string => Boolean(value));
        const transactionProgramValues = extractTransactionProgramValues(transaction.items);
        const programs = Array.from(new Set([...ownedProgramValues, ...transactionProgramValues]));
        const profileName =
            typeof profile?.display_name === "string" && profile.display_name.trim()
                ? profile.display_name.trim()
                : null;
        const orderName = typeof order.name === "string" && order.name.trim() ? order.name.trim() : null;
        const profileEmail =
            typeof profile?.email === "string" && profile.email.trim()
                ? profile.email.trim().toLowerCase()
                : null;
        const orderEmail =
            typeof order.email === "string" && order.email.trim()
                ? order.email.trim().toLowerCase()
                : null;

        return NextResponse.json({
            name: orderName || profileName || "",
            email: orderEmail || profileEmail || "",
            programs,
            questionnaireData:
                order.questionnaire_data &&
                typeof order.questionnaire_data === "object" &&
                !Array.isArray(order.questionnaire_data)
                    ? order.questionnaire_data
                    : {},
        });
    } catch (error: unknown) {
        console.error("[DietPlan] Prefill error:", error);
        return NextResponse.json(
            { message: getErrorMessage(error) },
            { status: 500 }
        );
    }
}
