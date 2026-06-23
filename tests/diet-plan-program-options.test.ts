import { describe, expect, it } from "vitest";
import { normalizeProgramValues, normalizeQuestionnaireProgramValues } from "@/lib/diet-plan-program-options";

describe("diet-plan program option normalization", () => {
  it("maps old full display titles to current program titles", () => {
    expect(normalizeProgramValues([
      "21-Day Deep Sleep Reset",
      "14-Day Energy Restore",
      "90-Day Biohacking Reset",
      "21-Day Smoking & Alcohol Quit",
      "21-Day Gut Reset",
      "30-Day Men's Vitality Reset",
      "6-Day Free Detox Program",
    ])).toEqual([
      "Deep Sleep Reset Program",
      "Energy Restore Program",
      "Age Reversal Program",
      "Smoking & Alcohol Quit Program",
      "Gut Reset Program",
      "Men’s Vitality Reset Program",
      "Free Detox Program",
    ]);
  });

  it("deduplicates aliases that resolve to the same current title", () => {
    expect(normalizeProgramValues([
      "Age Well",
      "90-Day Biohacking Reset",
      "90-Day Age Reversal",
    ])).toEqual(["Age Reversal Program"]);
  });

  it("normalizes questionnaire program arrays without changing other fields", () => {
    expect(normalizeQuestionnaireProgramValues({
      name: "Shubh",
      programs: ["Sleep Reset", "14-Day Energy Restore", 123],
      goal: "Weight loss",
    })).toEqual({
      name: "Shubh",
      programs: ["Deep Sleep Reset Program", "Energy Restore Program"],
      goal: "Weight loss",
    });
  });
});
