import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { DIET_PLAN_STANDALONE_PRICE_INR } from "@/lib/diet-plan-product";

const DIET_PLAN_PRICE_PAISE = DIET_PLAN_STANDALONE_PRICE_INR * 100;

function getErrorMessage(error: unknown) {
    if (error instanceof Error) {
        return error.message;
    }

    return "Something went wrong";
}

function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        return NextResponse.json(
            { message: "Razorpay is not configured" },
            { status: 500 }
        );
    }

    const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    try {
        const { email, questionnaire_data } = await req.json();
        const normalizedEmail = String(email ?? "").trim().toLowerCase();

        if (!isValidEmail(normalizedEmail)) {
            return NextResponse.json(
                { message: "A valid email address is required to deliver your plan." },
                { status: 400 }
            );
        }

        if (
            !questionnaire_data ||
            typeof questionnaire_data !== "object" ||
            Array.isArray(questionnaire_data)
        ) {
            return NextResponse.json(
                { message: "Questionnaire data is required." },
                { status: 400 }
            );
        }

        const order = await razorpay.orders.create({
            amount: DIET_PLAN_PRICE_PAISE,
            currency: "INR",
            receipt: `rc_diet_${Date.now()}`,
            notes: {
                payment_source: "web_diet_plan",
                customer_email: normalizedEmail,
            },
        });

        return NextResponse.json({
            orderId: order.id,
            keyId: process.env.RAZORPAY_KEY_ID,
            amount: DIET_PLAN_PRICE_PAISE,
            currency: "INR",
        });
    } catch (error: unknown) {
        console.error("[DietPlan] Order creation error:", error);
        return NextResponse.json(
            { message: getErrorMessage(error) },
            { status: 500 }
        );
    }
}
