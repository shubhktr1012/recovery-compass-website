import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { sendDetoxWhatsApp } from "@/lib/periskope";

const originalEnv = { ...process.env };

describe("sendDetoxWhatsApp", () => {
    beforeEach(() => {
        process.env = {
            ...originalEnv,
            PERISKOPE_API_KEY: "test-key",
            PERISKOPE_PHONE: "919740828889@c.us",
            PERISKOPE_API_BASE_URL: "https://api.periskope.test/v1",
            PERISKOPE_DEFAULT_COUNTRY_CODE: "91",
        };
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        process.env = { ...originalEnv };
    });

    it("sends the detox PDF as a document attachment with a clean caption", async () => {
        const fetchMock = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({ queue_id: "queue-123" }),
        });
        vi.stubGlobal("fetch", fetchMock);

        const pdfBuffer = Buffer.from("%PDF-1.4 test");
        const pdfUrl = "https://example.com/signed/very-long-detox-url";

        const result = await sendDetoxWhatsApp({
            phone: "+91 70899 83626",
            clientName: "Shubh Khatri",
            pdfUrl,
            pdfBuffer,
            pdfFilename: "RC-Detox-Program-Shubh-Khatri.pdf",
        });

        expect(result).toEqual({ success: true, queueId: "queue-123" });
        expect(fetchMock).toHaveBeenCalledTimes(1);

        const [url, init] = fetchMock.mock.calls[0];
        expect(url).toBe("https://api.periskope.test/v1/message/send");
        expect(init.headers).toMatchObject({
            Authorization: "Bearer test-key",
            "Content-Type": "application/json",
            "x-phone": "919740828889@c.us",
        });

        const body = JSON.parse(init.body as string);
        expect(body.chat_id).toBe("917089983626@c.us");
        expect(body.message).toContain("*Your Recovery Compass 6-Day Detox Program is ready.*");
        expect(body.message).toContain("I have attached the PDF here.");
        expect(body.message).not.toContain(pdfUrl);
        expect(body.options.hide_url_preview).toBe(true);
        expect(body.media).toEqual({
            type: "document",
            mimetype: "application/pdf",
            filename: "RC-Detox-Program-Shubh-Khatri.pdf",
            filedata: pdfBuffer.toString("base64"),
        });
    });

    it("falls back to a cleaner link message when no PDF buffer is available", async () => {
        const fetchMock = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({ queue_id: "queue-456" }),
        });
        vi.stubGlobal("fetch", fetchMock);

        const pdfUrl = "https://example.com/signed/fallback-detox-url";

        const result = await sendDetoxWhatsApp({
            phone: "7089983626",
            clientName: "Shubh Khatri",
            pdfUrl,
        });

        expect(result).toEqual({ success: true, queueId: "queue-456" });

        const body = JSON.parse(fetchMock.mock.calls[0][1].body as string);
        expect(body.media).toBeUndefined();
        expect(body.message).toContain("Open the PDF here:");
        expect(body.message).toContain(pdfUrl);
        expect(body.options.hide_url_preview).toBe(false);
    });
});
