import { createClient } from "@supabase/supabase-js";
import { sendOpsAlertEmail, sendWelcomeEmail } from "@/lib/mail";

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

type FulfillmentSource = "mark_paid" | "reconciliation";

type FulfillmentAttemptResult = {
    transactionId: string;
    succeeded: boolean;
    reason?: string;
};

type CanonicalTransactionItem = TransactionItem & {
    program_slug: CanonicalProgramSlug;
};

type CanonicalProgramSlug =
    | "six_day_reset"
    | "ninety_day_transform"
    | "sleep_disorder_reset"
    | "energy_vitality"
    | "age_reversal"
    | "male_sexual_health";

export interface ReconcileFulfillmentOptions {
    limit?: number;
    maxAgeMinutes?: number;
}

export interface ReconcileFulfillmentResult {
    scanned: number;
    attempted: number;
    fulfilled: number;
    failed: number;
    failures: Array<{ transactionId: string; reason: string }>;
}

export interface FulfillmentHealthSnapshot {
    paidPendingCount: number;
    paidFailedCount: number;
    paidFulfilledCount: number;
    oldestStalledTransaction: {
        id: string;
        provider_order_id: string;
        updated_at: string;
        fulfillment_status: string;
    } | null;
}

export const webToDbSlug: Record<string, CanonicalProgramSlug> = {
    "6-day-compass-reset": "six_day_reset",
    "90-day-smoke-free-journey": "ninety_day_transform",
    "14-day-sleep-reset": "sleep_disorder_reset",
    "21-day-deep-sleep-reset": "sleep_disorder_reset",
    "21-day-energy-reset": "energy_vitality",
    "14-day-energy-restore": "energy_vitality",
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
] as const satisfies readonly CanonicalProgramSlug[]);

function formatUnknownError(error: unknown) {
    if (error instanceof Error) {
        return error.message;
    }

    if (typeof error === "string") {
        return error;
    }

    try {
        return JSON.stringify(error);
    } catch {
        return "Unknown fulfillment error";
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Create Transaction (called when Razorpay order is created)
// ─────────────────────────────────────────────────────────────────────────────

export async function createTransaction(params: CreateTransactionParams) {
    const normalizedItems = canonicalizeTransactionItems(params.items);

    const { data, error } = await supabaseAdmin
        .from("transactions")
        .insert({
            user_id: params.userId,
            provider: "razorpay",
            provider_order_id: params.providerOrderId,
            amount: params.amount,
            currency: params.currency,
            items: normalizedItems,
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
        .select("id, payment_status, fulfillment_status")
        .eq("provider_order_id", params.providerOrderId)
        .single();

    if (!existing) {
        throw new Error(`Transaction not found for order: ${params.providerOrderId}`);
    }

    // Already paid — safe no-op
    if (existing.payment_status === "paid") {
        if (existing.fulfillment_status !== "fulfilled") {
            await attemptFulfillment(existing.id, "mark_paid");
        }

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
    await attemptFulfillment(existing.id, "mark_paid");

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

export function canonicalizeProgramSlug(programSlug: unknown): CanonicalProgramSlug | null {
    if (typeof programSlug !== "string" || !programSlug.trim()) {
        return null;
    }

    const normalizedSlug = webToDbSlug[programSlug.trim()] ?? programSlug.trim();
    return allowedProgramSlugs.has(normalizedSlug as CanonicalProgramSlug)
        ? (normalizedSlug as CanonicalProgramSlug)
        : null;
}

export function canonicalizeTransactionItems(items: unknown): CanonicalTransactionItem[] {
    if (!Array.isArray(items)) {
        return [];
    }

    return items.flatMap((item) => {
        if (!item || typeof item !== "object") {
            return [];
        }

        const programSlug = canonicalizeProgramSlug((item as { program_slug?: unknown }).program_slug);
        if (!programSlug) {
            return [];
        }

        const title = typeof (item as { title?: unknown }).title === "string"
            ? (item as { title: string }).title
            : "";
        const priceInr = typeof (item as { price_inr?: unknown }).price_inr === "number"
            ? (item as { price_inr: number }).price_inr
            : 0;
        const quantity = typeof (item as { quantity?: unknown }).quantity === "number"
            ? (item as { quantity: number }).quantity
            : 1;

        return [{
            program_slug: programSlug,
            title,
            price_inr: priceInr,
            quantity,
        }];
    });
}

function resolveProgramSlugs(items: unknown): string[] {
    const slugs = canonicalizeTransactionItems(items).map((item) => item.program_slug);

    return Array.from(new Set(slugs));
}

async function attemptFulfillment(transactionId: string, source: FulfillmentSource): Promise<FulfillmentAttemptResult> {
    console.log(`[Commerce] Fulfillment started for transaction ${transactionId}...`);
    let providerOrderId: string | null = null;
    let txnMetadata: Record<string, unknown> = {};

    try {
        const { data: txn } = await supabaseAdmin
            .from("transactions")
            .select("*")
            .eq("id", transactionId)
            .single();

        if (!txn) {
            throw new Error(`Transaction not found for ID: ${transactionId}`);
        }
        providerOrderId = txn.provider_order_id ?? null;
        txnMetadata =
            txn.metadata && typeof txn.metadata === "object" && !Array.isArray(txn.metadata)
                ? (txn.metadata as Record<string, unknown>)
                : {};

        if (txn.fulfillment_status === "fulfilled") {
            return { transactionId, succeeded: true };
        }

        // 1. Read the transaction's items to get the purchased program slugs
        const dbSlugs = resolveProgramSlugs(txn.items);

        if (dbSlugs.length === 0) {
            throw new Error(`Unable to resolve program slug for transaction ${transactionId}`);
        }

        // 2. Grant entitlements in program_access FIRST (Mission Critical)
        // This ensures the user definitely has access before we bother with notifications.
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
                throw accessError; // Still fail if DB write fails
            }
        }

        // 3. Dispatch Welcome Email (Best Effort)
        // Wrapped in try-catch so email failure doesn't rollback entitlements.
        try {
            const { data: profile } = await supabaseAdmin
                .from("profiles")
                .select("display_name, email")
                .eq("id", txn.user_id)
                .maybeSingle();

            if (profile && profile.email) {
                const amountInr = (txn.amount / 100).toFixed(2);
                const amountFormatted = `₹${amountInr}`;
                const items = txn.items as TransactionItem[];
                const programName = items && items.length > 0
                    ? items.map((item) => item.title).join(", ")
                    : "Recovery Compass Curriculum";

                await sendWelcomeEmail({
                    to: profile.email,
                    customerName: profile.display_name || "Seeker",
                    programName: programName,
                    amountFormatted: amountFormatted,
                    orderId: txn.provider_order_id,
                });
                console.log(`[Commerce] Welcome email dispatched for txn ${transactionId}`);
            }
        } catch (emailErr) {
            // Log but don't fail fulfillment
            console.error(`[Mail] Non-blocking failure sending welcome email for txn ${transactionId}:`, emailErr);
        }

        // 4. Mark transaction as fully fulfilled
        const { error: fulfillmentError } = await supabaseAdmin
            .from("transactions")
            .update({
                fulfillment_status: "fulfilled",
                metadata: {
                    ...txnMetadata,
                    last_fulfillment_attempt_at: new Date().toISOString(),
                    last_fulfillment_source: source,
                    last_fulfillment_error: null,
                },
            })
            .eq("id", transactionId);

        if (fulfillmentError) {
            throw new Error(`Failed to mark transaction fulfilled: ${fulfillmentError.message}`);
        }

        return { transactionId, succeeded: true };
    } catch (err) {
        const failureReason = formatUnknownError(err);
        console.error(`[Commerce] Fulfillment failed for ${transactionId}:`, err);

        await supabaseAdmin
            .from("transactions")
            .update({
                fulfillment_status: "fulfillment_failed",
                metadata: {
                    ...txnMetadata,
                    last_fulfillment_attempt_at: new Date().toISOString(),
                    last_fulfillment_source: source,
                    last_fulfillment_error: failureReason,
                },
            })
            .eq("id", transactionId);

        await sendOpsAlertEmail({
            subject: `[Recovery Compass] Fulfillment failed (${source})`,
            message: [
                `transaction_id: ${transactionId}`,
                providerOrderId ? `provider_order_id: ${providerOrderId}` : "provider_order_id: <unknown>",
                `source: ${source}`,
                `error: ${failureReason}`,
                "",
                "Please inspect the transactions row and retry reconciliation once fixed.",
            ].join("\n"),
        });

        return {
            transactionId,
            succeeded: false,
            reason: failureReason,
        };
    }
}

export async function reconcilePendingFulfillments(
    options: ReconcileFulfillmentOptions = {}
): Promise<ReconcileFulfillmentResult> {
    const limit = Math.min(Math.max(options.limit ?? 100, 1), 500);
    const maxAgeMinutes = Math.max(options.maxAgeMinutes ?? 5, 0);
    const oldestEligibleUpdatedAt =
        maxAgeMinutes > 0 ? new Date(Date.now() - maxAgeMinutes * 60_000).toISOString() : null;

    let query = supabaseAdmin
        .from("transactions")
        .select("id")
        .eq("payment_status", "paid")
        .in("fulfillment_status", ["pending", "fulfillment_failed"])
        .order("updated_at", { ascending: true })
        .limit(limit);

    if (oldestEligibleUpdatedAt) {
        query = query.lte("updated_at", oldestEligibleUpdatedAt);
    }

    const { data, error } = await query;
    if (error) {
        throw new Error(`Failed to load stale transactions: ${error.message}`);
    }

    const stalledTransactions = data ?? [];
    const failures: Array<{ transactionId: string; reason: string }> = [];
    let fulfilled = 0;

    for (const row of stalledTransactions) {
        const outcome = await attemptFulfillment(row.id, "reconciliation");
        if (outcome.succeeded) {
            fulfilled += 1;
            continue;
        }

        failures.push({
            transactionId: row.id,
            reason: outcome.reason ?? "Unknown fulfillment error",
        });
    }

    return {
        scanned: stalledTransactions.length,
        attempted: stalledTransactions.length,
        fulfilled,
        failed: failures.length,
        failures,
    };
}

async function countTransactions(paymentStatus: string, fulfillmentStatus: string) {
    const { count, error } = await supabaseAdmin
        .from("transactions")
        .select("*", { count: "exact", head: true })
        .eq("payment_status", paymentStatus)
        .eq("fulfillment_status", fulfillmentStatus);

    if (error) {
        throw new Error(`Failed counting ${paymentStatus}/${fulfillmentStatus}: ${error.message}`);
    }

    return count ?? 0;
}

export async function getFulfillmentHealthSnapshot(): Promise<FulfillmentHealthSnapshot> {
    const [paidPendingCount, paidFailedCount, paidFulfilledCount] = await Promise.all([
        countTransactions("paid", "pending"),
        countTransactions("paid", "fulfillment_failed"),
        countTransactions("paid", "fulfilled"),
    ]);

    const { data: oldestStalledTransaction, error: oldestError } = await supabaseAdmin
        .from("transactions")
        .select("id, provider_order_id, updated_at, fulfillment_status")
        .eq("payment_status", "paid")
        .in("fulfillment_status", ["pending", "fulfillment_failed"])
        .order("updated_at", { ascending: true })
        .limit(1)
        .maybeSingle();

    if (oldestError) {
        throw new Error(`Failed loading oldest stalled transaction: ${oldestError.message}`);
    }

    return {
        paidPendingCount,
        paidFailedCount,
        paidFulfilledCount,
        oldestStalledTransaction,
    };
}
