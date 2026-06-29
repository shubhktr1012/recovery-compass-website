type JsonSchema = Record<string, unknown>;

const stringSchema = { type: "string" } as const;

function stringArraySchema(minItems = 0): JsonSchema {
  return {
    type: "array",
    minItems,
    items: stringSchema,
  };
}

const factSchema: JsonSchema = {
  type: "object",
  properties: {
    label: stringSchema,
    value: stringSchema,
  },
  required: ["label", "value"],
  additionalProperties: false,
};

function sectionSchema(description: string): JsonSchema {
  return {
    type: "object",
    description,
    properties: {
      summary: {
        type: "string",
        description:
          "Optional one-line note for interpretation only. Leave empty when facts are sufficient.",
      },
      facts: {
        type: "array",
        description: "Scannable label-value data points. Prefer facts over prose.",
        items: factSchema,
      },
      bullets: {
        ...stringArraySchema(0),
        description: "Short list items for sales talking points or risks only.",
      },
    },
    required: ["summary", "facts", "bullets"],
    additionalProperties: false,
  };
}

export const ADMIN_USER_SUMMARY_RESPONSE_SCHEMA: JsonSchema = {
  type: "object",
  properties: {
    headline: stringSchema,
    overview: sectionSchema("Identity, account age, onboarding, recommended program."),
    programOwnership: sectionSchema("Owned paid programs, free tier, queue and completion state."),
    appUsageAndActivity: sectionSchema(
      "How the user uses the app: engagement, day progress, Free Detox, journal/check-ins, recent events."
    ),
    purchasesAndRevenue: sectionSchema("Web transactions, spend, referral redemptions."),
    dietAndAddOns: sectionSchema("Diet plan orders and delivery status."),
    profileAndIntent: sectionSchema("Questionnaire, primary concern, web leads and intent signals."),
    communication: sectionSchema("Email delivery, push/WhatsApp consent and notification settings."),
    salesAndOutreach: sectionSchema(
      "Sales talking points, upsell angles, and outreach tone referencing app usage."
    ),
    risksAndOpenIssues: sectionSchema("Delivery failures, stuck orders, inactive or paused programs."),
    nextBestAction: stringSchema,
  },
  required: [
    "headline",
    "overview",
    "programOwnership",
    "appUsageAndActivity",
    "purchasesAndRevenue",
    "dietAndAddOns",
    "profileAndIntent",
    "communication",
    "salesAndOutreach",
    "risksAndOpenIssues",
    "nextBestAction",
  ],
  additionalProperties: false,
};

export type AdminUserSummaryFact = {
  label: string;
  value: string;
};

export type AdminUserSummarySection = {
  bullets: string[];
  facts?: AdminUserSummaryFact[];
  summary: string;
};

export type AdminUserSummary = {
  appUsageAndActivity: AdminUserSummarySection;
  communication: AdminUserSummarySection;
  dietAndAddOns: AdminUserSummarySection;
  headline: string;
  nextBestAction: string;
  overview: AdminUserSummarySection;
  profileAndIntent: AdminUserSummarySection;
  programOwnership: AdminUserSummarySection;
  purchasesAndRevenue: AdminUserSummarySection;
  risksAndOpenIssues: AdminUserSummarySection;
  salesAndOutreach: AdminUserSummarySection;
};

type ValidationResult =
  | { success: true; data: AdminUserSummary }
  | { success: false; errors: string[] };

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function parseLegacyBulletAsFact(bullet: string): AdminUserSummaryFact | null {
  const trimmed = bullet.trim();
  if (!trimmed) {
    return null;
  }

  const colonIndex = trimmed.indexOf(":");
  if (colonIndex > 0 && colonIndex < trimmed.length - 1) {
    return {
      label: trimmed.slice(0, colonIndex).trim(),
      value: trimmed.slice(colonIndex + 1).trim(),
    };
  }

  return { label: "Note", value: trimmed };
}

export function getSectionDisplayFacts(section: AdminUserSummarySection): AdminUserSummaryFact[] {
  if (section.facts?.length) {
    return section.facts;
  }

  return section.bullets
    .map(parseLegacyBulletAsFact)
    .filter((fact): fact is AdminUserSummaryFact => fact !== null);
}

export function sectionHasNarrativeContent(section: AdminUserSummarySection) {
  return Boolean(section.summary.trim() || section.bullets.length > 0);
}

function validateSection(value: unknown, path: string, errors: string[]) {
  if (!isRecord(value)) {
    errors.push(`${path} must be an object`);
    return;
  }

  if (typeof value.summary !== "string") {
    errors.push(`${path}.summary is required`);
  }

  const facts = Array.isArray(value.facts) ? value.facts : undefined;
  const bullets = Array.isArray(value.bullets) ? value.bullets : undefined;

  if (facts) {
    for (const [index, fact] of facts.entries()) {
      if (!isRecord(fact)) {
        errors.push(`${path}.facts[${index}] must be an object`);
        continue;
      }

      if (typeof fact.label !== "string" || !fact.label.trim()) {
        errors.push(`${path}.facts[${index}].label is required`);
      }

      if (typeof fact.value !== "string" || !fact.value.trim()) {
        errors.push(`${path}.facts[${index}].value is required`);
      }
    }
  }

  if (!bullets || !bullets.every((item) => typeof item === "string")) {
    errors.push(`${path}.bullets must be a string array`);
  }

  const hasFacts = Boolean(facts?.length);
  const hasBullets = Boolean(bullets?.length);
  const hasSummary = typeof value.summary === "string" && value.summary.trim().length > 0;

  if (!hasSummary && !hasFacts && !hasBullets) {
    errors.push(`${path} needs a summary, fact, or bullet`);
  }
}

export function validateAdminUserSummaryJson(value: unknown): ValidationResult {
  const errors: string[] = [];

  if (!isRecord(value)) {
    return { success: false, errors: ["Summary must be a JSON object"] };
  }

  if (typeof value.headline !== "string" || !value.headline.trim()) {
    errors.push("headline is required");
  }

  if (typeof value.nextBestAction !== "string" || !value.nextBestAction.trim()) {
    errors.push("nextBestAction is required");
  }

  const sections = [
    "overview",
    "programOwnership",
    "appUsageAndActivity",
    "purchasesAndRevenue",
    "dietAndAddOns",
    "profileAndIntent",
    "communication",
    "salesAndOutreach",
    "risksAndOpenIssues",
  ] as const;

  for (const key of sections) {
    validateSection(value[key], key, errors);
  }

  return errors.length
    ? { success: false, errors }
    : { success: true, data: value as AdminUserSummary };
}

function formatSectionPlainText(section: AdminUserSummarySection) {
  const lines: string[] = [];
  const facts = getSectionDisplayFacts(section);

  if (section.summary.trim()) {
    lines.push(section.summary.trim());
  }

  for (const fact of facts) {
    lines.push(`${fact.label}: ${fact.value}`);
  }

  for (const bullet of section.bullets) {
    if (!section.facts?.length && facts.some((fact) => fact.value === bullet)) {
      continue;
    }

    lines.push(`- ${bullet}`);
  }

  return lines;
}

export function formatAdminUserSummaryPlainText(summary: AdminUserSummary) {
  const sections: Array<[string, AdminUserSummarySection]> = [
    ["Overview", summary.overview],
    ["Program ownership", summary.programOwnership],
    ["App usage & activity", summary.appUsageAndActivity],
    ["Purchases & revenue", summary.purchasesAndRevenue],
    ["Diet & add-ons", summary.dietAndAddOns],
    ["Profile & intent", summary.profileAndIntent],
    ["Communication", summary.communication],
    ["Sales & outreach", summary.salesAndOutreach],
    ["Risks & open issues", summary.risksAndOpenIssues],
  ];

  const lines = [summary.headline, ""];

  for (const [title, section] of sections) {
    lines.push(`## ${title}`, ...formatSectionPlainText(section), "");
  }

  lines.push("## Next best action", summary.nextBestAction);
  return lines.join("\n").trim();
}
