import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createTransaction, TransactionItem, supabaseAdmin } from "@/lib/commerce";
import { MAX_CART_ITEMS } from "@/lib/program-commerce-policy";
import { createSupabaseServerClient } from "@/lib/supabase-server";

function getErrorMessage(error: unknown) {
    if (error instanceof Error) {
        return error.message;
    }

    return "Something went wrong";
}

export async function POST(req: NextRequest) {
    const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID!,
        key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    try {
        const { amount, items, userId } = await req.json();

        const supabase = await createSupabaseServerClient();
        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        if (!amount || amount <= 0) {
            return NextResponse.json({ message: "Invalid amount" }, { status: 400 });
        }

        if (userId && userId !== user.id) {
            return NextResponse.json({ message: "User mismatch" }, { status: 403 });
        }

        const canonicalUserId = user.id;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ message: "At least one item is required" }, { status: 400 });
        }

        if (items.length > MAX_CART_ITEMS) {
            return NextResponse.json(
                { message: "This plan currently supports only one program at a time." },
                { status: 400 }
            );
        }

        // Server-Side Safety Net: Check if user already owns an active program
        const { data: activePrograms, error: accessError } = await supabaseAdmin
            .from("program_access")
            .select("owned_program")
            .eq("user_id", canonicalUserId)
            .eq("purchase_state", "owned_active");

        if (accessError) {
            console.error("Supabase Error checking active program:", accessError);
            return NextResponse.json({ message: "Unable to verify program eligibility" }, { status: 500 });
        }

        if (activePrograms && activePrograms.length > 0) {
            return NextResponse.json(
                { message: "You already have an active program. Please finish it before purchasing a new one." },
                { status: 400 }
            );
        }

        // Razorpay expects amount in paise (multiply by 100)
        const amountInPaise = amount * 100;

        const order = await razorpay.orders.create({
            amount: amountInPaise,
            currency: "INR",
            receipt: `rc_receipt_${Date.now()}`,
            notes: {
                payment_source: "web_checkout",
                user_id: canonicalUserId,
            },
        });

        // Log the transaction with status "created"
        await createTransaction({
            userId: canonicalUserId,
            providerOrderId: order.id,
            amount: amountInPaise,
            currency: "INR",
            items: items as TransactionItem[],
        });

        return NextResponse.json(order);
    } catch (error: unknown) {
        console.error("Razorpay Order Creation Error:", error);
        return NextResponse.json(
            { message: getErrorMessage(error) },
            { status: 500 }
        );
    }
}
