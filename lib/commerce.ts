import { createClient } from "@supabase/supabase-js";
import { sendWelcomeEmail } from "@/lib/mail";

// ─────────────────────────────────────────────────────────────────────────────
// Supabase Admin Client (server-only, service_role)
// ─────────────────────────────────────────────────────────────────────────────

const supabaseAdmin = createClient(
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
//    - Does NOT update `profiles.purchased_programs`
//    - Does NOT change `fulfillment_status` to "fulfilled"
//    - Leaves `fulfillment_status` as "pending" until the real DB entitlement flow is wired
//
//    When ready, this function should:
//    1. Read the transaction's `items` JSONB
//    2. Insert rows into `program_access` for each program_slug
//    3. Update the transaction's `fulfillment_status` to "fulfilled"
//    4. Handle errors by setting `fulfillment_status` to "fulfillment_failed"
// ─────────────────────────────────────────────────────────────────────────────

async function attemptFulfillment(transactionId: string): Promise<void> {
    // eslint-disable-next-line no-console
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
            
            // For now, take the first item's title as the program name
            const items = txn.items as TransactionItem[];
            const programName = items && items.length > 0 ? items[0].title : "Recovery Compass Curriculum";

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

        // When program_access DB entitlement exists, we would complete the flow here
        // and update fulfillment_status to "fulfilled".
        
    } catch (err) {
        console.error(`[Commerce] Fulfillment failed for ${transactionId}:`, err);
        await supabaseAdmin
            .from("transactions")
            .update({ fulfillment_status: "fulfillment_failed" })
            .eq("id", transactionId);
    }
}
