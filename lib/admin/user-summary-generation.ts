import type { AdminUserSummaryContext } from "@/lib/admin/user-summary-context";
import {
  ADMIN_USER_SUMMARY_INSIGHTS_SCHEMA,
  validateAdminUserSummaryInsights,
  type AdminUserSummary,
  type AdminUserSummaryInsights,
} from "@/lib/admin/user-summary-schema";
import {
  ADMIN_USER_SUMMARY_SCHEMA_VERSION,
  buildAdminUserSummarySnapshot,
} from "@/lib/admin/user-summary-snapshot";

function resolveGeminiProvider(): { provider: "gemini" } | { error: string } {
  const requestedProvider = process.env.DIET_PLAN_AI_PROVIDER?.trim().toLowerCase();

  if (requestedProvider === "anthropic") {
    return { error: "Admin user summaries require Gemini (set DIET_PLAN_AI_PROVIDER=gemini or unset it)." };
  }

  if (requestedProvider && requestedProvider !== "gemini") {
    return { error: "DIET_PLAN_AI_PROVIDER must be either gemini or anthropic" };
  }

  return process.env.GEMINI_API_KEY
    ? { provider: "gemini" }
    : { error: "GEMINI_API_KEY is not configured" };
}

const DEFAULT_ADMIN_USER_SUMMARY_MODEL = "gemini-3.5-flash";
const DEFAULT_GEMINI_FALLBACK_MODEL = "gemini-2.5-flash";
const DEFAULT_MAX_OUTPUT_TOKENS = 4096;
const MAX_TOKENS_RETRY_MULTIPLIER = 2;
const RETRYABLE_GEMINI_STATUSES = new Set([429, 500, 502, 503]);
const GEMINI_RETRY_DELAYS_MS = [1000, 2500];

class MaxTokensSummaryError extends Error {
  constructor(
    readonly model: string,
    readonly rawText: string
  ) {
    super("Gemini stopped before completing summary (MAX_TOKENS)");
    this.name = "MaxTokensSummaryError";
  }
}

function resolveMaxOutputTokens(override?: number) {
  if (override && override > 0) {
    return override;
  }

  const configured = Number.parseInt(process.env.ADMIN_USER_SUMMARY_MAX_OUTPUT_TOKENS ?? "", 10);
  return Number.isFinite(configured) && configured > 0 ? configured : DEFAULT_MAX_OUTPUT_TOKENS;
}

export function isRetryableGeminiApiStatus(status: number) {
  return RETRYABLE_GEMINI_STATUSES.has(status);
}

export function formatAdminUserSummaryError(error: unknown) {
  const message = error instanceof Error ? error.message : "User summary generation failed";

  if (message.includes("Gemini API error 503") || message.includes('"status": "UNAVAILABLE"')) {
    return "Gemini is temporarily busy (high demand). Wait a moment and tap Regenerate — this is not a problem with this user.";
  }

  if (message.includes("Gemini API error 429")) {
    return "Gemini rate limit reached. Wait a minute and tap Regenerate.";
  }

  if (message.includes("GEMINI_API_KEY")) {
    return "Gemini API key is not configured on the server.";
  }

  if (message.includes("MAX_TOKENS")) {
    return "The AI summary was cut off because it ran too long. Tap Regenerate — we will retry with a higher limit.";
  }

  return message;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseGeminiApiStatus(message: string) {
  const match = message.match(/Gemini API error (\d{3})/);
  return match ? Number.parseInt(match[1] ?? "", 10) : null;
}

export const ADMIN_USER_SUMMARY_SYSTEM_PROMPT = `You are Recovery Compass's internal admin assistant for support and sales (Anjan and ops).

The user snapshot is already computed server-side and shown in the admin UI. Your job is insights only.

Rules:
- Use ONLY facts from the provided snapshot and data gaps. No medical advice.
- Do NOT restate snapshot rows, counts, program names, spend, or engagement metrics.
- headline: one-line persona for this user.
- salesTalkingPoints: 1-3 concrete WhatsApp/call angles (not generic).
- recommendedTone: short tone guidance (e.g. warm, direct, celebratory).
- risks: 0-3 blockers or follow-up flags; use empty array if none.
- nextBestAction: one specific action for the admin now.
- Write for an Indian wellness product context. Be brief.`;

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown user summary generation error";
}

function stripJsonFences(text: string) {
  return text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
}

function extractJsonObject(text: string) {
  const clean = stripJsonFences(text);
  const firstBrace = clean.indexOf("{");
  const lastBrace = clean.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1 || lastBrace < firstBrace) {
    return clean;
  }

  return clean.slice(firstBrace, lastBrace + 1);
}

function parseInsightsJson(rawText: string): Record<string, unknown> {
  const cleanJson = extractJsonObject(rawText);
  const parsed = JSON.parse(cleanJson);

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("User summary insights response was not a JSON object");
  }

  return parsed as Record<string, unknown>;
}

function parseAndValidateInsightsJson(rawText: string): AdminUserSummaryInsights {
  const parsed = parseInsightsJson(rawText);
  const validation = validateAdminUserSummaryInsights(parsed);

  if (!validation.success) {
    throw new Error(`User summary insights failed validation: ${validation.errors.slice(0, 8).join("; ")}`);
  }

  return validation.data;
}

function buildRepairPrompt(prompt: string, validationError: string) {
  return `${prompt}

VALIDATION RETRY
The previous response failed validation:
${validationError}

Return the complete insights JSON again. Raw JSON only.`;
}

export function buildAdminUserSummaryInsightsPrompt(args: {
  dataGaps: string[];
  snapshot: AdminUserSummary["snapshot"];
}) {
  return `Write admin user summary insights from this Recovery Compass snapshot.

The snapshot is already visible to the admin — do not repeat its values.

DATA GAPS:
${args.dataGaps.length > 0 ? args.dataGaps.map((gap) => `- ${gap}`).join("\n") : "- None"}

USER SNAPSHOT:
${JSON.stringify(args.snapshot, null, 2)}`;
}

async function callGeminiModelOnce({
  maxOutputTokens,
  model,
  prompt,
}: {
  maxOutputTokens: number;
  model: string;
  prompt: string;
}) {
  const generationConfig: Record<string, unknown> = {
    maxOutputTokens,
    responseMimeType: "application/json",
    responseJsonSchema: ADMIN_USER_SUMMARY_INSIGHTS_SCHEMA,
  };

  if (!model.startsWith("gemini-3.")) {
    generationConfig.temperature = 0.35;
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY!,
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: ADMIN_USER_SUMMARY_SYSTEM_PROMPT }],
        },
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig,
      }),
    }
  );

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Gemini API error ${response.status} for model ${model}: ${body}`);
  }

  const data = await response.json();
  const finishReason = data.candidates?.[0]?.finishReason;
  const rawText =
    data.candidates?.[0]?.content?.parts
      ?.map((part: { text?: string }) => part.text)
      .filter(Boolean)
      .join("") ?? "";

  if (!rawText) {
    throw new Error(`Gemini returned an empty summary${finishReason ? ` (${finishReason})` : ""}`);
  }

  if (finishReason === "MAX_TOKENS") {
    throw new MaxTokensSummaryError(model, rawText);
  }

  if (finishReason && finishReason !== "STOP") {
    throw new Error(`Gemini stopped before completing summary (${finishReason})`);
  }

  return rawText;
}

async function callGeminiForUserSummaryInsights(
  prompt: string,
  options: { maxOutputTokens?: number } = {}
) {
  const primaryModel = resolveAdminUserSummaryModel();
  const fallbackModel =
    process.env.GEMINI_FALLBACK_MODEL?.trim() || DEFAULT_GEMINI_FALLBACK_MODEL;
  const models =
    fallbackModel && fallbackModel !== primaryModel
      ? [primaryModel, fallbackModel]
      : [primaryModel];
  let maxOutputTokens = resolveMaxOutputTokens(options.maxOutputTokens);

  let lastError: Error | null = null;

  for (const model of models) {
    for (let attempt = 0; attempt < GEMINI_RETRY_DELAYS_MS.length + 1; attempt += 1) {
      try {
        const rawText = await callGeminiModelOnce({ maxOutputTokens, model, prompt });
        return { model, rawText };
      } catch (error) {
        if (error instanceof MaxTokensSummaryError && maxOutputTokens < 16384) {
          maxOutputTokens = Math.min(
            maxOutputTokens * MAX_TOKENS_RETRY_MULTIPLIER,
            16384
          );
          console.warn(
            `[AdminUserSummary] ${model} hit MAX_TOKENS. Retrying with maxOutputTokens=${maxOutputTokens}.`
          );
          continue;
        }

        lastError = error instanceof Error ? error : new Error(String(error));
        const status = parseGeminiApiStatus(lastError.message);
        const canRetry =
          status !== null &&
          isRetryableGeminiApiStatus(status) &&
          attempt < GEMINI_RETRY_DELAYS_MS.length;

        if (!canRetry) {
          break;
        }

        const delayMs = GEMINI_RETRY_DELAYS_MS[attempt] ?? 2500;
        console.warn(
          `[AdminUserSummary] Gemini ${status} on ${model}. Retrying in ${delayMs}ms (attempt ${attempt + 1}).`
        );
        await sleep(delayMs);
      }
    }

    if (model === primaryModel && models.length > 1) {
      console.warn(
        `[AdminUserSummary] Primary model ${primaryModel} unavailable. Trying fallback ${fallbackModel}.`
      );
    }
  }

  throw lastError ?? new Error("Gemini user summary generation failed");
}

export async function generateAdminUserSummary(
  context: AdminUserSummaryContext
): Promise<{ model: string; summary: AdminUserSummary }> {
  const provider = resolveGeminiProvider();
  if ("error" in provider) {
    throw new Error(provider.error);
  }

  if (provider.provider !== "gemini") {
    throw new Error("Admin user summaries currently require Gemini (set DIET_PLAN_AI_PROVIDER=gemini).");
  }

  const snapshot = buildAdminUserSummarySnapshot(context);
  const prompt = buildAdminUserSummaryInsightsPrompt({
    dataGaps: context.dataGaps,
    snapshot,
  });
  const first = await callGeminiForUserSummaryInsights(prompt);

  let insights: AdminUserSummaryInsights;
  try {
    insights = parseAndValidateInsightsJson(first.rawText);
  } catch (error) {
    const validationError = getErrorMessage(error);
    console.warn("[AdminUserSummary] Insights validation failed, retrying once.", validationError);
    const retry = await callGeminiForUserSummaryInsights(buildRepairPrompt(prompt, validationError));
    insights = parseAndValidateInsightsJson(retry.rawText);
  }

  return {
    model: first.model,
    summary: {
      schemaVersion: ADMIN_USER_SUMMARY_SCHEMA_VERSION,
      snapshot,
      insights,
    },
  };
}

export function resolveAdminUserSummaryModel() {
  return (
    process.env.ADMIN_USER_SUMMARY_MODEL?.trim() ||
    process.env.GEMINI_MODEL ||
    DEFAULT_ADMIN_USER_SUMMARY_MODEL
  );
}

// Backward-compatible export for tests that referenced the old prompt builder name.
export function buildAdminUserSummaryPrompt(contextJson: Record<string, unknown>) {
  return buildAdminUserSummaryInsightsPrompt({
    dataGaps: Array.isArray(contextJson.dataGaps)
      ? contextJson.dataGaps.filter((gap): gap is string => typeof gap === "string")
      : [],
    snapshot: contextJson.snapshot as AdminUserSummary["snapshot"],
  });
}
