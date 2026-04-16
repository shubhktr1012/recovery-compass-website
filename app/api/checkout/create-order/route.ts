import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createTransaction, TransactionItem } from "@/lib/commerce";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
    try {
        const { amount, items, userId } = await req.json();

        if (!amount || amount <= 0) {
            return NextResponse.json({ message: "Invalid amount" }, { status: 400 });
        }

        if (!userId) {
            return NextResponse.json({ message: "User ID is required" }, { status: 400 });
        }

        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ message: "At least one item is required" }, { status: 400 });
        }

        // Razorpay expects amount in paise (multiply by 100)
        const amountInPaise = amount * 100;

        const order = await razorpay.orders.create({
            amount: amountInPaise,
            currency: "INR",
            receipt: `rc_receipt_${Date.now()}`,
            notes: {
                payment_source: "web_checkout",
                user_id: userId,
            },
        });

        // Log the transaction with status "created"
        await createTransaction({
            userId,
            providerOrderId: order.id,
            amount: amountInPaise,
            currency: "INR",
            items: items as TransactionItem[],
        });

        return NextResponse.json(order);
    } catch (error: any) {
        console.error("Razorpay Order Creation Error:", error);
        return NextResponse.json(
            { message: error.message || "Something went wrong" },
            { status: 500 }
        );
    }
}
