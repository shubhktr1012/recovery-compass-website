import { NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/lib/mail';

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
        });

        return NextResponse.json({ success: true, result });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
