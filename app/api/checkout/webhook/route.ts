import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { markTransactionPaid, markTransactionFailed } from "@/lib/commerce";

// ─────────────────────────────────────────────────────────────────────────────
// Razorpay Webhook Handler
// ─────────────────────────────────────────────────────────────────────────────
// Razorpay sends events to this endpoint for payment lifecycle changes.
// This acts as a reliability layer: even if the user's browser closes after
// payment, this webhook will still fire and mark the transaction as paid.
//
// Setup in Razorpay Dashboard:
//   1. Go to Settings → Webhooks → Add New Webhook
//   2. URL: https://yourdomain.com/api/checkout/webhook
//   3. Events to subscribe: "payment.captured", "payment.failed"
//   4. Secret: Set a unique webhook secret and add it to RAZORPAY_WEBHOOK_SECRET
// ─────────────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
    try {
        const rawBody = await req.text();
        const signature = req.headers.get("x-razorpay-signature");

        if (!signature) {
            return NextResponse.json({ message: "Missing signature" }, { status: 400 });
        }

        // ── Step 1: Verify Webhook Signature ───────────────────────────────
        // Uses RAZORPAY_WEBHOOK_SECRET (different from API key secret)
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
            .update(rawBody)
            .digest("hex");

        if (signature !== expectedSignature) {
            console.error("[Webhook] Invalid signature");
            return NextResponse.json({ message: "Invalid signature" }, { status: 400 });
        }

        // ── Step 2: Parse Event ────────────────────────────────────────────
        const event = JSON.parse(rawBody);
        const eventType = event.event as string;
        const payment = event.payload?.payment?.entity;

        if (!payment) {
            return NextResponse.json({ message: "No payment entity in payload" }, { status: 400 });
        }

        const orderId = payment.order_id as string;
        const paymentId = payment.id as string;

        // ── Step 3: Handle Events ──────────────────────────────────────────
        switch (eventType) {
            case "payment.captured": {
                // Idempotent: if already processed by verify-payment, this is a safe no-op
                const { alreadyProcessed } = await markTransactionPaid({
                    providerOrderId: orderId,
                    providerPaymentId: paymentId,
                    providerSignature: signature,
                });

                console.log(
                    `[Webhook] payment.captured for order ${orderId} — ` +
                    `${alreadyProcessed ? "already processed" : "newly marked paid"}`
                );
                break;
            }

            case "payment.failed": {
                await markTransactionFailed(orderId, {
                    webhook_event: eventType,
                    error_code: payment.error_code,
                    error_description: payment.error_description,
                    error_reason: payment.error_reason,
                });

                console.log(`[Webhook] payment.failed for order ${orderId}`);
                break;
            }

            default:
                console.log(`[Webhook] Unhandled event: ${eventType}`);
        }

        // Razorpay expects a 200 response to acknowledge receipt
        return NextResponse.json({ status: "ok" });
    } catch (error: any) {
        console.error("[Webhook] Error processing event:", error);
        // Return 200 even on error to prevent Razorpay from retrying endlessly
        // for events we've at least attempted to process
        return NextResponse.json({ status: "error", message: error.message }, { status: 200 });
    }
}
