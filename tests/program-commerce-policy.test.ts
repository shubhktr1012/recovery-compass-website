import { describe, expect, it } from "vitest";
import {
  MAX_CART_ITEMS,
  formatPaymentDescription,
  formatProgramCountLabel,
  nextCartItems,
  normalizeCartItems,
} from "@/lib/program-commerce-policy";

describe("program-commerce-policy", () => {
  it("keeps cart single-slot under launch policy", () => {
    expect(MAX_CART_ITEMS).toBe(1);
    const normalized = normalizeCartItems([
      { id: "a" },
      { id: "b" },
      { id: "c" },
    ]);
    expect(normalized).toEqual([{ id: "c" }]);
  });

  it("replaces existing cart item with next selection", () => {
    const next = nextCartItems([{ id: "a" }], { id: "b" });
    expect(next).toEqual([{ id: "b" }]);
  });

  it("formats user-facing count and payment labels", () => {
    expect(formatProgramCountLabel(1)).toBe("1 program selected");
    expect(formatProgramCountLabel(2)).toBe("2 programs selected");
    expect(formatPaymentDescription(1)).toBe("Payment for 1 program");
    expect(formatPaymentDescription(2)).toBe("Payment for 2 programs");
  });
});
