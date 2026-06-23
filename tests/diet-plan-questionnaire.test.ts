import { describe, expect, it } from "vitest";

import { parseManualDietPlanOrderPayload } from "@/lib/admin/diet-plan-actions";
import { buildDietPlanPrompt } from "@/lib/diet-plan-prompt";
import {
  normalizeDietPlanQuestionnaireData,
  withDietPlanQuestionnairePrograms,
} from "@/lib/diet-plan-questionnaire";

const rawGoogleFormQuestionnaire = {
  Timestamp: "2026/06/22 9:37:45 AM GMT+5:30",
  Name: "Siddharth Chauhan",
  Age: "55",
  Gender: "Male",
  "City / region": "Gurgaon ",
  "Height (feet and inches)": "5ft 10in",
  "Weight (kg)": "73",
  "Tick everything that applies. If you select None of the above, do not select any other option.": "Type 2 diabetes;Acidity / IBS",
  "Any medications that affect diet? e.g. Metformin, thyroid medication, blood thinners - or leave blank": "Maybe metformin and thyroid medication ",
  "Any food allergies or intolerances? e.g. dairy, gluten, nuts, shellfish - or leave blank": "Sea food allergies ",
  "Diet type": "Non-veg (no beef)",
  "State / regional cuisine": "UP / Bihar",
  "Which regional cuisine? e.g. Sindhi, Kashmiri, Goan, Marwari, Indori home food": "Home food",
  "Staple grain eaten daily": "Mix of above",
  "Cooking oil used at home": "Mustard oil",
  "Any fasting days or religious food rules? e.g. Monday fast, no onion-garlic, Navratri - or leave blank": "",
  "Breakfast time": "09:30",
  "Lunch time": "13:30",
  "Dinner time": "20:00",
  "Typical portion size": "Medium",
  "Do they eat after 9 PM?": "Sometimes",
  "Who cooks at home?": "Family cooks",
  "Separate cooking for the client? This determines whether the plan modifies the family meal or builds a custom one.": "Yes, fine with it",
  "Activity level": "Lightly active",
  "Recovery Compass programs active. If you select None yet, do not select any other option.": "",
  "Primary goal from the diet": "Blood sugar control",
  "Dining out — how often?": "Weekly",
  "5 foods they love. e.g. fish curry, dal, curd rice, eggs, chapati with sabzi... This is the most important field - a plan that ignores what someone enjoys gets abandoned in a week.": "Chapati with sabzi, dal, eggs, mutton and roti, daal chawal with ghee and vegetables.",
  "Foods they dislike or avoid. e.g. bitter gourd, oats, mushrooms...": "Oats, fish,",
  "Spice preference": "Mild",
  "Tea / coffee habit. e.g. 3 cups chai with sugar, 1 black coffee - or none": "Black Coffee 3-4 cups in a day ",
  Alcohol: "Occasional",
  "Soft drinks or juices?": "Occasionally",
  "Any other health info, preferences, or context? Anything that would help make this plan more accurate - e.g. works night shifts, recovering from surgery, has a very picky family...": "Have a lot of travel scheduled for work.",
  "Email for PDF delivery. This is where the generated PDF will be sent.": "chauhansiddharth1409@gmail.com",
};

describe("diet plan questionnaire normalization", () => {
  it("maps raw Google Form labels into canonical questionnaire fields", () => {
    const normalized = normalizeDietPlanQuestionnaireData(rawGoogleFormQuestionnaire);

    expect(normalized.name).toBe("Siddharth Chauhan");
    expect(normalized.age).toBe("55");
    expect(normalized.gender).toBe("male");
    expect(normalized.city).toBe("Gurgaon");
    expect(normalized.height).toBe("5ft 10in");
    expect(normalized.weight).toBe("73");
    expect(normalized.conditions).toEqual(["Type 2 diabetes", "Acidity / IBS"]);
    expect(normalized.medications).toBe("Maybe metformin and thyroid medication");
    expect(normalized.allergies).toBe("Sea food allergies");
    expect(normalized.diet).toBe("Non-veg (no beef)");
    expect(normalized.region).toBe("UP / Bihar");
    expect(normalized.regionOther).toBe("Home food");
    expect(normalized.grain).toBe("Mix");
    expect(normalized.oil).toBe("Mustard oil");
    expect(normalized.btime).toBe("09:30");
    expect(normalized.ltime).toBe("13:30");
    expect(normalized.dtime).toBe("20:00");
    expect(normalized.portion).toBe("Medium");
    expect(normalized.lateeat).toBe("Sometimes");
    expect(normalized.cooks).toBe("Family member cooks");
    expect(normalized.sepcook).toBe("Yes, fine with it");
    expect(normalized.activity).toBe("Light");
    expect(normalized.goal).toBe("Blood sugar control");
    expect(normalized.dineout).toBe("Weekly");
    expect(normalized.spice).toBe("Mild");
    expect(normalized.tea).toBe("Black Coffee 3-4 cups in a day");
    expect(normalized.alcohol).toBe("Occasional");
    expect(normalized.softdrink).toBe("Occasionally");
    expect(normalized.other).toBe("Have a lot of travel scheduled for work.");
    expect(normalized.programs).toEqual([]);
  });

  it("normalizes questionnaire programs to current public-facing program names", () => {
    const normalized = normalizeDietPlanQuestionnaireData({
      "Recovery Compass programs active. If you select None yet, do not select any other option.": "21-Day Gut Reset;90-Day Biohacking Reset;None yet",
    });

    expect(normalized.programs).toEqual([
      "Gut Reset Program",
      "Age Reversal Program",
    ]);
  });

  it("preserves restricted non-vegetarian diet answers without collapsing them to only the restriction", () => {
    expect(normalizeDietPlanQuestionnaireData({ "Diet type": "Non-veg (no beef)" }).diet).toBe("Non-veg (no beef)");
    expect(normalizeDietPlanQuestionnaireData({ "Diet type": "Non-veg (no pork)" }).diet).toBe("Non-veg (no pork)");
  });

  it("tells the diet-plan model to generate dual-track meals for restricted non-veg answers", () => {
    const prompt = buildDietPlanPrompt(normalizeDietPlanQuestionnaireData(rawGoogleFormQuestionnaire));

    expect(prompt).toContain("Diet type: Non-veg (no beef)");
    expect(prompt).toContain('isDualTrack must be: true (diet type is "Non-veg (no beef)")');
  });

  it("fills the manual order name from questionnaire data when the top-level name is blank", () => {
    const parsed = parseManualDietPlanOrderPayload({
      email: "CLIENT@EXAMPLE.COM",
      evidence: "client shared google form",
      paymentLinkUrl: "https://rzp.io/i/example",
      questionnaireData: rawGoogleFormQuestionnaire,
      reason: "manual sale",
    });

    expect(parsed.name).toBe("Siddharth Chauhan");
    expect(parsed.questionnaireData.name).toBe("Siddharth Chauhan");
    expect(parsed.questionnaireData.city).toBe("Gurgaon");
  });

  it("merges owned programs into questionnaire data with canonical display names", () => {
    const merged = withDietPlanQuestionnairePrograms(
      normalizeDietPlanQuestionnaireData(rawGoogleFormQuestionnaire),
      ["21-Day Deep Sleep Reset", "Age Reversal Program"]
    );

    expect(merged.programs).toEqual([
      "Deep Sleep Reset Program",
      "Age Reversal Program",
    ]);
  });
});
