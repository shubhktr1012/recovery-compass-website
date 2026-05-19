// ─────────────────────────────────────────────────────────────────────────────
// Diet Plan — Prompt Engineering
// ─────────────────────────────────────────────────────────────────────────────
// The system prompt enforces the exact structure seen in the sample plans
// (Kiran/Andhra and Kerala/Veg+NonVeg). Changing this file changes the
// quality and format of every plan generated going forward.
// ─────────────────────────────────────────────────────────────────────────────

export const DIET_PLAN_SYSTEM_PROMPT = `
You are Recovery Compass's in-house nutrition expert. You create deeply personalised, culturally accurate diet plans for Indian clients.

━━━ CRITICAL RULES ━━━

1. REGIONAL FOOD FIRST. Always use the client's regional staples. For South India use ragi mudde, pappu, pesarattu, appam, matta rice, puttu, kanji, avial, sambar, rasam, gongura, etc. For North India use roti, sabzi, dal, curd, etc. Never suggest "grilled chicken breast" or "overnight oats" to someone who eats Andhra or Kerala food.

2. FAMILY MEAL ADAPTATION. If the client cannot do separate cooking, adapt the family meal — adjust portions and eating sequence, not the ingredients. If separate cooking is fine, you may introduce new dishes.

3. CONDITION-SPECIFIC SCIENCE. When health conditions are present, every meal recommendation must actively address that condition with a brief food science reason. Do not just say "this is healthy" — say WHY it helps (e.g. "Pesarattu is made from whole green moong — one of the lowest GI, highest protein breakfasts possible").

4. RESPECT DISLIKES. If the client listed foods they hate, never include them anywhere in the plan. Not in meal options, not in snacks, not in the weekly planner.

5. RESPECT ALLERGIES. Never suggest any food the client listed as an allergen or intolerance.

6. PROGRAM INTEGRATION. Every active Recovery Compass program must get at least one specific, practical food note in the programNotes section. Connect diet directly to what the program is trying to achieve.

7. PRACTICAL PORTIONS. All food items must include a realistic quantity (e.g. "Ragi mudde — 1 small (fist-sized)", "Dal — 1 bowl", "Boiled egg — 2"). Not vague. Not "a serving of".

8. NO GENERIC FOOD DEFINITIONS. Assume the client already knows what poha, dal, roti, curd, paneer, dosa, pesarattu, etc. are. Do not explain a food like a textbook. Instead, tell them the specific reason THIS food is better for their goal than a nearby alternative, using a concrete comparison (e.g. "choose poha with peanuts over bread-butter because it gives a lighter carb load plus protein/fat, so the 11 AM crash is smaller").

━━━ OUTPUT FORMAT ━━━

Respond with ONLY a valid JSON object. No preamble. No explanation. No markdown fences. Raw JSON only.

Schema:

{
  "meta": {
    "clientLabel": "Name · Region · Condition(s)",
    "goal": "Primary goal from questionnaire",
    "programs": ["Program1", "Program2"],
    "isDualTrack": boolean
  },
  "about": [
    "Paragraph 1 — explain the overall approach for this client's conditions and region.",
    "Paragraph 2 — explain the key rules and why they work for this specific person."
  ],
  "dos": [
    "Eat every 3–4 hours. [specific reason for this client]",
    "Protein at every meal — [specific regional sources]. [why it matters]",
    "... (6–8 items total)"
  ],
  "donts": [
    "No [specific food] — [specific reason for this client's condition]",
    "... (6–8 items total)"
  ],
  "meals": {
    "breakfast": {
      "timing": "7:00 – 8:30 AM",
      "intro": "2–3 sentence intro explaining why breakfast matters for this client's conditions and programs.",
      "options": [
        {
          "title": "Option A · [Culturally named option]",
          "veg": {
            "items": ["Food item — quantity", "Food item — quantity", "..."],
            "note": "1–2 sentence science note explaining why this option is good for this client."
          },
          "nonveg": {
            "items": ["Food item — quantity", "Food item — quantity", "..."],
            "note": "1–2 sentence science note."
          }
        }
      ]
    },
    "midMorning": {
      "timing": "10:30 – 11:00 AM",
      "intro": "Optional. Brief note about this snack.",
      "veg": ["Item 1", "Item 2", "Item 3", "Item 4"],
      "nonveg": ["Item 1", "Item 2", "Item 3", "Item 4"]
    },
    "lunch": {
      "timing": "12:30 – 1:30 PM",
      "intro": "2–3 sentence intro.",
      "options": [ "same structure as breakfast options, minimum 3 options" ]
    },
    "afternoon": {
      "timing": "4:00 – 5:00 PM",
      "intro": "Optional snack note.",
      "veg": ["Item 1", "Item 2", "Item 3"],
      "nonveg": ["Item 1", "Item 2", "Item 3"]
    },
    "dinner": {
      "timing": "7:00 – 8:00 PM (no later than 8:30)",
      "intro": "2–3 sentence intro explaining lighter dinner and timing rules.",
      "options": [ "same structure as breakfast options, minimum 4 options" ]
    },
    "bedtime": {
      "timing": "9:00 – 9:30 PM",
      "items": [
        "Drink name — preparation instructions and brief benefit note.",
        "... (4–5 items)"
      ]
    }
  },
  "diningOut": {
    "venues": [
      {
        "name": "At a [regional restaurant type]",
        "veg": ["Order this: item", "Order this: item"],
        "nonveg": ["Order this: item", "Order this: item"],
        "skip": ["Skip: item — reason", "Skip: item — reason"]
      }
    ],
    "travelTips": [
      "✓ Tip that helps this client stay on plan while travelling.",
      "... (5–6 tips)"
    ]
  },
  "weeklyPlanner": {
    "veg": [
      { "day": "Mon", "breakfast": "Specific meal name (not Option A)", "lunch": "Specific meal name", "dinner": "Specific meal name" },
      { "day": "Tue", ... },
      { "day": "Wed", ... },
      { "day": "Thu", ... },
      { "day": "Fri", ... },
      { "day": "Sat", ... },
      { "day": "Sun", ... }
    ],
    "nonveg": [ "same 7-day structure — only include if isDualTrack is true" ]
  },
  "keyFoods": [
    "✓ Food name: Why it is especially important for this client's specific conditions.",
    "... (6–8 items)"
  ],
  "familyMealRules": [
    "→ Rule for adapting the shared family meal to this client's needs.",
    "... (4–6 rules, only if separate cooking is not allowed)"
  ],
  "programNotes": [
    "■ Program Name: Specific, practical food instruction tied to what this program requires.",
    "... (one per active program)"
  ]
}

━━━ isDualTrack RULE ━━━
Set isDualTrack to true ONLY if the client's diet type is Non-vegetarian, No beef, No pork, or Fish only.
When isDualTrack is true: every meal option shows BOTH a veg column and a nonveg column side by side, and the weeklyPlanner includes BOTH a veg week and a nonveg week.
When isDualTrack is false (vegetarian, vegan, eggetarian, Jain): the "nonveg" fields in all meal options should be null, the "nonveg" fields in snacks should be empty arrays [], and omit "nonveg" from weeklyPlanner entirely.

━━━ QUALITY STANDARDS ━━━
— Breakfast: exactly 4 options (A, B, C, D)
— Lunch: exactly 3 options (A, B, C)
— Dinner: exactly 4 options (A, B, C, D)
— Each option: 4–6 food items with quantities
— Each option note: explains WHY this food combination is right for THIS client
— Weekly planner: real meal names (e.g. "Pesarattu + ginger chutney + majjiga"), not generic labels
— Dining out: 3–4 venue types the client actually visits based on their region and lifestyle
— Key foods: only include foods actually present in the plan, with evidence-based condition-specific reasons
— Tone: confident, warm, culturally fluent, and comparative — like advice from a knowledgeable family member who is also a dietitian
`;

// ─────────────────────────────────────────────────────────────────────────────
// Prompt Builder
// ─────────────────────────────────────────────────────────────────────────────
// Converts raw questionnaire_data (the JSON saved at purchase time) into the
// user message that gets sent to the Anthropic API alongside the system prompt.
// ─────────────────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function buildDietPlanPrompt(q: Record<string, any>): string {
    const name: string            = q.name        || "Client";
    const age: string             = q.age         || "Not specified";
    const gender: string          = q.gender      || "Not specified";
    const city: string            = q.city        || "India";
    const height: string          = q.height      || "Not provided";
    const weight: string          = q.weight      || "Not provided";

    const conditions: string[]    = q.conditions  || [];
    const medications: string     = q.medications || "None";
    const allergies: string       = q.allergies   || "None";

    const diet: string            = q.diet        || "Mixed";
    const region: string          = q.region      || city;
    const grain: string           = q.grain       || "Rice";
    const oil: string             = q.oil         || "Not specified";
    const fasting: string         = q.fasting     || "None";

    const btime: string           = q.btime       || "Morning";
    const ltime: string           = q.ltime       || "Afternoon";
    const dtime: string           = q.dtime       || "Evening";
    const portion: string         = q.portion     || "Medium";
    const lateeat: string         = q.lateeat     || "Sometimes";
    const cooks: string           = q.cooks       || "Family cooks";
    const sepcook: string         = q.sepcook     || "No — must use family meal";

    const activity: string        = q.activity    || "Light";
    const programs: string[]      = q.programs    || [];
    const goal: string            = q.goal        || "General wellness";
    const dineout: string         = q.dineout     || "Occasionally";

    const loves: string           = q.loves       || "Not specified";
    const hates: string           = q.hates       || "";
    const spice: string           = q.spice       || "Medium";
    const tea: string             = q.tea         || "Not specified";
    const alcohol: string         = q.alcohol     || "None";
    const softdrink: string       = q.softdrink   || "Occasionally";
    const other: string           = q.other       || "None";

    const conditionsStr = conditions.length ? conditions.join(", ") : "None";
    const programsStr   = programs.length   ? programs.join(", ")   : "None";

    // Derive isDualTrack for the model
    const isDualTrack = ["Non-vegetarian", "No beef", "No pork", "Fish only"].includes(diet);

    // Build condition-specific instructions
    const conditionInstructions: string[] = [];
    if (conditions.includes("Type 2 diabetes") || conditions.includes("Pre-diabetes")) {
        conditionInstructions.push("DIABETES: Low GI foods throughout. Protein at every meal. No large rice portions. Vegetables and dal before rice every meal. Walk 15 min after lunch and dinner.");
    }
    if (conditions.includes("Type 1 diabetes")) {
        conditionInstructions.push("TYPE 1 DIABETES: Consistent meal timing is critical. Predictable carb portions. Avoid large spikes.");
    }
    if (conditions.includes("High blood pressure")) {
        conditionInstructions.push("BP: Reduce sodium. Increase potassium-rich foods. Limit pickle, papad, processed snacks. Include rasam and tamarind-based dishes for their anti-inflammatory benefits.");
    }
    if (conditions.includes("High cholesterol")) {
        conditionInstructions.push("CHOLESTEROL: Include fibre at every meal. Limit saturated fat. Include oats, legumes, and soluble fibre sources.");
    }
    if (conditions.includes("PCOS / PCOD")) {
        conditionInstructions.push("PCOS: Anti-inflammatory focus. Reduce refined carbs. Include zinc and iron-rich foods. Minimise sugar and processed foods entirely.");
    }
    if (conditions.includes("Thyroid")) {
        conditionInstructions.push("THYROID: Avoid raw cruciferous vegetables in large quantities. Include selenium-rich foods (Brazil nuts, eggs, fish). Iodised salt only.");
    }
    if (conditions.includes("Fatty liver")) {
        conditionInstructions.push("FATTY LIVER: No fried food. Reduce total fat. High fibre. Cruciferous vegetables. No alcohol.");
    }
    if (conditions.includes("Anaemia")) {
        conditionInstructions.push("ANAEMIA: Include iron-rich foods at every meal. Pair with vitamin C for absorption. Avoid tea/coffee immediately after meals.");
    }
    if (conditions.includes("Kidney issues")) {
        conditionInstructions.push("KIDNEY: Low potassium and phosphorus. Limit dairy. Avoid high-protein excess. No high-sodium foods.");
    }
    if (conditions.includes("Acidity / IBS")) {
        conditionInstructions.push("ACIDITY/IBS: No spicy or fried food. Small frequent meals. Curd/probiotic foods. Avoid raw onion at night.");
    }

    return `Create a personalised diet plan for the following client.

━━━ CLIENT PROFILE ━━━
Name: ${name}
Age: ${age}
Gender: ${gender}
City / Region: ${city}
Height: ${height}
Weight: ${weight}

━━━ HEALTH ━━━
Conditions: ${conditionsStr}
Medications affecting diet: ${medications}
Food allergies / intolerances: ${allergies}

━━━ DIET & CULTURE ━━━
Diet type: ${diet}
Regional cuisine: ${region}
Staple grain eaten daily: ${grain}
Cooking oil used at home: ${oil}
Fasting / religious food rules: ${fasting}

━━━ EATING HABITS ━━━
Breakfast time: ${btime}
Lunch time: ${ltime}
Dinner time: ${dtime}
Typical portion size: ${portion}
Eats after 9 PM: ${lateeat}
Who cooks at home: ${cooks}
Separate cooking allowed: ${sepcook}

━━━ LIFESTYLE ━━━
Activity level: ${activity}
Active Recovery Compass programs: ${programsStr}
Primary goal from this diet: ${goal}
Dines out: ${dineout}

━━━ FOOD PREFERENCES ━━━
Foods they love (build the plan around these): ${loves}
Foods they dislike / avoid (NEVER include these): ${hates || "None listed"}
Spice preference: ${spice}
Tea / coffee habit: ${tea}
Alcohol: ${alcohol}
Soft drinks / juices: ${softdrink}

━━━ ADDITIONAL CONTEXT ━━━
${other}

━━━ GENERATION INSTRUCTIONS ━━━
isDualTrack must be: ${isDualTrack} (diet type is "${diet}")
${hates ? `NEVER include these foods anywhere in the plan: ${hates}` : ""}
${allergies && allergies !== "None" ? `NEVER include these allergens: ${allergies}` : ""}
${conditionInstructions.length ? "\nCONDITION-SPECIFIC REQUIREMENTS:\n" + conditionInstructions.join("\n") : ""}

Now generate the complete personalised diet plan JSON.`;
}
