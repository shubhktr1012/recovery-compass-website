import type {
  AdminUserSummary,
  AdminUserSummaryInsights,
  AdminUserSummarySnapshot,
  SummaryRow,
} from "@/lib/admin/user-summary-snapshot";
import { EMPTY_SUMMARY_VALUE } from "@/lib/admin/user-summary-snapshot";

export type {
  AdminUserSummary,
  AdminUserSummaryInsights,
  AdminUserSummarySnapshot,
  SummaryRow,
} from "@/lib/admin/user-summary-snapshot";
export { ADMIN_USER_SUMMARY_SCHEMA_VERSION, EMPTY_SUMMARY_VALUE } from "@/lib/admin/user-summary-snapshot";

type JsonSchema = Record<string, unknown>;

const stringSchema = { type: "string" } as const;

function stringArraySchema(minItems: number, maxItems: number): JsonSchema {
  return {
    type: "array",
    minItems,
    maxItems,
    items: stringSchema,
  };
}

export const ADMIN_USER_SUMMARY_INSIGHTS_SCHEMA: JsonSchema = {
  type: "object",
  properties: {
    headline: stringSchema,
    salesTalkingPoints: stringArraySchema(1, 3),
    recommendedTone: stringSchema,
    risks: stringArraySchema(0, 3),
    nextBestAction: stringSchema,
  },
  required: [
    "headline",
    "salesTalkingPoints",
    "recommendedTone",
    "risks",
    "nextBestAction",
  ],
  additionalProperties: false,
};

type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: string[] };

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

export function validateAdminUserSummaryInsights(value: unknown): ValidationResult<AdminUserSummaryInsights> {
  const errors: string[] = [];

  if (!isRecord(value)) {
    return { success: false, errors: ["Insights must be a JSON object"] };
  }

  if (typeof value.headline !== "string" || !value.headline.trim()) {
    errors.push("headline is required");
  }

  if (typeof value.recommendedTone !== "string" || !value.recommendedTone.trim()) {
    errors.push("recommendedTone is required");
  }

  if (typeof value.nextBestAction !== "string" || !value.nextBestAction.trim()) {
    errors.push("nextBestAction is required");
  }

  if (
    !Array.isArray(value.salesTalkingPoints) ||
    value.salesTalkingPoints.length < 1 ||
    value.salesTalkingPoints.length > 3 ||
    !value.salesTalkingPoints.every((item) => typeof item === "string" && item.trim())
  ) {
    errors.push("salesTalkingPoints must be 1-3 non-empty strings");
  }

  if (
    !Array.isArray(value.risks) ||
    value.risks.length > 3 ||
    !value.risks.every((item) => typeof item === "string")
  ) {
    errors.push("risks must be up to 3 strings");
  }

  return errors.length
    ? { success: false, errors }
    : { success: true, data: value as AdminUserSummaryInsights };
}

export function isAdminUserSummaryV3(value: unknown): value is AdminUserSummary {
  return (
    isRecord(value) &&
    value.schemaVersion === 3 &&
    isRecord(value.snapshot) &&
    isRecord(value.insights)
  );
}

function formatSnapshotSection(title: string, rows: SummaryRow[]) {
  const lines = [`## ${title}`];
  for (const entry of rows) {
    lines.push(`${entry.label}: ${entry.value}`);
  }
  return lines;
}

export function formatAdminUserSummaryPlainText(summary: AdminUserSummary) {
  const { snapshot, insights } = summary;

  return [
    insights.headline,
    "",
    ...formatSnapshotSection("Overview", snapshot.overview),
    "",
    ...formatSnapshotSection("Program ownership", snapshot.programOwnership),
    "",
    ...formatSnapshotSection("App usage & activity", snapshot.appUsageAndActivity),
    "",
    ...formatSnapshotSection("Purchases & revenue", snapshot.purchasesAndRevenue),
    "",
    ...formatSnapshotSection("Diet & add-ons", snapshot.dietAndAddOns),
    "",
    ...formatSnapshotSection("Profile & intent", snapshot.profileAndIntent),
    "",
    ...formatSnapshotSection("Communication", snapshot.communication),
    "",
    "## Sales & outreach",
    `Tone: ${insights.recommendedTone}`,
    ...insights.salesTalkingPoints.map((point) => `- ${point}`),
    "",
    "## Risks & open issues",
    ...(insights.risks.length > 0
      ? insights.risks.map((risk) => `- ${risk}`)
      : [`- ${EMPTY_SUMMARY_VALUE}`]),
    "",
    "## Next best action",
    insights.nextBestAction,
  ]
    .join("\n")
    .trim();
}
