import crypto from "crypto";
import { sendOpsAlertEmail, sendWelcomeEmail } from "@/lib/mail";
import {
    CANONICAL_PROGRAM_SLUGS,
    WEB_TO_DB_PROGRAM_SLUG,
    type CanonicalProgramSlug,
} from "@/lib/public-programs";
import {
    DIET_PLAN_ADDON_PRICE_INR,
    DIET_PLAN_CART_ID,
    DIET_PLAN_CHECKOUT_SLUG,
    isDietPlanCheckoutSlug,
    type DietPlanCheckoutSlug,
} from "@/lib/diet-plan-product";
import { supabaseAdmin } from "@/lib/supabase-admin";
export { supabaseAdmin };

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface TransactionItem {
    program_slug: string;
    title: string;
    price_inr: number;
    quantity: number;
    queue_rank?: number | null;
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

type CheckoutItemSlug = CanonicalProgramSlug | DietPlanCheckoutSlug;

type CanonicalTransactionItem = TransactionItem & {
    program_slug: CheckoutItemSlug;
};

type ProgramAccessRow = {
    owned_program: string;
    purchase_state: string | null;
    completion_state: string | null;
    scheduled_start_date: string | null;
    paused_at: string | null;
    completed_at: string | null;
};

export type DietPlanCheckoutClaim = {
    orderId: string;
    claimToken: string;
};

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

export const webToDbSlug: Readonly<Record<string, CheckoutItemSlug>> = {
    ...WEB_TO_DB_PROGRAM_SLUG,
    [DIET_PLAN_CART_ID]: DIET_PLAN_CHECKOUT_SLUG,
};

const allowedCheckoutSlugs = new Set<CheckoutItemSlug>([
    ...CANONICAL_PROGRAM_SLUGS,
    DIET_PLAN_CHECKOUT_SLUG,
]);

function createClaimToken() {
    return crypto.randomBytes(32).toString("base64url");
}

function hashClaimToken(token: string) {
    return crypto.createHash("sha256").update(token).digest("hex");
}

function formatInr(amountInPaise: number) {
    return `₹${(amountInPaise / 100).toFixed(2)}`;
}

function formatItemAmountInr(item: TransactionItem) {
    return formatInr((item.price_inr || 0) * (item.quantity || 1) * 100);
}

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

export async function createDietPlanClaimForTransaction(
    transactionId: string | null
): Promise<DietPlanCheckoutClaim | null> {
    if (!transactionId) {
        return null;
    }

    const claimToken = createClaimToken();
    const { data: order, error } = await supabaseAdmin
        .from("diet_plan_orders")
        .update({
            claim_token_hash: hashClaimToken(claimToken),
            error_message: null,
        })
        .eq("source", "checkout_addon")
        .eq("source_transaction_id", transactionId)
        .eq("status", "awaiting_questionnaire")
        .select("id")
        .maybeSingle();

    if (error) {
        throw new Error(`Failed to create diet plan claim token: ${error.message}`);
    }

    if (!order) {
        return null;
    }

    return {
        orderId: order.id,
        claimToken,
    };
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

export function canonicalizeProgramSlug(programSlug: unknown): CheckoutItemSlug | null {
    if (typeof programSlug !== "string" || !programSlug.trim()) {
        return null;
    }

    const normalizedSlug = webToDbSlug[programSlug.trim()] ?? programSlug.trim();
    return allowedCheckoutSlugs.has(normalizedSlug as CheckoutItemSlug)
        ? (normalizedSlug as CheckoutItemSlug)
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
        const queueRank = typeof (item as { queue_rank?: unknown }).queue_rank === "number"
            && Number.isFinite((item as { queue_rank: number }).queue_rank)
            && (item as { queue_rank: number }).queue_rank > 0
            ? Math.trunc((item as { queue_rank: number }).queue_rank)
            : null;

        return [{
            program_slug: programSlug,
            title,
            price_inr: priceInr,
            quantity,
            ...(queueRank ? { queue_rank: queueRank } : {}),
        }];
    });
}

function resolveProgramSlugs(items: unknown): string[] {
    const slugs = canonicalizeTransactionItems(items)
        .map((item, index) => ({ item, index }))
        .sort((a, b) => {
            const aRank = a.item.queue_rank ?? Number.MAX_SAFE_INTEGER;
            const bRank = b.item.queue_rank ?? Number.MAX_SAFE_INTEGER;
            return aRank - bRank || a.index - b.index;
        })
        .map(({ item }) => item.program_slug);

    return Array.from(new Set(slugs));
}

function shouldPreserveExistingAccess(row: ProgramAccessRow | undefined) {
    if (!row) {
        return false;
    }

    return (
        row.purchase_state === "owned_completed" ||
        row.completion_state === "completed" ||
        row.completion_state === "in_progress" ||
        Boolean(row.completed_at) ||
        Boolean(row.scheduled_start_date) ||
        Boolean(row.paused_at)
    );
}

async function grantProgramEntitlements(userId: string, programSlugs: CanonicalProgramSlug[]) {
    if (programSlugs.length === 0) {
        return;
    }

    const { data: existingRows, error: existingRowsError } = await supabaseAdmin
        .from("program_access")
        .select("owned_program, purchase_state, completion_state, scheduled_start_date, paused_at, completed_at")
        .eq("user_id", userId)
        .in("owned_program", programSlugs);

    if (existingRowsError) {
        throw existingRowsError;
    }

    const existingByProgram = new Map(
        (existingRows ?? []).map((row) => [row.owned_program, row as ProgramAccessRow])
    );

    for (const [index, dbSlug] of programSlugs.entries()) {
        const existing = existingByProgram.get(dbSlug);

        if (shouldPreserveExistingAccess(existing)) {
            continue;
        }

        const priorityRank = index + 1;
        const payload = {
            user_id: userId,
            owned_program: dbSlug,
            purchase_state: "owned_active",
            completion_state: "not_started",
            priority_rank: priorityRank,
        };

        const { error: accessError } = existing
            ? await supabaseAdmin
                .from("program_access")
                .update(payload)
                .eq("user_id", userId)
                .eq("owned_program", dbSlug)
            : await supabaseAdmin
                .from("program_access")
                .insert(payload);

        if (accessError) {
            console.error(`[Commerce] Failed to write entitlement for ${dbSlug}:`, accessError);
            throw accessError;
        }
    }

    const { error: normalizeError } = await supabaseAdmin.rpc(
        "normalize_owned_program_priority_queue",
        { p_user_id: userId }
    );

    if (normalizeError) {
        throw normalizeError;
    }
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
        const allSlugs = resolveProgramSlugs(txn.items);
        const programSlugs = allSlugs.filter(
            (slug): slug is CanonicalProgramSlug => !isDietPlanCheckoutSlug(slug)
        );
        const hasDietPlan = allSlugs.includes(DIET_PLAN_CHECKOUT_SLUG);

        if (allSlugs.length === 0) {
            throw new Error(`Unable to resolve program slug for transaction ${transactionId}`);
        }

        // 2. Grant entitlements in program_access FIRST (Mission Critical)
        // This ensures the user definitely has access before we bother with notifications.
        await grantProgramEntitlements(txn.user_id, programSlugs);

        const { data: profile } = await supabaseAdmin
            .from("profiles")
            .select("display_name, email")
            .eq("id", txn.user_id)
            .maybeSingle();

        // 2b. Create the paid diet-plan add-on order. The questionnaire is
        // submitted later through an order-specific claim token.
        if (hasDietPlan && profile?.email) {
            // Find the price from items if available
            const items = txn.items as TransactionItem[];
            const dietPlanItem = items.find(item => item.program_slug === DIET_PLAN_CHECKOUT_SLUG);
            const priceInr = dietPlanItem?.price_inr ? dietPlanItem.price_inr * 100 : DIET_PLAN_ADDON_PRICE_INR * 100;
            const providerDietOrderId = txn.provider_order_id || `txn_${transactionId}`;

            const { data: existingDietPlan, error: existingDietPlanError } = await supabaseAdmin
                .from("diet_plan_orders")
                .select("id, status")
                .eq("razorpay_order_id", providerDietOrderId)
                .maybeSingle();

            if (existingDietPlanError) {
                console.error(`[Commerce] Failed to inspect diet plan order for txn ${transactionId}:`, existingDietPlanError);
                throw existingDietPlanError;
            }

            if (existingDietPlan) {
                if (existingDietPlan.status === "awaiting_questionnaire") {
                    const { error: dietPlanUpdateError } = await supabaseAdmin
                        .from("diet_plan_orders")
                        .update({
                            email: profile.email,
                            name: profile.display_name || null,
                            razorpay_payment_id: txn.provider_payment_id,
                            razorpay_signature: txn.provider_signature,
                            amount: priceInr,
                            currency: "INR",
                            source: "checkout_addon",
                            source_transaction_id: transactionId,
                        })
                        .eq("id", existingDietPlan.id);

                    if (dietPlanUpdateError) {
                        console.error(`[Commerce] Failed to update diet plan order for txn ${transactionId}:`, dietPlanUpdateError);
                        throw dietPlanUpdateError;
                    }
                }
            } else {
                const { error: dietPlanError } = await supabaseAdmin
                    .from("diet_plan_orders")
                    .insert({
                        email: profile.email,
                        name: profile.display_name || null,
                        razorpay_order_id: providerDietOrderId,
                        razorpay_payment_id: txn.provider_payment_id,
                        razorpay_signature: txn.provider_signature,
                        amount: priceInr,
                        currency: "INR",
                        questionnaire_data: {},
                        status: "awaiting_questionnaire",
                        source: "checkout_addon",
                        source_transaction_id: transactionId,
                    });

                if (dietPlanError) {
                    console.error(`[Commerce] Failed to write diet plan order for txn ${transactionId}:`, dietPlanError);
                    throw dietPlanError;
                }
            }
        }

        // 3. Dispatch Welcome Email (Best Effort)
        // Wrapped in try-catch so email failure doesn't rollback entitlements.
        try {
            if (profile && profile.email) {
                const amountFormatted = formatInr(txn.amount);
                const items = txn.items as TransactionItem[];
                const programName = items && items.length > 0
                    ? items.map((item) => item.title).join(", ")
                    : "Recovery Compass Curriculum";
                const lineItems = items && items.length > 0
                    ? items.map((item) => ({
                        title: item.title,
                        amountFormatted: formatItemAmountInr(item),
                    }))
                    : undefined;

                const emailResult = await sendWelcomeEmail({
                    to: profile.email,
                    customerName: profile.display_name || "Seeker",
                    programName: programName,
                    lineItems,
                    amountFormatted: amountFormatted,
                    orderId: txn.provider_order_id,
                    receiptDate: txn.created_at,
                });

                if (emailResult.success) {
                    console.log(`[Commerce] Welcome email dispatched for txn ${transactionId}`);
                } else {
                    console.error(
                        `[Mail] Welcome email was not sent for txn ${transactionId}: ${emailResult.error ?? "Unknown mail error"}`
                    );
                }
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
