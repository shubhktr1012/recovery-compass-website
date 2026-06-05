type PeriskopeSendResult = {
    success: boolean;
    queueId?: string | null;
    error?: string;
    skipped?: boolean;
};

type SendDetoxWhatsAppParams = {
    phone: string;
    clientName: string;
    pdfUrl: string;
};

function normalizeWhatsAppNumber(rawPhone: string) {
    const digits = rawPhone.replace(/\D/g, "");
    const defaultCountryCode = (process.env.PERISKOPE_DEFAULT_COUNTRY_CODE || "91").replace(/\D/g, "");

    if (!digits) {
        return null;
    }

    if (digits.length === 10 && defaultCountryCode) {
        return `${defaultCountryCode}${digits}`;
    }

    return digits;
}

function getPeriskopeBaseUrl() {
    return (process.env.PERISKOPE_API_BASE_URL || "https://api.periskope.app/v1").replace(/\/$/, "");
}

export async function sendDetoxWhatsApp({
    phone,
    clientName,
    pdfUrl,
}: SendDetoxWhatsAppParams): Promise<PeriskopeSendResult> {
    const apiKey = process.env.PERISKOPE_API_KEY?.trim();
    const senderPhone = process.env.PERISKOPE_PHONE?.trim();

    if (!apiKey || !senderPhone) {
        return {
            success: false,
            skipped: true,
            error: "PERISKOPE_API_KEY or PERISKOPE_PHONE is not configured",
        };
    }

    const recipientPhone = normalizeWhatsAppNumber(phone);
    if (!recipientPhone) {
        return { success: false, error: "Invalid WhatsApp number" };
    }

    const safeName = clientName.trim() || "there";
    const message = [
        `Hi ${safeName}, your free 6-Day Detox Program from Recovery Compass is ready.`,
        "",
        `Download it here: ${pdfUrl}`,
        "",
        "Start with Day 1 today. If you have questions, reply here and our team will help.",
    ].join("\n");

    try {
        const response = await fetch(`${getPeriskopeBaseUrl()}/message/send`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "x-phone": senderPhone,
            },
            body: JSON.stringify({
                chat_id: `${recipientPhone}@c.us`,
                message,
                options: {
                    hide_url_preview: false,
                },
            }),
        });

        const responseBody = await response.json().catch(() => null) as
            | { queue_id?: string; queue_position?: number; error?: string; message?: string }
            | null;

        if (!response.ok) {
            return {
                success: false,
                error: responseBody?.error || responseBody?.message || `Periskope API error ${response.status}`,
            };
        }

        return {
            success: true,
            queueId: responseBody?.queue_id ?? null,
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown Periskope delivery error",
        };
    }
}
