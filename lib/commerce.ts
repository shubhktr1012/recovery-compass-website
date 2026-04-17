import { createClient } from "@supabase/supabase-js";
import { sendWelcomeEmail } from "@/lib/mail";

// ─────────────────────────────────────────────────────────────────────────────
// Supabase Admin Client (server-only, service_role)
// ─────────────────────────────────────────────────────────────────────────────

export const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface TransactionItem {
    program_slug: string;
    title: string;
    price_inr: number;
    quantity: number;
}

export interface CreateTransactionParams {
    userId: string;
    providerOrderId: string;
    amount: number; // in paise
    currency: string;
    items: TransactionItem[];
}

export interface MarkPaidParams {
    providerOrderId: string;
    providerPaymentId: string;
    providerSignature: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Create Transaction (called when Razorpay order is created)
// ─────────────────────────────────────────────────────────────────────────────

export async function createTransaction(params: CreateTransactionParams) {
    const { data, error } = await supabaseAdmin
        .from("transactions")
        .insert({
            user_id: params.userId,
            provider: "razorpay",
            provider_order_id: params.providerOrderId,
            amount: params.amount,
            currency: params.currency,
            items: params.items,
            payment_status: "created",
            fulfillment_status: "pending",
        })
        .select()
        .single();

    if (error) throw new Error(`Failed to create transaction: ${error.message}`);
    return data;
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Mark Transaction as Paid (idempotent)
//    Called by both verify-payment (frontend) and webhook (backend).
//    If already marked paid, returns safely without double-processing.
// ─────────────────────────────────────────────────────────────────────────────

export async function markTransactionPaid(params: MarkPaidParams): Promise<{
    alreadyProcessed: boolean;
    transactionId: string | null;
}> {
    // Check if this payment was already processed (idempotency)
    const { data: existing } = await supabaseAdmin
        .from("transactions")
        .select("id, payment_status")
        .eq("provider_order_id", params.providerOrderId)
        .single();

    if (!existing) {
        throw new Error(`Transaction not found for order: ${params.providerOrderId}`);
    }

    // Already paid — safe no-op
    if (existing.payment_status === "paid") {
        return { alreadyProcessed: true, transactionId: existing.id };
    }

    // Mark as paid
    const { error } = await supabaseAdmin
        .from("transactions")
        .update({
            provider_payment_id: params.providerPaymentId,
            provider_signature: params.providerSignature,
            payment_status: "paid",
            // fulfillment_status stays "pending" intentionally
        })
        .eq("id", existing.id);

    if (error) throw new Error(`Failed to mark transaction paid: ${error.message}`);

    // Attempt fulfillment (stub for now)
    await attemptFulfillment(existing.id);

    return { alreadyProcessed: false, transactionId: existing.id };
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. Mark Transaction as Failed
// ─────────────────────────────────────────────────────────────────────────────

export async function markTransactionFailed(providerOrderId: string, metadata?: Record<string, unknown>) {
    const { error } = await supabaseAdmin
        .from("transactions")
        .update({
            payment_status: "failed",
            metadata,
        })
        .eq("provider_order_id", providerOrderId);

    if (error) throw new Error(`Failed to mark transaction failed: ${error.message}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. Fulfillment Stub
//    TODO: Grant entitlements into `program_access` table once that schema
//    is finalized from the DB cleanup work.
//
//    Current behavior:
//    - Logs the intent
//    - Sends the Welcome & Receipt email to the user via Resend!
//    - Resolves the purchased program from the transaction payload
//    - UPSERTs the entitlement into `program_access`
//    - Marks the transaction as fulfilled only after the entitlement write succeeds
//    - Marks the transaction as fulfillment_failed on any error
// ─────────────────────────────────────────────────────────────────────────────

// Mapping from the website marketing slugs to the actual database enums
const webToDbSlug: Record<string, string> = {
    "6-day-compass-reset": "six_day_reset",
    "90-day-smoke-free-journey": "ninety_day_transform",
    "14-day-sleep-reset": "sleep_disorder_reset",
    "21-day-energy-reset": "energy_vitality",
    "mens-vitality-reset-program": "male_sexual_health",
    "radiance-journey": "age_reversal",
};

const allowedProgramSlugs = new Set([
    "six_day_reset",
    "ninety_day_transform",
    "sleep_disorder_reset",
    "energy_vitality",
    "age_reversal",
    "male_sexual_health",
]);

function resolveProgramSlugs(items: unknown): string[] {
    if (!Array.isArray(items) || items.length === 0) {
        return [];
    }

    const slugs = items
        .map((item) => {
            if (!item || typeof item !== "object") {
                return null;
            }

            const rawProgramSlug = (item as { program_slug?: unknown }).program_slug;
            if (typeof rawProgramSlug !== "string" || !rawProgramSlug.trim()) {
                return null;
            }

            const dbSlug = webToDbSlug[rawProgramSlug.trim()] ?? rawProgramSlug.trim();
            return allowedProgramSlugs.has(dbSlug) ? dbSlug : null;
        })
        .filter((slug): slug is string => Boolean(slug));

    return Array.from(new Set(slugs));
}

async function attemptFulfillment(transactionId: string): Promise<void> {
    console.log(`[Commerce] Fulfillment started for transaction ${transactionId}...`);

    try {
        const { data: txn } = await supabaseAdmin
            .from("transactions")
            .select("*")
            .eq("id", transactionId)
            .single();

        if (!txn) {
            console.error(`[Commerce] Transaction not found for ID: ${transactionId}`);
            return;
        }

        // Fetch user profile to get their email and name
        const { data: profile } = await supabaseAdmin
            .from("profiles")
            .select("full_name, email")
            .eq("id", txn.user_id)
            .single();

        if (profile && profile.email) {
            // Calculate total formatting
            const amountInr = (txn.amount / 100).toFixed(2);
            const amountFormatted = `₹${amountInr}`;
            
            // For receipt copy, join the item titles so the message stays accurate
            const items = txn.items as TransactionItem[];
            const programName = items && items.length > 0
                ? items.map((item) => item.title).join(", ")
                : "Recovery Compass Curriculum";

            // Fire and forget the email dispatch
             await sendWelcomeEmail({
                to: profile.email,
                customerName: profile.full_name || "Seeker",
                programName: programName,
                amountFormatted: amountFormatted,
                orderId: txn.provider_order_id,
            });
        } else {
             console.log(`[Commerce] No email found for profile linked to txn ${transactionId}`);
        }

        // 1. Read the transaction's items to get the purchased program slugs
        const dbSlugs = resolveProgramSlugs(txn.items);

        if (dbSlugs.length === 0) {
            throw new Error(`Unable to resolve program slug for transaction ${transactionId}`);
        }

        // 2. Upsert into program_access so the user natively owns each program
        for (const dbSlug of dbSlugs) {
            const { error: accessError } = await supabaseAdmin
                .from("program_access")
                .upsert({
                    user_id: txn.user_id,
                    owned_program: dbSlug,
                    purchase_state: 'owned_active',
                    completion_state: 'not_started'
                }, { onConflict: 'user_id, owned_program' });

            if (accessError) {
                console.error(`[Commerce] Failed to write entitlement for txn ${transactionId}:`, accessError);
                throw accessError;
            }
        }

        // 3. Mark transaction as fully fulfilled
        const { error: fulfillmentError } = await supabaseAdmin
            .from("transactions")
            .update({ fulfillment_status: "fulfilled" })
            .eq("id", transactionId);

        if (fulfillmentError) {
            throw new Error(`Failed to mark transaction fulfilled: ${fulfillmentError.message}`);
        }
            
    } catch (err) {
        console.error(`[Commerce] Fulfillment failed for ${transactionId}:`, err);
        await supabaseAdmin
            .from("transactions")
            .update({ fulfillment_status: "fulfillment_failed" })
            .eq("id", transactionId);
    }
}
