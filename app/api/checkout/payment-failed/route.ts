import { NextRequest, NextResponse } from "next/server";
import { markTransactionFailed } from "@/lib/commerce";

function getErrorMessage(error: unknown) {
    if (error instanceof Error) {
        return error.message;
    }

    return "Something went wrong";
}

export async function POST(req: NextRequest) {
    try {
        const { razorpay_order_id, error } = await req.json();

        if (!razorpay_order_id) {
            return NextResponse.json(
                { message: "Missing Razorpay order id" },
                { status: 400 }
            );
        }

        const failureMetadata = {
            razorpay_failure: error ?? null,
            failed_at: new Date().toISOString(),
        };

        console.error("Razorpay checkout payment failed", {
            providerOrderId: razorpay_order_id,
            error,
        });

        await markTransactionFailed(razorpay_order_id, failureMetadata);

        return NextResponse.json({ message: "Payment failure recorded" });
    } catch (error: unknown) {
        console.error("Failed to record Razorpay checkout failure", error);
        return NextResponse.json(
            { message: getErrorMessage(error) },
            { status: 500 }
        );
    }
}
