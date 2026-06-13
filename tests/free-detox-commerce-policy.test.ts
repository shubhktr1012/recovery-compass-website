import { describe, expect, it, vi, beforeEach } from "vitest";

const mocks = vi.hoisted(() => {
  const from = vi.fn();
  return {
    from,
  };
});

vi.mock("@/lib/supabase-admin", () => ({
  supabaseAdmin: {
    from: mocks.from,
  },
}));

import {
  appOnlyPrograms,
  publicCatalogPrograms,
  checkoutPrograms,
} from "@/lib/public-programs";
import { canonicalizeProgramSlug, canonicalizeTransactionItems } from "@/lib/commerce";
import { PROGRAM_OPTIONS } from "@/lib/program-access";
import { POST as handleProgramGrant } from "@/app/api/internal/program-grants/route";
import { getOnboardingResolution, createInitialOnboardingAnswers } from "@/lib/recovery-profile";

function buildRequest(body: unknown) {
  return new Request("http://localhost/api/internal/program-grants", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

describe("Free Detox and Launch Commerce Policy", () => {
  beforeEach(() => {
    process.env.PROGRAM_GRANTS_ADMIN_SECRET = "test_admin_secret";
    mocks.from.mockReset();
  });

  describe("1. Website Catalog Presence & Pricing for Free Detox", () => {
    it("keeps free_detox_reset out of public website catalog and excludes legacy programs", () => {
      const catalogSlugs = publicCatalogPrograms.map((p) => p.dbSlug);
      
      expect(catalogSlugs).not.toContain("free_detox_reset");
      expect(catalogSlugs).not.toContain("six_day_reset");
      expect(catalogSlugs).not.toContain("ninety_day_transform");
    });

    it("defines Free Detox as app-only free and with null priceInr", () => {
      const freeDetox = appOnlyPrograms.find((p) => p.dbSlug === "free_detox_reset");
      expect(freeDetox).toBeDefined();
      expect(freeDetox!.availability).toBe("app_only_free");
      expect(freeDetox!.priceInr).toBeNull();
      expect(freeDetox!.priceLabel).toBe("Free in the app");
    });

    it("verifies the new paid programs are marked for paid_checkout", () => {
      const smokingQuit = publicCatalogPrograms.find((p) => p.dbSlug === "smoking_alcohol_quit");
      expect(smokingQuit).toBeDefined();
      expect(smokingQuit!.availability).toBe("paid_checkout");
      expect(smokingQuit!.priceInr).toBe(5999);

      const gutReset = publicCatalogPrograms.find((p) => p.dbSlug === "gut_health_reset");
      expect(gutReset).toBeDefined();
      expect(gutReset!.availability).toBe("paid_checkout");
      expect(gutReset!.priceInr).toBe(4999);
    });
  });

  describe("2. Checkout Normalization Policy", () => {
    it("rejects free detox and legacy programs in checkout mode", () => {
      expect(canonicalizeProgramSlug("free_detox_reset", { forCheckout: true })).toBeNull();
      expect(canonicalizeProgramSlug("six_day_reset", { forCheckout: true })).toBeNull();
      expect(canonicalizeProgramSlug("ninety_day_transform", { forCheckout: true })).toBeNull();

      expect(
        canonicalizeTransactionItems(
          [{ program_slug: "free_detox_reset" }, { program_slug: "six_day_reset" }],
          { forCheckout: true }
        )
      ).toEqual([]);
    });

    it("accepts active paid programs in checkout mode", () => {
      expect(canonicalizeProgramSlug("smoking_alcohol_quit", { forCheckout: true })).toBe("smoking_alcohol_quit");
      expect(canonicalizeProgramSlug("gut_health_reset", { forCheckout: true })).toBe("gut_health_reset");
    });
  });

  describe("3. Admin Program Grant Restrictions", () => {
    it("excludes free_detox_reset from PROGRAM_OPTIONS list", () => {
      const optionSlugs = PROGRAM_OPTIONS.map((opt) => opt.slug);
      expect(optionSlugs).not.toContain("free_detox_reset");
      // But legacy programs should still be grantable for support compatibility
      expect(optionSlugs).toContain("six_day_reset");
      expect(optionSlugs).toContain("ninety_day_transform");
    });

    it("rejects POST grants for free_detox_reset", async () => {
      const response = await handleProgramGrant(
        buildRequest({
          adminSecret: "test_admin_secret",
          email: "test@example.com",
          programSlug: "free_detox_reset",
        })
      );

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data).toEqual({ success: false, error: "Invalid program slug" });
      expect(mocks.from).not.toHaveBeenCalled();
    });

    it("allows POST grants for legacy programs", async () => {
      // Mock profile lookup to return a user
      const selectMock = vi.fn().mockReturnValue({
        ilike: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue({
            data: [{ id: "user_123", email: "test@example.com", display_name: "Test User" }],
            error: null,
          }),
        }),
      });

      mocks.from.mockImplementation((table) => {
        if (table === "profiles") {
          return { select: selectMock };
        }
        if (table === "program_access") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
            upsert: vi.fn().mockResolvedValue({ error: null }),
          };
        }
        return {};
      });

      const response = await handleProgramGrant(
        buildRequest({
          adminSecret: "test_admin_secret",
          email: "test@example.com",
          programSlug: "six_day_reset",
        })
      );

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.granted.programSlug).toBe("six_day_reset");
    });
  });

  describe("4. Onboarding Quiz Recommendation", () => {
    it("always routes the smoking path to smoking_alcohol_quit", () => {
      const answers = {
        ...createInitialOnboardingAnswers(),
        name: "Test User",
        age: "30",
        gender: "Male" as const,
        path: "guided_recommendation" as const,
        guidedMainIssue: "cravings_smoking_urges" as const,
        questionValues: {
          smoking_outcome: "immediate_control",
          smoking_duration: "1_3_years",
          smoking_daily_count: "5",
        },
      };

      const resolution = getOnboardingResolution(answers);
      expect(resolution.recommendedProgram).toBe("smoking_alcohol_quit");

      // Even for long-term outcome
      const answersLong = {
        ...answers,
        questionValues: {
          ...answers.questionValues,
          smoking_outcome: "full_quit_longer_path",
        },
      };
      const resolutionLong = getOnboardingResolution(answersLong);
      expect(resolutionLong.recommendedProgram).toBe("smoking_alcohol_quit");
    });
  });

  describe("5. My Plan Drawer Quick-Add", () => {
    it("uses checkoutPrograms and excludes legacy or free detox programs", () => {
      const quickAddSlugs = checkoutPrograms.map((p) => p.dbSlug);
      
      expect(quickAddSlugs).toContain("smoking_alcohol_quit");
      expect(quickAddSlugs).toContain("gut_health_reset");
      expect(quickAddSlugs).not.toContain("free_detox_reset");
      expect(quickAddSlugs).not.toContain("six_day_reset");
      expect(quickAddSlugs).not.toContain("ninety_day_transform");
    });
  });
});
