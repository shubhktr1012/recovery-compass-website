import { Resend } from "resend";
import AppPurchaseWelcomeEmail from "@/components/emails/AppPurchaseWelcomeEmail";
import WelcomeReceiptEmail from "@/components/emails/WelcomeReceiptEmail";

// We initialize resend lazily inside the function to prevent build-time errors
// when the API key is missing.

// NOTE: `NEXT_PUBLIC_FROM_EMAIL` remains only as a temporary fallback for older
// local environments. New deployments should use server-only `FROM_EMAIL`.
const FROM_EMAIL =
    process.env.FROM_EMAIL ||
    process.env.NEXT_PUBLIC_FROM_EMAIL ||
    "onboarding@resend.dev";

type MailSendResult = {
    success: boolean;
    id?: string | null;
    error?: string;
};

const PROGRAM_DISPLAY_NAMES: Record<string, string> = {
    six_day_reset: "6-Day Compass Reset",
    ninety_day_transform: "90-Day Smoke-Free Journey",
    sleep_disorder_reset: "21-Day Deep Sleep Reset",
    energy_vitality: "14-Day Energy Restore",
    age_reversal: "Radiance Journey",
    male_sexual_health: "Men's Vitality Reset Program",
};

function getProgramDisplayName(programSlug: string) {
    return PROGRAM_DISPLAY_NAMES[programSlug] || "Recovery Compass Program";
}

function getResendClient() {
    if (!process.env.RESEND_API_KEY) {
        return null;
    }

    return new Resend(process.env.RESEND_API_KEY);
}

export interface SendWelcomeEmailParams {
    to: string;
    customerName: string;
    programName: string;
    amountFormatted: string;
    orderId: string;
    receiptDate?: string;
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
    receiptDate,
}: SendWelcomeEmailParams) {
    const resend = getResendClient();

    if (!resend) {
        console.warn("[Mail] RESEND_API_KEY is not set. Email not sent.");
        return { success: false, error: "RESEND_API_KEY is not set" } satisfies MailSendResult;
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
                receiptDate,
                // Replace with Dynamic Links from DB later if needed, harding for Phase 1
                whatsappLink: "https://chat.whatsapp.com/GgW0StdlYGB4FG4EqfgGv0",
                calendlyLink: "https://calendly.com/anjan-recoverycompass/30min", 
            }),
        });

        if (error) {
            console.error("[Mail] Failed to send welcome email via Resend:", error);
            return { success: false, error: error.message } satisfies MailSendResult;
        }

        console.log(`[Mail] Welcome email sent successfully to ${to}. Email ID: ${data?.id}`);
        return { success: true, id: data?.id ?? null } satisfies MailSendResult;
    } catch (err: unknown) {
        console.error("[Mail] Exception sending welcome email:", err);
        return {
            success: false,
            error: err instanceof Error ? err.message : "Unknown email exception",
        } satisfies MailSendResult;
    }
}

export interface SendAppPurchaseWelcomeEmailParams {
    to: string;
    customerName: string;
    programSlug: string;
    store?: string | null;
}

export async function sendAppPurchaseWelcomeEmail({
    to,
    customerName,
    programSlug,
    store,
}: SendAppPurchaseWelcomeEmailParams) {
    const resend = getResendClient();

    if (!resend) {
        console.warn("[Mail] RESEND_API_KEY is not set. App purchase email not sent.");
        return { success: false, error: "RESEND_API_KEY is not set" } satisfies MailSendResult;
    }

    try {
        const programName = getProgramDisplayName(programSlug);
        const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: [to],
            subject: `Your ${programName} is unlocked`,
            react: AppPurchaseWelcomeEmail({
                customerName,
                programName,
                store,
                whatsappLink: "https://chat.whatsapp.com/GgW0StdlYGB4FG4EqfgGv0",
                calendlyLink: "https://calendly.com/anjan-recoverycompass/30min",
            }),
        });

        if (error) {
            console.error("[Mail] Failed to send app purchase welcome email via Resend:", error);
            return { success: false, error: error.message } satisfies MailSendResult;
        }

        console.log(`[Mail] App purchase welcome email sent successfully to ${to}. Email ID: ${data?.id}`);
        return { success: true, id: data?.id ?? null } satisfies MailSendResult;
    } catch (err: unknown) {
        console.error("[Mail] Exception sending app purchase welcome email:", err);
        return {
            success: false,
            error: err instanceof Error ? err.message : "Unknown email exception",
        } satisfies MailSendResult;
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

    const resend = getResendClient();

    if (!resend) {
        return null;
    }

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

    const resend = getResendClient();

    if (!resend) {
        return null;
    }

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
