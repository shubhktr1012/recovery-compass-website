import { describe, expect, it } from "vitest";
import { validateDietPlanJson } from "@/lib/diet-plan-schema";

function track() {
  return {
    items: ["Item one - 1 bowl", "Item two - 2 pieces", "Item three - 1 cup"],
    note: "Balanced for this client's goal.",
  };
}

function meal(optionCount: number) {
  return {
    timing: "7:00 - 8:30 AM",
    intro: "A short client-specific intro.",
    options: Array.from({ length: optionCount }, (_, index) => ({
      title: `Option ${index + 1}`,
      veg: track(),
      nonveg: null,
    })),
  };
}

function snack() {
  return {
    timing: "10:30 - 11:00 AM",
    intro: "Optional snack.",
    veg: ["Fruit - 1 bowl", "Curd - 1 cup"],
    nonveg: [],
  };
}

function plannerDays() {
  return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => ({
    day,
    breakfast: "Pesarattu + chutney",
    lunch: "Rice + dal + vegetables",
    dinner: "Soup + roti",
  }));
}

function validPlan() {
  return {
    meta: {
      clientLabel: "Shubh - Bengaluru",
      goal: "General wellness",
      programs: ["Deep Sleep Reset Program"],
      isDualTrack: false,
    },
    about: ["This plan is built around the client."],
    dos: ["Do 1", "Do 2", "Do 3", "Do 4"],
    donts: ["Do not 1", "Do not 2", "Do not 3", "Do not 4"],
    meals: {
      breakfast: meal(4),
      midMorning: snack(),
      lunch: meal(3),
      afternoon: snack(),
      dinner: meal(4),
      bedtime: {
        timing: "9:00 - 9:30 PM",
        items: ["Drink 1", "Drink 2", "Drink 3"],
      },
    },
    diningOut: {
      venues: [
        { name: "South Indian restaurant", veg: ["Idli"], nonveg: [], skip: ["Fried snacks"] },
        { name: "Cafe", veg: ["Curd bowl"], nonveg: [], skip: ["Sugary drinks"] },
      ],
      travelTips: ["Tip 1", "Tip 2", "Tip 3"],
    },
    weeklyPlanner: {
      veg: plannerDays(),
    },
    keyFoods: ["Food 1", "Food 2", "Food 3", "Food 4"],
    familyMealRules: [],
    programNotes: ["Sleep: keep dinner early."],
  };
}

describe("diet plan schema validation", () => {
  it("accepts a complete diet plan payload", () => {
    const result = validateDietPlanJson(validPlan());

    expect(result.success).toBe(true);
  });

  it("rejects incomplete meal sections before PDF generation", () => {
    const plan = validPlan();
    plan.meals.breakfast.options = plan.meals.breakfast.options.slice(0, 2);

    const result = validateDietPlanJson(plan);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors).toContain("meals.breakfast.options must contain at least 4 option(s)");
    }
  });

  it("requires a non-vegetarian planner when dual track is enabled", () => {
    const plan = validPlan();
    plan.meta.isDualTrack = true;

    const result = validateDietPlanJson(plan);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors).toContain("weeklyPlanner.nonveg must be an array");
    }
  });
});
