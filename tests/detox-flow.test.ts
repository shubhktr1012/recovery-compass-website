import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    createDetoxLead: vi.fn(),
    completeDetoxLead: vi.fn(),
    deliverDetoxProgram: vi.fn(),
    consumeDetoxRateLimit: vi.fn(),
    getUser: vi.fn(),
    from: vi.fn(),
    select: vi.fn(),
    eq: vi.fn(),
    single: vi.fn(),
}));

vi.mock("@/lib/detox-delivery", async () => {
    const actual = await vi.importActual<typeof import("@/lib/detox-delivery")>("@/lib/detox-delivery");
    return {
        ...actual,
        createDetoxLead: mocks.createDetoxLead,
        completeDetoxLead: mocks.completeDetoxLead,
        deliverDetoxProgram: mocks.deliverDetoxProgram,
        consumeDetoxRateLimit: mocks.consumeDetoxRateLimit,
    };
});

vi.mock("@/lib/supabase-server", () => ({
    createSupabaseServerClient: vi.fn().mockResolvedValue({
        auth: {
            getUser: mocks.getUser,
        },
    }),
}));

vi.mock("@/lib/supabase-admin", () => ({
    getSupabaseAdmin: () => ({
        from: mocks.from,
    }),
    supabaseAdmin: {
        from: mocks.from,
    },
}));

import { POST as submitRoute } from "@/app/api/detox/submit/route";
import { POST as claimBonusRoute } from "@/app/api/detox/claim-bonus/route";

function jsonRequest(body: Record<string, unknown>) {
    return {
        json: async () => body,
    } as Request;
}

describe("Detox Funnel API Endpoints", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        mocks.createDetoxLead.mockResolvedValue("lead-123");
        mocks.completeDetoxLead.mockResolvedValue({
            emailSent: true,
            whatsappQueued: true,
            overallStatus: "delivered",
        });
        mocks.deliverDetoxProgram.mockResolvedValue({
            emailSent: true,
            whatsappQueued: false,
            overallStatus: "partially_delivered",
        });
        mocks.consumeDetoxRateLimit.mockResolvedValue(true);

        mocks.getUser.mockResolvedValue({
            data: {
                user: {
                    id: "user_123",
                    email: "user@example.com",
                    user_metadata: {
                        full_name: "Jane Doe",
                    },
                },
            },
            error: null,
        });

        mocks.from.mockReturnValue({
            select: mocks.select,
        });
        mocks.select.mockReturnValue({
            eq: mocks.eq,
        });
        mocks.eq.mockReturnValue({
            single: mocks.single,
        });
        mocks.single.mockResolvedValue({
            data: { full_name: "Jane Doe Profile", display_name: "Jane" },
            error: null,
        });
    });

    describe("POST /api/detox/submit", () => {
        it("creates a lead from contact details before questionnaire completion", async () => {
            const response = await submitRoute(jsonRequest({
                action: "create_lead",
                name: "John Doe",
                email: "john@example.com",
                countryCode: "+91",
                phone: "99999 99999",
                source: "homepage_modal",
            }));

            expect(response.status).toBe(200);
            await expect(response.json()).resolves.toEqual({ success: true, leadId: "lead-123" });
            expect(mocks.createDetoxLead).toHaveBeenCalledWith({
                name: "John Doe",
                email: "john@example.com",
                phone: "+919999999999",
                source: "homepage_modal",
                emailConsent: true,
                whatsappConsent: true,
            });
        });

        it("rejects lead creation with invalid email", async () => {
            const response = await submitRoute(jsonRequest({
                action: "create_lead",
                name: "John Doe",
                email: "bad-email",
                phone: "+919999999999",
            }));

            expect(response.status).toBe(400);
            const data = await response.json();
            expect(data.error).toContain("valid email");
            expect(mocks.createDetoxLead).not.toHaveBeenCalled();
        });

        it("completes questionnaire and returns delivery status when either channel succeeds", async () => {
            const response = await submitRoute(jsonRequest({
                action: "complete_questionnaire",
                leadId: "lead-123",
                primaryFocus: "More Energy",
                questionnaireData: { tried_detox: "No" },
            }));

            expect(response.status).toBe(200);
            const data = await response.json();
            expect(data.success).toBe(true);
            expect(data.emailSent).toBe(true);
            expect(data.whatsappQueued).toBe(true);
            expect(data).not.toHaveProperty("pdfBase64");
            expect(mocks.completeDetoxLead).toHaveBeenCalledWith({
                leadId: "lead-123",
                primaryFocus: "More Energy",
                questionnaireData: { tried_detox: "No" },
            });
        });

        it("keeps backward-compatible single-step submissions", async () => {
            const response = await submitRoute(jsonRequest({
                name: "John Doe",
                email: "john@example.com",
                countryCode: "+91",
                phone: "99999 99999",
                primaryFocus: "More Energy",
                questionnaireData: { tried_detox: "No" },
            }));

            expect(response.status).toBe(200);
            const data = await response.json();
            expect(data.success).toBe(true);
            expect(data.leadId).toBe("lead-123");
            expect(data).not.toHaveProperty("pdfBase64");
            expect(mocks.createDetoxLead).toHaveBeenCalledWith({
                name: "John Doe",
                email: "john@example.com",
                phone: "+919999999999",
                source: "homepage_modal",
                emailConsent: true,
                whatsappConsent: true,
            });
            expect(mocks.deliverDetoxProgram).toHaveBeenCalledWith(expect.objectContaining({
                lead: expect.objectContaining({
                    phone: "+919999999999",
                }),
            }));
        });
    });

    describe("POST /api/detox/claim-bonus", () => {
        it("rejects unauthorized users", async () => {
            mocks.getUser.mockResolvedValueOnce({
                data: { user: null },
                error: new Error("Auth session missing"),
            });

            const response = await claimBonusRoute(jsonRequest({
                phone: "+919999999999",
                primaryFocus: "More Energy",
            }));

            expect(response.status).toBe(401);
            await expect(response.json()).resolves.toEqual({ error: "Unauthorized" });
        });

        it("accepts authorized claims and uses the shared delivery path", async () => {
            const response = await claimBonusRoute(jsonRequest({
                countryCode: "+91",
                phone: "99999 99999",
                primaryFocus: "More Energy",
                questionnaireData: { source: "checkout_success" },
            }));

            expect(response.status).toBe(200);
            const data = await response.json();
            expect(data.success).toBe(true);
            expect(data.emailSent).toBe(true);
            expect(data).not.toHaveProperty("pdfBase64");
            expect(mocks.createDetoxLead).toHaveBeenCalledWith({
                name: "Jane Doe Profile",
                email: "user@example.com",
                phone: "+919999999999",
                source: "checkout_success",
                emailConsent: true,
                whatsappConsent: true,
            });
            expect(mocks.deliverDetoxProgram).toHaveBeenCalled();
        });
    });
});
