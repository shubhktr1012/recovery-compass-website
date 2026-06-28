type JsonSchema = Record<string, unknown>;

const stringSchema = { type: "string" } as const;

function stringArraySchema(minItems = 0): JsonSchema {
  return {
    type: "array",
    minItems,
    items: stringSchema,
  };
}

function sectionSchema(description: string): JsonSchema {
  return {
    type: "object",
    description,
    properties: {
      summary: stringSchema,
      bullets: stringArraySchema(0),
    },
    required: ["summary", "bullets"],
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

export type AdminUserSummarySection = {
  bullets: string[];
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

function validateSection(value: unknown, path: string, errors: string[]) {
  if (!isRecord(value)) {
    errors.push(`${path} must be an object`);
    return;
  }

  if (typeof value.summary !== "string" || !value.summary.trim()) {
    errors.push(`${path}.summary is required`);
  }

  if (!Array.isArray(value.bullets) || !value.bullets.every((item) => typeof item === "string")) {
    errors.push(`${path}.bullets must be a string array`);
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
    lines.push(`## ${title}`, section.summary);
    for (const bullet of section.bullets) {
      lines.push(`- ${bullet}`);
    }
    lines.push("");
  }

  lines.push("## Next best action", summary.nextBestAction);
  return lines.join("\n").trim();
}
