import { describe, expect, it } from "vitest";

import { formatTestimonialAttribution } from "@/lib/testimonials";

describe("formatTestimonialAttribution", () => {
  it("joins age and city when both are present", () => {
    expect(formatTestimonialAttribution(31, "Bengaluru")).toBe("31 · Bengaluru");
  });

  it("returns the non-empty field when only one is present", () => {
    expect(formatTestimonialAttribution(44, null)).toBe("44");
    expect(formatTestimonialAttribution(null, "Pune")).toBe("Pune");
  });

  it("returns null when both fields are missing", () => {
    expect(formatTestimonialAttribution(null, null)).toBeNull();
    expect(formatTestimonialAttribution(null, "   ")).toBeNull();
  });
});
