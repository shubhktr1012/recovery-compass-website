import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { markTransactionPaid } from "@/lib/commerce";

export async function POST(req: NextRequest) {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = await req.json();

        // ── Step 1: Verify Razorpay Signature ──────────────────────────────
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
            .update(sign)
            .digest("hex");

        if (razorpay_signature !== expectedSign) {
            return NextResponse.json(
                { message: "Invalid payment signature" },
                { status: 400 }
            );
        }

        // ── Step 2: Mark Transaction as Paid (idempotent) ──────────────────
        // This also calls the fulfillment stub internally.
        // If the webhook already processed this payment, it safely no-ops.
        const { alreadyProcessed, transactionId } = await markTransactionPaid({
            providerOrderId: razorpay_order_id,
            providerPaymentId: razorpay_payment_id,
            providerSignature: razorpay_signature,
        });

        return NextResponse.json({
            message: alreadyProcessed
                ? "Payment already processed"
                : "Payment verified successfully",
            transactionId,
        });
    } catch (error: any) {
        console.error("Payment Verification Error:", error);
        return NextResponse.json(
            { message: error.message || "Something went wrong" },
            { status: 500 }
        );
    }
}
