import { describe, expect, it, vi } from "vitest";

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => ({})),
}));

vi.mock("@/lib/mail", () => ({
  sendOpsAlertEmail: vi.fn(),
  sendWelcomeEmail: vi.fn(),
}));

import { canonicalizeProgramSlug, canonicalizeTransactionItems } from "@/lib/commerce";

describe("commerce slug normalization", () => {
  it("maps website marketing slugs to canonical app/database slugs", () => {
    expect(canonicalizeProgramSlug("6-day-compass-reset")).toBe("six_day_reset");
    expect(canonicalizeProgramSlug("14-day-sleep-reset")).toBe("sleep_disorder_reset");
    expect(canonicalizeProgramSlug("21-day-energy-reset")).toBe("energy_vitality");
    expect(canonicalizeProgramSlug("21-day-deep-sleep-reset")).toBe("sleep_disorder_reset");
    expect(canonicalizeProgramSlug("14-day-energy-restore")).toBe("energy_vitality");
    expect(canonicalizeProgramSlug("custom-diet-plan")).toBe("custom_diet_plan");
  });

  it("preserves canonical slugs and drops unknown slugs", () => {
    expect(canonicalizeProgramSlug("male_sexual_health")).toBe("male_sexual_health");
    expect(canonicalizeProgramSlug("custom_diet_plan")).toBe("custom_diet_plan");
    expect(canonicalizeProgramSlug("unknown-program")).toBeNull();
  });

  it("restricts legacy and free detox slugs under checkout mode", () => {
    // Under checkout mode (forCheckout: true):
    // Active checkout programs should be allowed
    expect(canonicalizeProgramSlug("smoking_alcohol_quit", { forCheckout: true })).toBe("smoking_alcohol_quit");
    expect(canonicalizeProgramSlug("gut_health_reset", { forCheckout: true })).toBe("gut_health_reset");

    // Legacy programs should be blocked
    expect(canonicalizeProgramSlug("six_day_reset", { forCheckout: true })).toBeNull();
    expect(canonicalizeProgramSlug("ninety_day_transform", { forCheckout: true })).toBeNull();

    // Free Detox should be blocked
    expect(canonicalizeProgramSlug("free_detox_reset", { forCheckout: true })).toBeNull();
  });

  it("allows legacy and free detox slugs under compatibility parsing mode", () => {
    // Under compatibility mode (forCheckout: false / undefined):
    // Active checkout programs
    expect(canonicalizeProgramSlug("smoking_alcohol_quit")).toBe("smoking_alcohol_quit");
    expect(canonicalizeProgramSlug("gut_health_reset")).toBe("gut_health_reset");

    // Legacy programs
    expect(canonicalizeProgramSlug("six_day_reset")).toBe("six_day_reset");
    expect(canonicalizeProgramSlug("ninety_day_transform")).toBe("ninety_day_transform");

    // Free Detox
    expect(canonicalizeProgramSlug("free_detox_reset")).toBe("free_detox_reset");
  });

  it("normalizes transaction items before persistence", () => {
    expect(
      canonicalizeTransactionItems([
        {
          program_slug: "14-day-sleep-reset",
          title: "Deep Sleep Reset",
          price_inr: 2599,
          quantity: 1,
          queue_rank: 2,
        },
        {
          program_slug: "energy_vitality",
          title: "Energy Restore",
          price_inr: 1499,
          quantity: 1,
        },
        {
          program_slug: "custom-diet-plan",
          title: "Custom Diet Plan",
          price_inr: 1299,
          quantity: 1,
        },
        {
          program_slug: "not-real",
          title: "Ignore me",
          price_inr: 0,
          quantity: 1,
        },
      ])
    ).toEqual([
      {
        program_slug: "sleep_disorder_reset",
        title: "Deep Sleep Reset",
        price_inr: 2599,
        quantity: 1,
        queue_rank: 2,
      },
      {
        program_slug: "energy_vitality",
        title: "Energy Restore",
        price_inr: 1499,
        quantity: 1,
      },
      {
        program_slug: "custom_diet_plan",
        title: "Custom Diet Plan",
        price_inr: 1299,
        quantity: 1,
      },
    ]);
  });
});
