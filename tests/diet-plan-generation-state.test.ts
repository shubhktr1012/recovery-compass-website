import { describe, expect, it } from "vitest";
import { isDietPlanGenerationStale } from "@/lib/diet-plan-generation-state";

describe("diet plan generation lease", () => {
  const now = Date.parse("2026-06-22T12:00:00.000Z");

  it("does not treat a recent generation as stale", () => {
    expect(
      isDietPlanGenerationStale({
        claimedAt: "2026-06-22T11:55:00.000Z",
        now,
        status: "generating",
        updatedAt: "2026-06-22T11:55:00.000Z",
      })
    ).toBe(false);
  });

  it("treats an old generation as stale", () => {
    expect(
      isDietPlanGenerationStale({
        claimedAt: "2026-06-22T11:40:00.000Z",
        now,
        status: "generating",
        updatedAt: "2026-06-22T11:40:00.000Z",
      })
    ).toBe(true);
  });

  it("falls back to updated_at for legacy generating rows", () => {
    expect(
      isDietPlanGenerationStale({
        claimedAt: null,
        now,
        status: "generating",
        updatedAt: "2026-06-22T11:40:00.000Z",
      })
    ).toBe(true);
  });

  it("never marks a non-generating order stale", () => {
    expect(
      isDietPlanGenerationStale({
        claimedAt: "2026-06-22T10:00:00.000Z",
        now,
        status: "failed",
        updatedAt: "2026-06-22T10:00:00.000Z",
      })
    ).toBe(false);
  });
});
