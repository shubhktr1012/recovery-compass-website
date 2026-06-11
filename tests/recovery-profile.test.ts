import { describe, expect, it } from "vitest";
import {
  createInitialOnboardingAnswers,
  getOnboardingResolution,
  type OnboardingAnswers,
} from "@/lib/recovery-profile";

function baseAnswers(overrides: Partial<OnboardingAnswers>): OnboardingAnswers {
  return {
    ...createInitialOnboardingAnswers(),
    name: "Shubh",
    age: "28",
    gender: "Male",
    ...overrides,
  };
}

describe("recovery-profile", () => {
  it("recommends the smoking & alcohol quit program for immediate-control smoking answers", () => {
    const resolution = getOnboardingResolution(
      baseAnswers({
        path: "guided_recommendation",
        guidedMainIssue: "cravings_smoking_urges",
        questionValues: {
          smoking_outcome: "immediate_control",
          smoking_duration: "1_3_years",
          smoking_daily_count: "5",
        },
      })
    );

    expect(resolution).toMatchObject({
      journey: "smoking",
      recommendedProgram: "smoking_alcohol_quit",
      primaryConcernLabel: "Cravings / smoking urges",
    });
  });

  it("recommends the smoking & alcohol quit program for explicit longer quit-path answers", () => {
    const resolution = getOnboardingResolution(
      baseAnswers({
        path: "guided_recommendation",
        guidedMainIssue: "cravings_smoking_urges",
        questionValues: {
          smoking_outcome: "full_quit_longer_path",
          smoking_duration: "1_3_years",
          smoking_daily_count: "5",
        },
      })
    );

    expect(resolution.recommendedProgram).toBe("smoking_alcohol_quit");
  });

  it("maps non-smoking guided issues to their canonical programs", () => {
    expect(
      getOnboardingResolution(
        baseAnswers({
          path: "guided_recommendation",
          guidedMainIssue: "poor_sleep",
          questionValues: {},
        })
      ).recommendedProgram
    ).toBe("sleep_disorder_reset");

    expect(
      getOnboardingResolution(
        baseAnswers({
          path: "guided_recommendation",
          guidedMainIssue: "low_energy",
          questionValues: {},
        })
      ).recommendedProgram
    ).toBe("energy_vitality");

    expect(
      getOnboardingResolution(
        baseAnswers({
          path: "guided_recommendation",
          guidedMainIssue: "stress_overload",
          questionValues: {},
        })
      ).recommendedProgram
    ).toBe("age_reversal");
  });

  it("uses the self-selected journey as the recommendation", () => {
    const resolution = getOnboardingResolution(
      baseAnswers({
        path: "self_select",
        selfSelectJourney: "male_sexual_health",
        questionValues: {},
      })
    );

    expect(resolution).toMatchObject({
      journey: "male_sexual_health",
      recommendedProgram: "male_sexual_health",
      primaryConcernLabel: "30-Day Men's Vitality Reset",
    });
  });
});
