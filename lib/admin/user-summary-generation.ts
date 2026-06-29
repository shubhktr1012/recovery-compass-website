import {
  ADMIN_USER_SUMMARY_RESPONSE_SCHEMA,
  validateAdminUserSummaryJson,
  type AdminUserSummary,
} from "@/lib/admin/user-summary-schema";
import { dedupeAdminUserSummaryBullets } from "@/lib/admin/user-summary-dedupe";

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
const DEFAULT_MAX_OUTPUT_TOKENS = 8192;
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

export const ADMIN_USER_SUMMARY_SYSTEM_PROMPT = `You are Recovery Compass's internal admin assistant. You write factual, categorized user summaries for support and sales teams (Anjan and ops).

Rules:
- Use ONLY facts present in the provided JSON context. Label inferences clearly when unavoidable.
- No medical advice. Do not diagnose or prescribe.
- Distinguish paid program owners, Free Detox-only users, and prospects with no app activity.
- When the user has program access but no web transactions, note likely app-store purchase.
- When data is missing, say so briefly in the relevant section instead of inventing details.
- Keep bullets concise and actionable (max 4 per section).
- Keep each section summary to 1-2 sentences. Brevity is required — do not write long paragraphs.
- Write for an Indian wellness product context.
- Do not repeat the same fact in more than one section. If a fact fits multiple sections, put it in the most specific section only.
- The admin page already shows email, program count, transaction count, onboarding, and preference KPIs plus detail tables below — do not restate raw counts unless you add interpretation (e.g. "only 1 of 5 programs active").

Section ownership (each fact belongs in ONE section only):
- headline: One-line persona snapshot. No detail bullets.
- overview: Account type bucket (prospect / Free Detox / paid owner), signup recency, onboarding yes/no. No program day detail, no spend, no questionnaire answers.
- profileAndIntent: Questionnaire answers, primary concern, web leads, stated goals. No program progress or engagement.
- programOwnership: Which programs are owned, queue rank, paused/completed/scheduled state. No day/card engagement metrics.
- appUsageAndActivity: Engagement level, last activity, day/card progress, Free Detox progress (day X of 6), journal/check-ins, recent events. Do not re-list owned program names or purchase history.
- purchasesAndRevenue: Web transactions, spend, referral redemptions. No diet-plan order detail.
- dietAndAddOns: Diet plan orders and delivery status only.
- communication: Email delivery, push/WhatsApp consent, notification settings. No sales angles.
- salesAndOutreach: Pitch framing, talking points, and recommended tone for WhatsApp/call. Reference facts by implication; do not re-copy bullets from other sections.
- risksAndOpenIssues: Blockers and open issues not already covered elsewhere (stuck orders, delivery failures, long inactivity).
- nextBestAction: One concrete action for the admin. No section recap.`;

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

function parseSummaryJson(rawText: string): Record<string, unknown> {
  const cleanJson = extractJsonObject(rawText);
  const parsed = JSON.parse(cleanJson);

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("User summary response was not a JSON object");
  }

  return parsed as Record<string, unknown>;
}

function parseAndValidateSummaryJson(rawText: string): AdminUserSummary {
  const parsed = parseSummaryJson(rawText);
  const validation = validateAdminUserSummaryJson(parsed);

  if (!validation.success) {
    throw new Error(`User summary JSON failed validation: ${validation.errors.slice(0, 8).join("; ")}`);
  }

  return dedupeAdminUserSummaryBullets(validation.data);
}

function buildRepairPrompt(prompt: string, validationError: string) {
  return `${prompt}

VALIDATION RETRY
The previous response failed validation:
${validationError}

Return the complete summary JSON again. Raw JSON only.`;
}

export function buildAdminUserSummaryPrompt(contextJson: Record<string, unknown>) {
  return `Create an admin user summary from this Recovery Compass user context JSON.

Return JSON matching the required schema with all sections populated. Use empty-state copy when a section has no data.
Be concise: each section summary should be 1-2 sentences with at most 4 bullets.

USER CONTEXT:
${JSON.stringify(contextJson, null, 2)}`;
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
    responseJsonSchema: ADMIN_USER_SUMMARY_RESPONSE_SCHEMA,
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

async function callGeminiForUserSummary(
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
  contextJson: Record<string, unknown>
): Promise<{ model: string; summary: AdminUserSummary }> {
  const provider = resolveGeminiProvider();
  if ("error" in provider) {
    throw new Error(provider.error);
  }

  if (provider.provider !== "gemini") {
    throw new Error("Admin user summaries currently require Gemini (set DIET_PLAN_AI_PROVIDER=gemini).");
  }

  const prompt = buildAdminUserSummaryPrompt(contextJson);
  const first = await callGeminiForUserSummary(prompt);

  try {
    return { model: first.model, summary: parseAndValidateSummaryJson(first.rawText) };
  } catch (error) {
    const validationError = getErrorMessage(error);
    console.warn("[AdminUserSummary] Validation failed, retrying once.", validationError);
    const retry = await callGeminiForUserSummary(buildRepairPrompt(prompt, validationError));
    return { model: retry.model, summary: parseAndValidateSummaryJson(retry.rawText) };
  }
}

export function resolveAdminUserSummaryModel() {
  return (
    process.env.ADMIN_USER_SUMMARY_MODEL?.trim() ||
    process.env.GEMINI_MODEL ||
    DEFAULT_ADMIN_USER_SUMMARY_MODEL
  );
}
