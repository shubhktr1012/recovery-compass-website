import { DIET_PLAN_SYSTEM_PROMPT } from "@/lib/diet-plan-prompt";
import { DIET_PLAN_RESPONSE_SCHEMA, validateDietPlanJson } from "@/lib/diet-plan-schema";

const DEFAULT_GEMINI_MODEL = "gemini-3.5-flash";
const DEFAULT_GEMINI_FALLBACK_MODEL = "gemini-2.5-flash";
const DEFAULT_ANTHROPIC_MODEL = "claude-sonnet-4-20250514";
const DEFAULT_GEMINI_MAX_OUTPUT_TOKENS = 24000;
const DEFAULT_ANTHROPIC_MAX_TOKENS = 12000;

export type DietPlanAiProvider = "gemini" | "anthropic";

function getErrorMessage(error: unknown) {
    if (error instanceof Error) {
        return error.message;
    }

    return "Unknown diet plan generation error";
}

function stripJsonFences(text: string) {
    return text
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/```\s*$/i, "")
        .trim();
}

function getPositiveIntegerEnv(name: string, fallback: number) {
    const value = Number.parseInt(process.env[name] ?? "", 10);
    return Number.isFinite(value) && value > 0 ? value : fallback;
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

function parseDietPlanJson(rawText: string): Record<string, unknown> {
    const cleanJson = extractJsonObject(rawText);

    try {
        const parsed = JSON.parse(cleanJson);

        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
            throw new Error("Diet plan response was not a JSON object");
        }

        return parsed as Record<string, unknown>;
    } catch (error) {
        const trimmed = cleanJson.trim();
        const isProbablyTruncated = trimmed.startsWith("{") && !trimmed.endsWith("}");
        const detail = error instanceof Error ? error.message : "Unknown parse error";

        throw new Error(
            `Failed to parse diet plan JSON${isProbablyTruncated ? " (response appears truncated)" : ""}: ${detail}. Raw start: ${cleanJson.slice(0, 200)}`
        );
    }
}

function parseAndValidateDietPlanJson(rawText: string): Record<string, unknown> {
    const parsed = parseDietPlanJson(rawText);
    const validation = validateDietPlanJson(parsed);

    if (!validation.success) {
        throw new Error(
            `Diet plan JSON failed schema validation: ${validation.errors.slice(0, 12).join("; ")}`
        );
    }

    return validation.data;
}

function buildDietPlanRepairPrompt({
    prompt,
    validationError,
}: {
    prompt: string;
    validationError: string;
}) {
    return `${prompt}

━━━ VALIDATION RETRY ━━━
The previous diet plan response failed server validation:
${validationError}

Generate the complete diet plan again. Return only raw JSON that matches the required schema. Do not include markdown, comments, explanations, or partial sections.`;
}

export function resolveDietPlanAiProvider():
    | { provider: DietPlanAiProvider }
    | { error: string } {
    const requestedProvider = process.env.DIET_PLAN_AI_PROVIDER?.trim().toLowerCase();

    if (requestedProvider === "gemini") {
        return process.env.GEMINI_API_KEY
            ? { provider: "gemini" }
            : { error: "GEMINI_API_KEY is not configured" };
    }

    if (requestedProvider === "anthropic") {
        return process.env.ANTHROPIC_API_KEY
            ? { provider: "anthropic" }
            : { error: "ANTHROPIC_API_KEY is not configured" };
    }

    if (requestedProvider) {
        return { error: "DIET_PLAN_AI_PROVIDER must be either gemini or anthropic" };
    }

    if (process.env.GEMINI_API_KEY) {
        return { provider: "gemini" };
    }

    if (process.env.ANTHROPIC_API_KEY) {
        return { provider: "anthropic" };
    }

    return { error: "GEMINI_API_KEY or ANTHROPIC_API_KEY is not configured" };
}

async function generateDietPlanJsonText({
    provider,
    prompt,
}: {
    provider: DietPlanAiProvider;
    prompt: string;
}) {
    if (provider === "gemini") {
        return generateDietPlanWithGemini(prompt);
    }

    return generateDietPlanWithAnthropic(prompt);
}

export async function generateValidatedDietPlanJson({
    provider,
    prompt,
}: {
    provider: DietPlanAiProvider;
    prompt: string;
}) {
    const rawText = await generateDietPlanJsonText({ provider, prompt });

    try {
        return parseAndValidateDietPlanJson(rawText);
    } catch (error) {
        if (provider !== "gemini") {
            throw error;
        }

        const validationError = getErrorMessage(error);
        console.warn(`[DietPlan] Gemini response failed validation. Retrying once. ${validationError}`);

        const retryRawText = await generateDietPlanJsonText({
            provider,
            prompt: buildDietPlanRepairPrompt({ prompt, validationError }),
        });

        try {
            return parseAndValidateDietPlanJson(retryRawText);
        } catch (retryError) {
            throw new Error(`Diet plan JSON failed validation after retry: ${getErrorMessage(retryError)}`);
        }
    }
}

async function generateDietPlanWithGemini(prompt: string) {
    const model = process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL;
    const fallbackModel = process.env.GEMINI_FALLBACK_MODEL || DEFAULT_GEMINI_FALLBACK_MODEL;

    try {
        return await callGeminiModel({ model, prompt });
    } catch (error) {
        if (
            fallbackModel &&
            fallbackModel !== model &&
            error instanceof Error &&
            error.message.includes("Gemini API error 429")
        ) {
            console.warn(`[DietPlan] Gemini model ${model} hit quota. Retrying with ${fallbackModel}.`);
            return callGeminiModel({ model: fallbackModel, prompt });
        }

        throw error;
    }
}

async function callGeminiModel({
    model,
    prompt,
}: {
    model: string;
    prompt: string;
}) {
    const maxOutputTokens = getPositiveIntegerEnv(
        "GEMINI_MAX_OUTPUT_TOKENS",
        DEFAULT_GEMINI_MAX_OUTPUT_TOKENS
    );
    const generationConfig: Record<string, unknown> = {
        maxOutputTokens,
        responseMimeType: "application/json",
        responseJsonSchema: DIET_PLAN_RESPONSE_SCHEMA,
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
                    parts: [{ text: DIET_PLAN_SYSTEM_PROMPT }],
                },
                contents: [
                    {
                        role: "user",
                        parts: [{ text: prompt }],
                    },
                ],
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
    const rawText = data.candidates?.[0]?.content?.parts
        ?.map((part: { text?: string }) => part.text)
        .filter(Boolean)
        .join("") ?? "";

    if (!rawText) {
        throw new Error(`Gemini returned an empty response${finishReason ? ` (${finishReason})` : ""}`);
    }

    if (finishReason && finishReason !== "STOP") {
        throw new Error(
            `Gemini stopped before completing JSON (${finishReason}) for model ${model} with maxOutputTokens=${maxOutputTokens}. Raw start: ${rawText.slice(0, 200)}`
        );
    }

    return rawText;
}

async function generateDietPlanWithAnthropic(prompt: string) {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.ANTHROPIC_API_KEY!,
            "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
            model: process.env.ANTHROPIC_MODEL || DEFAULT_ANTHROPIC_MODEL,
            max_tokens: getPositiveIntegerEnv("ANTHROPIC_MAX_TOKENS", DEFAULT_ANTHROPIC_MAX_TOKENS),
            system: DIET_PLAN_SYSTEM_PROMPT,
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
        }),
    });

    if (!response.ok) {
        const body = await response.text().catch(() => "");
        throw new Error(`Anthropic API error ${response.status}: ${body}`);
    }

    const data = await response.json();
    const rawText = data.content?.find?.(
        (part: { type?: string; text?: string }) => part?.type === "text" && typeof part.text === "string"
    )?.text ?? data.content?.[0]?.text ?? "";

    if (!rawText) {
        throw new Error("Anthropic returned an empty response");
    }

    return rawText;
}
