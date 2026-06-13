import { Resend } from "resend";
import AppPurchaseWelcomeEmail from "@/components/emails/AppPurchaseWelcomeEmail";
import WelcomeReceiptEmail from "@/components/emails/WelcomeReceiptEmail";
import { APP_STORE_BADGE_URL, APP_STORE_URL, PLAY_STORE_BADGE_URL, PLAY_STORE_URL } from "@/lib/constants";
import { CANONICAL_PROGRAM_DISPLAY_NAMES } from "@/lib/public-programs";

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

function getProgramDisplayName(programSlug: string) {
    if (programSlug in CANONICAL_PROGRAM_DISPLAY_NAMES) {
        return CANONICAL_PROGRAM_DISPLAY_NAMES[programSlug as keyof typeof CANONICAL_PROGRAM_DISPLAY_NAMES];
    }

    return "Recovery Compass Program";
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
    lineItems?: Array<{
        title: string;
        amountFormatted: string;
    }>;
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
    lineItems,
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
                lineItems,
                amountFormatted,
                orderId,
                receiptDate,
                // Replace with dynamic links from DB later if needed; hardcoded for Phase 1.
                whatsappLink: "https://chat.whatsapp.com/GgW0StdlYGB4FG4EqfgGv0",
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

export interface SendDietPlanEmailParams {
    to: string;
    clientName: string;
    pdfBuffer: Buffer;
    pdfFilename: string;
}

function getDietPlanScheduledAt() {
    const delayMinutes = Number.parseInt(process.env.DIET_PLAN_EMAIL_DELAY_MINUTES ?? "35", 10);
    const safeDelayMinutes = Number.isFinite(delayMinutes) && delayMinutes >= 0 ? delayMinutes : 35;

    if (safeDelayMinutes === 0) {
        return undefined;
    }

    return new Date(Date.now() + safeDelayMinutes * 60 * 1000).toISOString();
}

export async function sendDietPlanEmail({
    to,
    clientName,
    pdfBuffer,
    pdfFilename,
}: SendDietPlanEmailParams): Promise<MailSendResult> {
    const resend = getResendClient();

    if (!resend) {
        console.warn("[Mail] RESEND_API_KEY is not set. Diet plan email not sent.");
        return { success: false, error: "RESEND_API_KEY is not set" };
    }

    const base64Pdf = pdfBuffer.toString("base64");

    try {
        const scheduledAt = getDietPlanScheduledAt();
        const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: [to],
            subject: `${clientName}, your personalised Recovery Compass diet plan is ready`,
            ...(scheduledAt ? { scheduledAt } : {}),
            html: `
<div style="font-family: 'Inter', system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; color: #1a1a1a;">

  <div style="margin-bottom: 24px;">
    <p style="font-size: 13px; letter-spacing: 1px; text-transform: uppercase; color: #3D7A4A; margin: 0 0 8px;">Recovery Compass</p>
    <h1 style="font-size: 22px; font-weight: 600; color: #06290C; margin: 0 0 6px; line-height: 1.3;">Your personalised diet plan is ready, ${clientName}.</h1>
    <p style="font-size: 14px; color: #666; margin: 0;">Find it attached as a PDF.</p>
  </div>

  <div style="background: #EBF4EC; border-radius: 8px; padding: 16px 20px; margin-bottom: 24px;">
    <p style="font-size: 13px; color: #06290C; margin: 0 0 6px; font-weight: 500;">A few things to know before you begin:</p>
    <ul style="font-size: 13px; color: #444; margin: 0; padding-left: 18px; line-height: 1.7;">
      <li>The plan is built entirely around your regional foods and eating habits.</li>
      <li>Start with one meal — usually breakfast — and build from there.</li>
      <li>The 7-day planner at the end is a guide, not a rigid schedule.</li>
      <li>This is a wellness plan. Please consult your doctor before making major dietary changes, especially if you have any injuries or allergies.</li>
    </ul>
  </div>

  <p style="font-size: 13px; color: #444; margin: 0 0 16px;">
    If you have questions about the plan, or if anything doesn't look right for your situation, you can reach us at
    <a href="https://chat.whatsapp.com/GgW0StdlYGB4FG4EqfgGv0" style="color: #3D7A4A; text-decoration: none;">WhatsApp</a>.
  </p>

  <div style="background: #F5FAF8; border: 1px solid #d8e8da; border-radius: 10px; padding: 16px 18px; margin: 0 0 24px;">
    <p style="font-size: 13px; color: #06290C; margin: 0 0 12px; font-weight: 600;">Use Recovery Compass on your phone</p>
    <a href="${APP_STORE_URL}" style="display: inline-block; margin-right: 10px;">
      <img src="${APP_STORE_BADGE_URL}" width="132" alt="Download on the App Store" style="display: block; border: 0;" />
    </a>
    <a href="${PLAY_STORE_URL}" style="display: inline-block;">
      <img src="${PLAY_STORE_BADGE_URL}" width="148" alt="Get it on Google Play" style="display: block; border: 0;" />
    </a>
  </div>

  <p style="font-size: 13px; color: #888; border-top: 1px solid #d8e8da; padding-top: 16px; margin: 0;">
    Recovery Compass · Guided Wellness<br>
    <span style="font-size: 11px;">This plan is for educational purposes only and does not constitute medical advice.</span>
  </p>

</div>
            `.trim(),
            attachments: [
                {
                    filename: pdfFilename,
                    content: base64Pdf,
                },
            ],
        });

        if (error) {
            console.error("[Mail] Failed to send diet plan email via Resend:", error);
            return { success: false, error: error.message };
        }

        console.log(
            `[Mail] Diet plan email ${scheduledAt ? `scheduled for ${scheduledAt}` : "sent"} to ${to}. Email ID: ${data?.id}`
        );
        return { success: true, id: data?.id ?? null };
    } catch (err: unknown) {
        console.error("[Mail] Exception sending diet plan email:", err);
        return {
            success: false,
            error: err instanceof Error ? err.message : "Unknown email exception",
        };
    }
}
