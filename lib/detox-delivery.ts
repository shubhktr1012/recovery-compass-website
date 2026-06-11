import { supabaseAdmin } from "@/lib/supabase-admin";
import { generatePdf } from "@/lib/pdf-generator";
import { renderDetoxHtml } from "@/lib/detox-pdf-template";
import { sendDetoxEmail } from "@/lib/mail";
import { sendDetoxWhatsApp } from "@/lib/periskope";

const DEFAULT_PRIMARY_FOCUS = "General Wellness";
const PDF_BUCKET = process.env.DETOX_PDF_BUCKET || "detox-pdfs";
const PDF_SIGNED_URL_SECONDS = Number.parseInt(process.env.DETOX_PDF_SIGNED_URL_SECONDS || "", 10) || 60 * 60 * 24 * 14;

type DetoxLeadRecord = {
    id: string;
    name: string;
    email: string;
    phone: string;
    primary_focus: string;
    source: string;
    email_consent?: boolean | null;
    whatsapp_consent?: boolean | null;
    lead_stage?: string | null;
    overall_status?: string | null;
    completed_at?: string | null;
};

type CreateDetoxLeadParams = {
    name: string;
    email: string;
    phone: string;
    source: string;
    emailConsent?: boolean;
    whatsappConsent?: boolean;
};

type CompleteDetoxLeadParams = {
    leadId: string;
    primaryFocus: string;
    questionnaireData: Record<string, unknown>;
};

type DeliverDetoxProgramParams = {
    lead: DetoxLeadRecord;
    primaryFocus: string;
    questionnaireData: Record<string, unknown>;
};

function sanitizeFilenamePart(value: string) {
    return value
        .trim()
        .replace(/[^a-z0-9-]+/gi, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 60) || "Client";
}

function getPdfExpiresAt() {
    return new Date(Date.now() + PDF_SIGNED_URL_SECONDS * 1000).toISOString();
}

function getOverallStatus(emailSuccess: boolean, whatsappSuccess: boolean) {
    if (emailSuccess && whatsappSuccess) {
        return "delivered";
    }

    if (emailSuccess || whatsappSuccess) {
        return "partially_delivered";
    }

    return "failed";
}

export function isValidDetoxEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function normalizeDetoxContactString(value: unknown) {
    return String(value ?? "").trim();
}

export function normalizeDetoxPhoneInput(phone: unknown, countryCode?: unknown) {
    const rawPhone = normalizeDetoxContactString(phone);
    const phoneDigits = rawPhone.replace(/\D/g, "");
    const countryDigits = normalizeDetoxContactString(countryCode).replace(/\D/g, "");

    if (!phoneDigits) {
        return "";
    }

    if (rawPhone.startsWith("+") || !countryDigits || phoneDigits.startsWith(countryDigits)) {
        return `+${phoneDigits}`;
    }

    return `+${countryDigits}${phoneDigits}`;
}

export function normalizeDetoxEmail(value: unknown) {
    return normalizeDetoxContactString(value).toLowerCase();
}

export function getDetoxQuestionnaireData(value: unknown): Record<string, unknown> {
    return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

export async function consumeDetoxRateLimit(identifier: string) {
    const safeIdentifier = identifier.trim().toLowerCase();
    if (!safeIdentifier) {
        return true;
    }

    const { data, error } = await supabaseAdmin.rpc("consume_rate_limit", {
        p_bucket: "detox_submit",
        p_identifier: safeIdentifier,
        p_max_requests: 6,
        p_window_seconds: 60 * 60,
    });

    if (error) {
        console.warn("[Detox] Rate limit check failed; allowing request.", error);
        return true;
    }

    const result = Array.isArray(data) ? data[0] : data;
    return Boolean(result?.allowed ?? true);
}

export async function createDetoxLead({
    name,
    email,
    phone,
    source,
    emailConsent = true,
    whatsappConsent = true,
}: CreateDetoxLeadParams) {
    const { data, error } = await supabaseAdmin
        .from("detox_leads")
        .insert({
            name,
            email,
            phone,
            primary_focus: DEFAULT_PRIMARY_FOCUS,
            questionnaire_data: { status: "pending_questionnaire" },
            source,
            email_consent: emailConsent,
            whatsapp_consent: whatsappConsent,
            lead_stage: "contact_captured",
            email_status: emailConsent ? "pending" : "skipped",
            whatsapp_status: whatsappConsent ? "pending" : "skipped",
            overall_status: "lead_created",
            updated_at: new Date().toISOString(),
        })
        .select("id")
        .single();

    if (error) {
        throw new Error(`Failed to save detox lead: ${error.message}`);
    }

    return data.id as string;
}

async function getDetoxLead(leadId: string) {
    const { data, error } = await supabaseAdmin
        .from("detox_leads")
        .select("id, name, email, phone, primary_focus, source, email_consent, whatsapp_consent, lead_stage, overall_status, completed_at")
        .eq("id", leadId)
        .single();

    if (error || !data) {
        throw new Error(error?.message || "Detox lead was not found");
    }

    return data as DetoxLeadRecord;
}

function assertDetoxLeadCanBeCompleted(lead: DetoxLeadRecord) {
    const deliveredStatuses = new Set(["delivered", "partially_delivered"]);

    if (
        lead.completed_at ||
        lead.lead_stage === "questionnaire_completed" ||
        lead.lead_stage === "delivery_processing" ||
        (lead.overall_status ? deliveredStatuses.has(lead.overall_status) : false)
    ) {
        throw new Error("This detox lead has already been completed.");
    }
}

async function claimDetoxLeadForCompletion(leadId: string) {
    const { data, error } = await supabaseAdmin
        .from("detox_leads")
        .update({
            lead_stage: "delivery_processing",
            updated_at: new Date().toISOString(),
        })
        .eq("id", leadId)
        .is("completed_at", null)
        .or("lead_stage.is.null,lead_stage.eq.contact_captured")
        .select("id")
        .single();

    if (error || !data) {
        throw new Error("This detox lead has already been completed.");
    }
}

async function releaseDetoxLeadCompletionClaim(leadId: string) {
    const { error } = await supabaseAdmin
        .from("detox_leads")
        .update({
            lead_stage: "contact_captured",
            updated_at: new Date().toISOString(),
        })
        .eq("id", leadId)
        .eq("lead_stage", "delivery_processing")
        .is("completed_at", null);

    if (error) {
        console.warn(`[Detox] Failed to release completion claim for lead ${leadId}:`, error);
    }
}

async function uploadDetoxPdf({
    leadId,
    pdfBuffer,
    pdfFilename,
}: {
    leadId: string;
    pdfBuffer: Buffer;
    pdfFilename: string;
}) {
    const storagePath = `leads/${leadId}/${pdfFilename}`;
    const { error: uploadError } = await supabaseAdmin.storage
        .from(PDF_BUCKET)
        .upload(storagePath, pdfBuffer, {
            contentType: "application/pdf",
            upsert: true,
        });

    if (uploadError) {
        throw new Error(`Failed to upload detox PDF: ${uploadError.message}`);
    }

    const { data: signedUrlData, error: signedUrlError } = await supabaseAdmin.storage
        .from(PDF_BUCKET)
        .createSignedUrl(storagePath, PDF_SIGNED_URL_SECONDS);

    if (signedUrlError || !signedUrlData?.signedUrl) {
        throw new Error(`Failed to create detox PDF link: ${signedUrlError?.message || "No signed URL returned"}`);
    }

    return {
        storagePath,
        signedUrl: signedUrlData.signedUrl,
        expiresAt: getPdfExpiresAt(),
    };
}

export async function deliverDetoxProgram({
    lead,
    primaryFocus,
    questionnaireData,
}: DeliverDetoxProgramParams) {
    const html = renderDetoxHtml(lead.name, primaryFocus, questionnaireData);
    const pdfBuffer = await generatePdf(html);
    const pdfFilename = `RC-Detox-Program-${sanitizeFilenamePart(lead.name)}.pdf`;
    let pdfStoragePath: string | null = null;
    let pdfUrl: string | null = null;
    let pdfUrlExpiresAt: string | null = null;
    let pdfLastError: string | null = null;

    try {
        const storedPdf = await uploadDetoxPdf({
            leadId: lead.id,
            pdfBuffer,
            pdfFilename,
        });
        pdfStoragePath = storedPdf.storagePath;
        pdfUrl = storedPdf.signedUrl;
        pdfUrlExpiresAt = storedPdf.expiresAt;
    } catch (error) {
        pdfLastError = error instanceof Error ? error.message : "Unknown PDF storage error";
        console.error("[Detox] PDF storage failed:", error);
    }

    const shouldEmail = lead.email_consent !== false;
    const shouldWhatsApp = lead.whatsapp_consent !== false && Boolean(pdfUrl);

    const emailResult = shouldEmail
        ? await sendDetoxEmail({
            to: lead.email,
            clientName: lead.name,
            pdfBuffer,
            pdfFilename,
            pdfUrl,
        })
        : { success: false, error: "Email consent not granted" };

    const whatsappResult = shouldWhatsApp
        ? await sendDetoxWhatsApp({
            phone: lead.phone,
            clientName: lead.name,
            pdfUrl: pdfUrl!,
            pdfBuffer,
            pdfFilename,
        })
        : { success: false, skipped: true, error: pdfLastError || "WhatsApp consent not granted or PDF link unavailable" };

    const emailSuccess = emailResult.success;
    const whatsappSuccess = whatsappResult.success;
    const overallStatus = getOverallStatus(emailSuccess, whatsappSuccess);

    const { error: updateError } = await supabaseAdmin
        .from("detox_leads")
        .update({
            primary_focus: primaryFocus,
            questionnaire_data: questionnaireData,
            lead_stage: "questionnaire_completed",
            pdf_storage_path: pdfStoragePath,
            pdf_url_expires_at: pdfUrlExpiresAt,
            email_status: emailSuccess ? "sent" : "failed",
            email_provider_id: emailResult.id ?? null,
            email_last_error: emailSuccess ? null : emailResult.error ?? null,
            whatsapp_status: whatsappSuccess ? "queued" : whatsappResult.skipped ? "skipped" : "failed",
            whatsapp_queue_id: whatsappResult.queueId ?? null,
            whatsapp_last_error: whatsappSuccess ? null : whatsappResult.error ?? null,
            overall_status: overallStatus,
            completed_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        })
        .eq("id", lead.id);

    if (updateError) {
        console.error(`[Detox] Database update failed for lead ${lead.id}:`, updateError);
    }

    if (!emailSuccess && !whatsappSuccess) {
        throw new Error(emailResult.error || whatsappResult.error || "Both delivery channels failed");
    }

    return {
        emailSent: emailSuccess,
        whatsappQueued: whatsappSuccess,
        overallStatus,
    };
}

export async function completeDetoxLead({
    leadId,
    primaryFocus,
    questionnaireData,
}: CompleteDetoxLeadParams) {
    const lead = await getDetoxLead(leadId);
    assertDetoxLeadCanBeCompleted(lead);
    await claimDetoxLeadForCompletion(lead.id);

    try {
        return await deliverDetoxProgram({
            lead,
            primaryFocus,
            questionnaireData,
        });
    } catch (error) {
        await releaseDetoxLeadCompletionClaim(lead.id);
        throw error;
    }
}
