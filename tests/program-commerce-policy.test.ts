import { describe, expect, it } from "vitest";
import {
  MAX_CART_ITEMS,
  canonicalizeWebsiteProgramId,
  formatPaymentDescription,
  formatProgramCountLabel,
  nextCartItems,
  normalizeCartItems,
} from "@/lib/program-commerce-policy";
import { publicProgramStats, programHasAudio, programIsNinetyDay } from "@/lib/public-programs";

describe("program-commerce-policy", () => {
  it("caps the cart at the configured multi-program limit", () => {
    expect(MAX_CART_ITEMS).toBe(6);
    const normalized = normalizeCartItems([
      { id: "a" },
      { id: "b" },
      { id: "c" },
    ]);
    expect(normalized).toEqual([{ id: "a" }, { id: "b" }, { id: "c" }]);
  });

  it("appends new selections while preserving uniqueness", () => {
    const next = nextCartItems([{ id: "a" }], { id: "b" });
    expect(next).toEqual([{ id: "a" }, { id: "b" }]);
  });

  it("keeps the most recent unique items when cart exceeds the cap", () => {
    const normalized = normalizeCartItems([
      { id: "a" },
      { id: "b" },
      { id: "c" },
      { id: "d" },
      { id: "e" },
      { id: "f" },
      { id: "g" },
      { id: "g" },
    ]);

    expect(normalized).toEqual([
      { id: "b" },
      { id: "c" },
      { id: "d" },
      { id: "e" },
      { id: "f" },
      { id: "g" },
    ]);
  });

  it("formats user-facing count and payment labels", () => {
    expect(formatProgramCountLabel(1)).toBe("1 program selected");
    expect(formatProgramCountLabel(2)).toBe("2 programs selected");
    expect(formatPaymentDescription(1)).toBe("Payment for 1 program");
    expect(formatPaymentDescription(2)).toBe("Payment for 2 programs");
  });

  it("normalizes legacy website program ids through public program facts", () => {
    expect(canonicalizeWebsiteProgramId("14-day-sleep-reset")).toBe("21-day-deep-sleep-reset");
    expect(canonicalizeWebsiteProgramId("21-day-energy-reset")).toBe("14-day-energy-restore");
  });

  it("exposes checkout-safe program facts from the shared public program data", () => {
    expect(publicProgramStats).toEqual({
      programCount: 6,
      guidedDays: 251,
      platformCount: 2,
    });
    expect(programHasAudio("21-day-deep-sleep-reset")).toBe(true);
    expect(programHasAudio("14-day-energy-restore")).toBe(false);
    expect(programIsNinetyDay("radiance-journey")).toBe(true);
  });
});
