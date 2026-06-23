import { CANONICAL_PROGRAM_DISPLAY_NAMES } from "@/lib/public-programs";
import { normalizeProgramValues } from "@/lib/diet-plan-program-options";

type QuestionnaireRecord = Record<string, unknown>;

const DIET_VALUE_ALIASES: Record<string, string> = {
  "pure vegetarian": "Pure vegetarian",
  vegetarian: "Pure vegetarian",
  vegan: "Vegan",
  eggetarian: "Eggetarian",
  "non vegetarian": "Non-vegetarian",
  "non veg": "Non-vegetarian",
  "non veg no beef": "No beef",
  "non vegetarian no beef": "No beef",
  "non veg no pork": "No pork",
  "non vegetarian no pork": "No pork",
  "fish only": "Fish only",
  jain: "Jain",
};

const GENDER_VALUE_ALIASES: Record<string, string> = {
  male: "male",
  female: "female",
  other: "other",
};

const GRAIN_VALUE_ALIASES: Record<string, string> = {
  "white rice": "White rice",
  "brown red rice": "Brown / red rice",
  "wheat roti": "Wheat roti",
  "ragi millets": "Ragi / bajra / jowar",
  "mix of above": "Mix",
  mix: "Mix",
};

const PORTION_VALUE_ALIASES: Record<string, string> = {
  "small eater": "Small",
  small: "Small",
  medium: "Medium",
  "large eater": "Large",
  large: "Large",
};

const LATE_EAT_VALUE_ALIASES: Record<string, string> = {
  never: "Never",
  sometimes: "Sometimes",
  "most nights": "Most nights",
};

const COOKS_VALUE_ALIASES: Record<string, string> = {
  "cooks themselves": "Cooks themselves",
  "family cooks": "Family member cooks",
  "family member cooks": "Family member cooks",
  "tiffin delivery": "Tiffin / delivery",
  "mostly eats out": "Mostly eats out",
};

const SEPARATE_COOKING_VALUE_ALIASES: Record<string, string> = {
  "yes fine with it": "Yes, fine with it",
  "no must use family meal": "No, same as family",
  "no same as family": "No, same as family",
  "small add ons only": "Small add-ons only",
};

const ACTIVITY_VALUE_ALIASES: Record<string, string> = {
  "sedentary desk job": "Sedentary",
  sedentary: "Sedentary",
  "lightly active": "Light",
  light: "Light",
  "moderate 3 4x week": "Moderate",
  moderate: "Moderate",
  "very active daily": "Very active",
  "very active": "Very active",
};

const CONDITION_VALUE_ALIASES: Record<string, string> = {
  "type 2 diabetes": "Type 2 diabetes",
  "type 1 diabetes": "Type 1 diabetes",
  "pre diabetes": "Pre-diabetes",
  "high blood pressure": "High blood pressure",
  "high bp": "High blood pressure",
  thyroid: "Thyroid",
  "thyroid condition": "Thyroid",
  "high cholesterol": "High cholesterol",
  "pcos pcod": "PCOS / PCOD",
  "heart condition": "Heart condition",
  "kidney issues": "Kidney issues",
  "fatty liver": "Fatty liver",
  anaemia: "Anaemia",
  "acidity ibs": "Acidity / IBS",
  "pregnant breastfeeding": "Pregnant / breastfeeding",
  none: "None",
  "none of the above": "None",
};

function normalizeLabel(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function createNormalizedAliasMap<T extends string>(aliases: Record<string, T>) {
  return Object.fromEntries(
    Object.entries(aliases).map(([key, value]) => [normalizeLabel(key), value])
  ) as Record<string, T>;
}

const RAW_FIELD_ALIASES = createNormalizedAliasMap({
  name: "name",
  age: "age",
  gender: "gender",
  "city / region": "city",
  "height (feet and inches)": "height",
  "weight (kg)": "weight",
  "tick everything that applies. if you select none of the above, do not select any other option.": "conditions",
  "any medications that affect diet? e.g. metformin, thyroid medication, blood thinners - or leave blank": "medications",
  "any food allergies or intolerances? e.g. dairy, gluten, nuts, shellfish - or leave blank": "allergies",
  "diet type": "diet",
  "state / regional cuisine": "region",
  "which regional cuisine? e.g. sindhi, kashmiri, goan, marwari, indori home food": "regionOther",
  "staple grain eaten daily": "grain",
  "cooking oil used at home": "oil",
  "any fasting days or religious food rules? e.g. monday fast, no onion-garlic, navratri - or leave blank": "fasting",
  "breakfast time": "btime",
  "lunch time": "ltime",
  "dinner time": "dtime",
  "typical portion size": "portion",
  "do they eat after 9 pm?": "lateeat",
  "who cooks at home?": "cooks",
  "separate cooking for the client? this determines whether the plan modifies the family meal or builds a custom one.": "sepcook",
  "activity level": "activity",
  "recovery compass programs active. if you select none yet, do not select any other option.": "programs",
  "primary goal from the diet": "goal",
  "dining out - how often?": "dineout",
  "dining out — how often?": "dineout",
  "5 foods they love. e.g. fish curry, dal, curd rice, eggs, chapati with sabzi... this is the most important field - a plan that ignores what someone enjoys gets abandoned in a week.": "loves",
  "foods they dislike or avoid. e.g. bitter gourd, oats, mushrooms...": "hates",
  "spice preference": "spice",
  "tea / coffee habit. e.g. 3 cups chai with sugar, 1 black coffee - or none": "tea",
  alcohol: "alcohol",
  "soft drinks or juices?": "softdrink",
  "any other health info, preferences, or context? anything that would help make this plan more accurate - e.g. works night shifts, recovering from surgery, has a very picky family...": "other",
});

function getCanonicalFieldName(key: string) {
  const normalized = normalizeLabel(key);
  return RAW_FIELD_ALIASES[normalized] ?? key;
}

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeOptionValue(
  value: unknown,
  aliases: Record<string, string>
) {
  const text = normalizeText(value);
  if (!text) {
    return "";
  }

  return aliases[normalizeLabel(text)] ?? text;
}

function splitMultiValue(value: unknown) {
  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  const text = normalizeText(value);
  if (!text) {
    return [];
  }

  return text
    .split(/[;\n]+/g)
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeConditionValues(value: unknown) {
  const values = splitMultiValue(value)
    .map((item) => CONDITION_VALUE_ALIASES[normalizeLabel(item)] ?? item)
    .filter(Boolean);

  if (values.includes("None")) {
    return ["None"];
  }

  return Array.from(new Set(values));
}

function normalizeProgramField(value: unknown) {
  const values = splitMultiValue(value).filter((item) => {
    const normalized = normalizeLabel(item);
    return normalized !== "none" && normalized !== "none yet";
  });

  return normalizeProgramValues(values);
}

export function mapProgramSlugToDietQuestionnaireValue(slug: unknown) {
  if (typeof slug !== "string") {
    return null;
  }

  return CANONICAL_PROGRAM_DISPLAY_NAMES[
    slug as keyof typeof CANONICAL_PROGRAM_DISPLAY_NAMES
  ] ?? null;
}

export function withDietPlanQuestionnairePrograms(
  questionnaireData: QuestionnaireRecord,
  programs: string[]
) {
  const normalizedPrograms = normalizeProgramValues(
    programs.filter((program) => typeof program === "string" && program.trim().length > 0)
  );

  if (normalizedPrograms.length === 0) {
    return questionnaireData;
  }

  return {
    ...questionnaireData,
    programs: normalizedPrograms,
  };
}

export function normalizeDietPlanQuestionnaireData(
  value: QuestionnaireRecord
): QuestionnaireRecord {
  const next: QuestionnaireRecord = { ...value };

  for (const [rawKey, rawValue] of Object.entries(value)) {
    const canonicalKey = getCanonicalFieldName(rawKey);

    switch (canonicalKey) {
      case "name":
      case "age":
      case "city":
      case "height":
      case "weight":
      case "medications":
      case "allergies":
      case "region":
      case "regionOther":
      case "oil":
      case "fasting":
      case "btime":
      case "ltime":
      case "dtime":
      case "goal":
      case "dineout":
      case "loves":
      case "hates":
      case "spice":
      case "tea":
      case "alcohol":
      case "softdrink":
      case "other": {
        const text = normalizeText(rawValue);
        if (text) {
          next[canonicalKey] = text;
        }
        break;
      }
      case "gender": {
        const gender = normalizeOptionValue(rawValue, GENDER_VALUE_ALIASES);
        if (gender) {
          next.gender = gender;
        }
        break;
      }
      case "diet": {
        const diet = normalizeOptionValue(rawValue, DIET_VALUE_ALIASES);
        if (diet) {
          next.diet = diet;
        }
        break;
      }
      case "grain": {
        const grain = normalizeOptionValue(rawValue, GRAIN_VALUE_ALIASES);
        if (grain) {
          next.grain = grain;
        }
        break;
      }
      case "portion": {
        const portion = normalizeOptionValue(rawValue, PORTION_VALUE_ALIASES);
        if (portion) {
          next.portion = portion;
        }
        break;
      }
      case "lateeat": {
        const lateeat = normalizeOptionValue(rawValue, LATE_EAT_VALUE_ALIASES);
        if (lateeat) {
          next.lateeat = lateeat;
        }
        break;
      }
      case "cooks": {
        const cooks = normalizeOptionValue(rawValue, COOKS_VALUE_ALIASES);
        if (cooks) {
          next.cooks = cooks;
        }
        break;
      }
      case "sepcook": {
        const sepcook = normalizeOptionValue(rawValue, SEPARATE_COOKING_VALUE_ALIASES);
        if (sepcook) {
          next.sepcook = sepcook;
        }
        break;
      }
      case "activity": {
        const activity = normalizeOptionValue(rawValue, ACTIVITY_VALUE_ALIASES);
        if (activity) {
          next.activity = activity;
        }
        break;
      }
      case "conditions": {
        const conditions = normalizeConditionValues(rawValue);
        if (conditions.length > 0) {
          next.conditions = conditions;
        }
        break;
      }
      case "programs": {
        const programs = normalizeProgramField(rawValue);
        next.programs = programs;
        break;
      }
      default:
        break;
    }
  }

  if (Array.isArray(next.conditions)) {
    next.conditions = normalizeConditionValues(next.conditions);
  }

  if (Array.isArray(next.programs) || typeof next.programs === "string") {
    next.programs = normalizeProgramField(next.programs);
  }

  return next;
}
