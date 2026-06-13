import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    from: vi.fn(),
    generatePdf: vi.fn(),
    sendDetoxEmail: vi.fn(),
    sendDetoxWhatsApp: vi.fn(),
}));

vi.mock("@/lib/supabase-admin", () => ({
    supabaseAdmin: {
        from: mocks.from,
        storage: {
            from: vi.fn(),
        },
    },
}));

vi.mock("@/lib/pdf-generator", () => ({
    generatePdf: mocks.generatePdf,
}));

vi.mock("@/lib/mail", () => ({
    sendDetoxEmail: mocks.sendDetoxEmail,
}));

vi.mock("@/lib/periskope", () => ({
    sendDetoxWhatsApp: mocks.sendDetoxWhatsApp,
}));

import { completeDetoxLead } from "@/lib/detox-delivery";

function mockDetoxLead(data: Record<string, unknown>) {
    mocks.from.mockReturnValue({
        select: () => ({
            eq: () => ({
                single: async () => ({ data, error: null }),
            }),
        }),
    });
}

describe("completeDetoxLead", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("does not regenerate or redeliver a completed detox lead", async () => {
        mockDetoxLead({
            id: "lead-123",
            name: "Mira",
            email: "mira@example.com",
            phone: "+919999999999",
            primary_focus: "Gut Health",
            source: "homepage_modal",
            email_consent: true,
            whatsapp_consent: true,
            lead_stage: "questionnaire_completed",
            overall_status: "delivered",
            completed_at: "2026-06-10T10:00:00.000Z",
        });

        await expect(completeDetoxLead({
            leadId: "lead-123",
            primaryFocus: "Gut Health",
            questionnaireData: { health_conditions: ["Pregnant"] },
        })).rejects.toThrow("This detox lead has already been completed.");

        expect(mocks.generatePdf).not.toHaveBeenCalled();
        expect(mocks.sendDetoxEmail).not.toHaveBeenCalled();
        expect(mocks.sendDetoxWhatsApp).not.toHaveBeenCalled();
    });
});
