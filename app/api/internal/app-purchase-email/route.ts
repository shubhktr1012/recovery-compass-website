import { NextResponse } from "next/server";
import { sendAppPurchaseWelcomeEmail } from "@/lib/mail";
import { supabaseAdmin } from "@/lib/supabase-admin";

type AppPurchaseEmailRequest = {
    userId?: string;
    programSlug?: string;
    revenueCatEventId?: string | null;
    providerTransactionId?: string | null;
    revenueCatProductId?: string | null;
    store?: string | null;
};

const PENDING_DELIVERY_TIMEOUT_MS = 10 * 60 * 1000;

function unauthorized() {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
}

function getDedupeKey({
    userId,
    programSlug,
    revenueCatEventId,
    providerTransactionId,
}: Required<Pick<AppPurchaseEmailRequest, "userId" | "programSlug">> &
    Pick<AppPurchaseEmailRequest, "revenueCatEventId" | "providerTransactionId">) {
    return [
        "app_purchase_welcome",
        userId,
        programSlug,
        revenueCatEventId || providerTransactionId || "no-provider-id",
    ].join(":");
}

function isRecoverablePendingDelivery(updatedAt?: string | null, createdAt?: string | null) {
    const timestamp = updatedAt || createdAt;

    if (!timestamp) {
        return true;
    }

    const parsed = Date.parse(timestamp);

    if (Number.isNaN(parsed)) {
        return true;
    }

    return Date.now() - parsed >= PENDING_DELIVERY_TIMEOUT_MS;
}

async function markDeliveryStatus(
    deliveryId: string,
    status: "pending" | "sent" | "failed",
    fields: Record<string, unknown> = {}
) {
    const { error } = await supabaseAdmin
        .from("outbound_email_deliveries")
        .update({
            status,
            sent_at: status === "sent" ? new Date().toISOString() : null,
            updated_at: new Date().toISOString(),
            ...fields,
        })
        .eq("id", deliveryId);

    if (error) {
        throw new Error(
            `Failed to mark outbound_email_deliveries row ${deliveryId} as ${status}: ${error.message}`
        );
    }
}

export async function POST(request: Request) {
    const expectedSecret = process.env.APP_PURCHASE_EMAIL_SECRET;
    const authHeader = request.headers.get("authorization");

    if (!expectedSecret || authHeader !== `Bearer ${expectedSecret}`) {
        return unauthorized();
    }

    try {
        const body = await request.json() as AppPurchaseEmailRequest;
        const userId = body.userId?.trim();
        const programSlug = body.programSlug?.trim();

        if (!userId || !programSlug) {
            return NextResponse.json(
                { success: false, error: "userId and programSlug are required" },
                { status: 400 }
            );
        }

        const dedupeKey = getDedupeKey({
            userId,
            programSlug,
            revenueCatEventId: body.revenueCatEventId ?? null,
            providerTransactionId: body.providerTransactionId ?? null,
        });

        const { data: existingDelivery, error: existingDeliveryError } = await supabaseAdmin
            .from("outbound_email_deliveries")
            .select("id, status, updated_at, created_at")
            .eq("dedupe_key", dedupeKey)
            .maybeSingle();

        if (existingDeliveryError) {
            console.error("[Mail] Failed to query app purchase email delivery state:", existingDeliveryError);
            return NextResponse.json({ success: false, error: existingDeliveryError.message }, { status: 500 });
        }

        if (existingDelivery?.status === "sent") {
            return NextResponse.json({ success: true, deduped: true });
        }

        if (
            existingDelivery?.status === "pending" &&
            !isRecoverablePendingDelivery(existingDelivery.updated_at, existingDelivery.created_at)
        ) {
            return NextResponse.json({ success: true, deduped: true });
        }

        let deliveryId = existingDelivery?.id ?? null;

        if (deliveryId) {
            await markDeliveryStatus(deliveryId, "pending", { last_error: null });
        } else {
            const { data: createdDelivery, error: createDeliveryError } = await supabaseAdmin
                .from("outbound_email_deliveries")
                .insert({
                    email_type: "app_purchase_welcome",
                    dedupe_key: dedupeKey,
                    user_id: userId,
                    program_slug: programSlug,
                    provider: "revenuecat",
                    provider_event_id: body.revenueCatEventId ?? null,
                    provider_transaction_id: body.providerTransactionId ?? null,
                    metadata: {
                        revenuecat_product_id: body.revenueCatProductId ?? null,
                        store: body.store ?? null,
                    },
                })
                .select("id")
                .single();

            if (createDeliveryError) {
                console.error("[Mail] Failed to create app purchase email delivery row:", createDeliveryError);

                if (createDeliveryError.code === "23505") {
                    return NextResponse.json({ success: true, deduped: true });
                }

                return NextResponse.json({ success: false, error: createDeliveryError.message }, { status: 500 });
            }

            deliveryId = createdDelivery.id;
        }

        const { data: profile, error: profileError } = await supabaseAdmin
            .from("profiles")
            .select("email, display_name")
            .eq("id", userId)
            .maybeSingle();

        if (profileError) {
            console.error("[Mail] Failed to fetch profile for app purchase email:", profileError);
            await markDeliveryStatus(deliveryId!, "failed", { last_error: profileError.message });
            return NextResponse.json({ success: false, error: profileError.message }, { status: 500 });
        }

        if (!profile?.email) {
            const errorMessage = `No email found for user ${userId}`;
            console.error(`[Mail] ${errorMessage}`);
            await markDeliveryStatus(deliveryId!, "failed", { last_error: errorMessage });
            return NextResponse.json({ success: false, error: errorMessage }, { status: 422 });
        }

        const emailResult = await sendAppPurchaseWelcomeEmail({
            to: profile.email,
            customerName: profile.display_name || "Seeker",
            programSlug,
            store: body.store ?? null,
        });

        if (!emailResult.success) {
            await markDeliveryStatus(deliveryId!, "failed", {
                last_error: emailResult.error ?? "Unknown email error",
                recipient_email: profile.email,
            });
            return NextResponse.json(
                { success: false, error: emailResult.error ?? "Failed to send app purchase welcome email" },
                { status: 502 }
            );
        }

        await markDeliveryStatus(deliveryId!, "sent", {
            last_error: null,
            recipient_email: profile.email,
        });

        return NextResponse.json({ success: true, emailId: emailResult.id ?? null });
    } catch (error) {
        console.error("[Mail] App purchase welcome email route failed:", error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : "Unknown app purchase email route error",
            },
            { status: 500 }
        );
    }
}
