import { describe, expect, it } from "vitest";
import {
  MAX_CART_ITEMS,
  formatPaymentDescription,
  formatProgramCountLabel,
  nextCartItems,
  normalizeCartItems,
} from "@/lib/program-commerce-policy";

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
});
