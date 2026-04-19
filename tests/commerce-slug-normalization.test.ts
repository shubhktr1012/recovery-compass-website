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
  });

  it("preserves canonical slugs and drops unknown slugs", () => {
    expect(canonicalizeProgramSlug("male_sexual_health")).toBe("male_sexual_health");
    expect(canonicalizeProgramSlug("unknown-program")).toBeNull();
  });

  it("normalizes transaction items before persistence", () => {
    expect(
      canonicalizeTransactionItems([
        {
          program_slug: "14-day-sleep-reset",
          title: "21-Day Deep Sleep Reset",
          price_inr: 2599,
          quantity: 1,
        },
        {
          program_slug: "energy_vitality",
          title: "14-Day Energy Restore",
          price_inr: 1499,
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
        title: "21-Day Deep Sleep Reset",
        price_inr: 2599,
        quantity: 1,
      },
      {
        program_slug: "energy_vitality",
        title: "14-Day Energy Restore",
        price_inr: 1499,
        quantity: 1,
      },
    ]);
  });
});
