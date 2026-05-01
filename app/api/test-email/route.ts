import { NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/lib/mail';

function getErrorMessage(error: unknown) {
    if (error instanceof Error) {
        return error.message;
    }

    return "Unknown error";
}

// IMPORTANT: Delete this file after testing!
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    // Grab the email from the URL, or default to a dummy if missing
    const emailToTest = searchParams.get('email');

    if (!emailToTest) {
        return NextResponse.json({ 
            success: false, 
            message: "Please provide an email parameter. Example: /api/test-email?email=yourname@gmail.com" 
        }, { status: 400 });
    }

    try {
        const result = await sendWelcomeEmail({
            to: emailToTest,
            customerName: "Pioneer Member",
            programName: "The Inner Circle Routine",
            amountFormatted: "₹4,999.00",
            orderId: "order_rc_demo_987",
            receiptDate: "2026-04-30",
        });

        if (!result.success) {
            return NextResponse.json({ success: false, error: result.error }, { status: 502 });
        }

        return NextResponse.json({ success: true, result });
    } catch (error: unknown) {
        return NextResponse.json({ success: false, error: getErrorMessage(error) }, { status: 500 });
    }
}
