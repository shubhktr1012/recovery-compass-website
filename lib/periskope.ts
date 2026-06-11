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
    pdfBuffer?: Buffer;
    pdfFilename?: string;
};

type PeriskopeRequestBody = {
    chat_id: string;
    message: string;
    media?: {
        type: "document";
        mimetype: "application/pdf";
        filename: string;
        filedata: string;
    };
    options: {
        hide_url_preview: boolean;
    };
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

function buildDetoxWhatsAppCaption(clientName: string, hasAttachment: boolean, pdfUrl: string) {
    const safeName = clientName.trim() || "there";

    if (hasAttachment) {
        return [
            `Hi ${safeName},`,
            "",
            "*Your Recovery Compass 6-Day Detox Program is ready.*",
            "",
            "I have attached the PDF here. Please print it before Day 1 so it is easier to follow the steps and tick the tracker through the week.",
            "",
            "Start with Day 1 today. Reply here if you need help.",
        ].join("\n");
    }

    return [
        `Hi ${safeName},`,
        "",
        "*Your Recovery Compass 6-Day Detox Program is ready.*",
        "",
        "Open the PDF here:",
        pdfUrl,
        "",
        "Please print it before Day 1 so it is easier to follow the steps and tick the tracker through the week.",
        "",
        "Reply here if you need help.",
    ].join("\n");
}

export async function sendDetoxWhatsApp({
    phone,
    clientName,
    pdfUrl,
    pdfBuffer,
    pdfFilename,
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

    const hasAttachment = Boolean(pdfBuffer?.length && pdfFilename?.trim());
    const message = buildDetoxWhatsAppCaption(clientName, hasAttachment, pdfUrl);
    const body: PeriskopeRequestBody = {
        chat_id: `${recipientPhone}@c.us`,
        message,
        options: {
            hide_url_preview: hasAttachment,
        },
    };

    if (hasAttachment && pdfBuffer && pdfFilename) {
        body.media = {
            type: "document",
            mimetype: "application/pdf",
            filename: pdfFilename,
            filedata: pdfBuffer.toString("base64"),
        };
    }

    try {
        const response = await fetch(`${getPeriskopeBaseUrl()}/message/send`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "x-phone": senderPhone,
            },
            body: JSON.stringify(body),
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
