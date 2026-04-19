import { Resend } from "resend";
import WelcomeReceiptEmail from "@/components/emails/WelcomeReceiptEmail";

// We initialize resend lazily inside the function to prevent build-time errors
// when the API key is missing.

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

    const resend = new Resend(process.env.RESEND_API_KEY);
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
    } catch (err: unknown) {
        console.error("[Mail] Exception sending welcome email:", err);
        // We log it but usually do not want to crash the main transaction flow
        // The webhook should still complete
    }
}

export interface SendOpsAlertEmailParams {
    subject: string;
    message: string;
}

export interface SendEnquiryNotificationEmailParams {
    name: string;
    email: string;
    phone?: string | null;
    message: string;
}

function getOpsRecipients() {
    const rawRecipients = process.env.COMMERCE_ALERT_EMAILS || process.env.ALERT_EMAIL;
    if (!rawRecipients) {
        return [];
    }

    return rawRecipients
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);
}

function getEnquiryRecipients() {
    const rawRecipients =
        process.env.ENQUIRY_ALERT_EMAILS ||
        process.env.COMMERCE_ALERT_EMAILS ||
        process.env.ALERT_EMAIL;

    if (!rawRecipients) {
        return [];
    }

    return rawRecipients
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);
}

export async function sendOpsAlertEmail({
    subject,
    message,
}: SendOpsAlertEmailParams) {
    const recipients = getOpsRecipients();

    if (!process.env.RESEND_API_KEY) {
        console.warn("[Mail] RESEND_API_KEY is not set. Ops alert email not sent.");
        return null;
    }

    if (recipients.length === 0) {
        console.warn("[Mail] COMMERCE_ALERT_EMAILS/ALERT_EMAIL not set. Ops alert email not sent.");
        return null;
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
        const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: recipients,
            subject,
            text: message,
        });

        if (error) {
            console.error("[Mail] Failed to send ops alert email via Resend:", error);
            return null;
        }

        return data;
    } catch (error) {
        console.error("[Mail] Exception sending ops alert email:", error);
        return null;
    }
}

export async function sendEnquiryNotificationEmail({
    name,
    email,
    phone,
    message,
}: SendEnquiryNotificationEmailParams) {
    const recipients = getEnquiryRecipients();

    if (!process.env.RESEND_API_KEY) {
        console.warn("[Mail] RESEND_API_KEY is not set. Enquiry notification email not sent.");
        return null;
    }

    if (recipients.length === 0) {
        console.warn("[Mail] ENQUIRY_ALERT_EMAILS/COMMERCE_ALERT_EMAILS/ALERT_EMAIL not set. Enquiry notification email not sent.");
        return null;
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
        const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: recipients,
            subject: `New website enquiry from ${name}`,
            text: [
                "A new enquiry was submitted on the website.",
                "",
                `Name: ${name}`,
                `Email: ${email}`,
                `Phone: ${phone || "Not provided"}`,
                "",
                "Message:",
                message,
            ].join("\n"),
        });

        if (error) {
            console.error("[Mail] Failed to send enquiry notification email via Resend:", error);
            return null;
        }

        return data;
    } catch (error) {
        console.error("[Mail] Exception sending enquiry notification email:", error);
        return null;
    }
}
