import { Resend } from "resend";
import WelcomeReceiptEmail from "@/components/emails/WelcomeReceiptEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

// User's verified sending domain handle or test handle
// NOTE: Until you verify your domain in Resend, you MUST use onboarding@resend.dev
const FROM_EMAIL = process.env.NEXT_PUBLIC_FROM_EMAIL || "onboarding@resend.dev";

export interface SendWelcomeEmailParams {
    to: string;
    customerName: string;
    programName: string;
    amountFormatted: string;
    orderId: string;
}

/**
 * Dispatches the Welcome + Receipt email via Resend.
 */
export async function sendWelcomeEmail({
    to,
    customerName,
    programName,
    amountFormatted,
    orderId,
}: SendWelcomeEmailParams) {
    if (!process.env.RESEND_API_KEY) {
        console.warn("[Mail] RESEND_API_KEY is not set. Email not sent.");
        return null;
    }

    try {
        const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: [to],
            // Set subjective to something exciting
            subject: "Welcome to the Inner Circle. This is your new beginning.",
            react: WelcomeReceiptEmail({
                customerName,
                programName,
                amountFormatted,
                orderId,
                // Replace with Dynamic Links from DB later if needed, harding for Phase 1
                whatsappLink: "https://chat.whatsapp.com/GgW0StdlYGB4FG4EqfgGv0",
                calendlyLink: "https://calendly.com/anjan-recoverycompass/30min", 
            }),
        });

        if (error) {
            console.error("[Mail] Failed to send welcome email via Resend:", error);
            throw new Error(`Resend Mail Error: ${error.message}`);
        }

        console.log(`[Mail] Welcome email sent successfully to ${to}. Email ID: ${data?.id}`);
        return data;
    } catch (err: any) {
        console.error("[Mail] Exception sending welcome email:", err);
        // We log it but usually do not want to crash the main transaction flow
        // The webhook should still complete
    }
}
