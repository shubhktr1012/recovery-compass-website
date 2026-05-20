import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import {
    canonicalizeProgramSlug,
    canonicalizeTransactionItems,
    createTransaction,
    TransactionItem,
} from "@/lib/commerce";
import { MAX_CART_ITEMS } from "@/lib/program-commerce-policy";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { isDietPlanCheckoutSlug } from "@/lib/diet-plan-product";
import type { CanonicalProgramSlug } from "@/lib/public-programs";

function getErrorMessage(error: unknown) {
    if (error instanceof Error) {
        return error.message;
    }

    return "Something went wrong";
}

function uniqueValues<T>(values: T[]) {
    return Array.from(new Set(values));
}

function haveSameMembers(a: string[], b: string[]) {
    if (a.length !== b.length) {
        return false;
    }

    const bSet = new Set(b);
    return a.every((value) => bSet.has(value));
}

function normalizeProgramOrder(
    normalizedItems: TransactionItem[],
    programOrder: unknown
): { rankedItems: TransactionItem[]; error?: string } {
    const purchasedProgramSlugs = uniqueValues(
        normalizedItems
            .map((item) => item.program_slug)
            .filter((slug): slug is CanonicalProgramSlug => !isDietPlanCheckoutSlug(slug))
    );

    const orderSource = Array.isArray(programOrder) && programOrder.length > 0
        ? programOrder
        : purchasedProgramSlugs;

    const requestedOrder = uniqueValues(
        orderSource
            .map((slug) => canonicalizeProgramSlug(slug))
            .filter((slug): slug is CanonicalProgramSlug => typeof slug === "string" && !isDietPlanCheckoutSlug(slug))
    );

    if (!haveSameMembers(requestedOrder, purchasedProgramSlugs)) {
        return {
            rankedItems: normalizedItems,
            error: "Program priority must match the programs in your cart.",
        };
    }

    const rankByProgram = new Map(
        requestedOrder.map((slug, index) => [slug, index + 1])
    );

    return {
        rankedItems: normalizedItems.map((item) => {
            if (isDietPlanCheckoutSlug(item.program_slug)) {
                return item;
            }

            return {
                ...item,
                queue_rank: rankByProgram.get(item.program_slug as CanonicalProgramSlug) ?? null,
            };
        }),
    };
}

export async function POST(req: NextRequest) {
    const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!razorpayKeyId || !razorpayKeySecret) {
        return NextResponse.json(
            { message: "Razorpay is not configured" },
            { status: 500 }
        );
    }

    const razorpay = new Razorpay({
        key_id: razorpayKeyId,
        key_secret: razorpayKeySecret,
    });

    try {
        const { amount, items, userId, programOrder } = await req.json();

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
                { message: `You can purchase up to ${MAX_CART_ITEMS} programs at once.` },
                { status: 400 }
            );
        }

        const normalizedItems = canonicalizeTransactionItems(items);
        if (normalizedItems.length === 0) {
            return NextResponse.json({ message: "No valid checkout items were found." }, { status: 400 });
        }

        const { rankedItems, error: programOrderError } = normalizeProgramOrder(
            normalizedItems,
            programOrder
        );

        if (programOrderError) {
            return NextResponse.json({ message: programOrderError }, { status: 400 });
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
            items: rankedItems,
        });

        return NextResponse.json({
            ...order,
            keyId: razorpayKeyId,
        });
    } catch (error: unknown) {
        console.error("Razorpay Order Creation Error:", error);
        return NextResponse.json(
            { message: getErrorMessage(error) },
            { status: 500 }
        );
    }
}
