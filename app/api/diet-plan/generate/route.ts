import { NextRequest, NextResponse } from "next/server";
import { existsSync } from "fs";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { DIET_PLAN_SYSTEM_PROMPT, buildDietPlanPrompt } from "@/lib/diet-plan-prompt";
import { renderDietPlanHtml } from "@/lib/diet-plan-pdf-template";
import { sendDietPlanEmail } from "@/lib/mail";

export const maxDuration = 60;

const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";
const DEFAULT_GEMINI_FALLBACK_MODEL = "gemini-2.5-flash";
const DEFAULT_ANTHROPIC_MODEL = "claude-sonnet-4-20250514";
const DEFAULT_GEMINI_MAX_OUTPUT_TOKENS = 24000;
const DEFAULT_ANTHROPIC_MAX_TOKENS = 12000;

type DietPlanAiProvider = "gemini" | "anthropic";

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

function sanitizeFilenamePart(value: string) {
    return value
        .trim()
        .replace(/[^a-z0-9-]+/gi, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 60) || "Client";
}

function getDevChromeExecutablePath() {
    const candidates = [
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        "/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary",
        "/Applications/Chromium.app/Contents/MacOS/Chromium",
    ];

    return candidates.find((candidate) => existsSync(candidate));
}

function resolveDietPlanAiProvider():
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
                generationConfig: {
                    temperature: 0.35,
                    maxOutputTokens,
                    responseMimeType: "application/json",
                },
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

export async function POST(req: NextRequest) {
    const expectedSecret = process.env.DIET_PLAN_INTERNAL_SECRET;
    const secret = req.headers.get("x-internal-secret");

    if (!expectedSecret) {
        return NextResponse.json(
            { message: "DIET_PLAN_INTERNAL_SECRET is not configured" },
            { status: 500 }
        );
    }

    if (!secret || secret !== expectedSecret) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const aiProvider = resolveDietPlanAiProvider();

    if ("error" in aiProvider) {
        return NextResponse.json(
            { message: aiProvider.error },
            { status: 500 }
        );
    }

    let orderId: string | null = null;

    try {
        const body = await req.json();
        orderId = typeof body?.orderId === "string" ? body.orderId : null;
    } catch {
        return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
    }

    if (!orderId) {
        return NextResponse.json({ message: "orderId is required" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    const { data: order, error: fetchError } = await supabase
        .from("diet_plan_orders")
        .select("*")
        .eq("id", orderId)
        .single();

    if (fetchError || !order) {
        return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    if (order.status === "fulfilled") {
        return NextResponse.json({ message: "Already fulfilled" });
    }

    await supabase
        .from("diet_plan_orders")
        .update({ status: "generating", error_message: null })
        .eq("id", orderId);

    try {
        const questionnaireData =
            order.questionnaire_data && typeof order.questionnaire_data === "object"
                ? order.questionnaire_data as Record<string, unknown>
                : {};

        const rawText = await generateDietPlanJsonText({
            provider: aiProvider.provider,
            prompt: buildDietPlanPrompt(questionnaireData),
        });
        const dietPlan = parseDietPlanJson(rawText);

        const html = renderDietPlanHtml(dietPlan, questionnaireData);
        const pdfBuffer = await generatePdf(html);
        const clientName = String(questionnaireData.name || order.name || "there");

        const emailResult = await sendDietPlanEmail({
            to: order.email,
            clientName,
            pdfBuffer,
            pdfFilename: `RC-Diet-Plan-${sanitizeFilenamePart(clientName)}.pdf`,
        });

        if (!emailResult.success) {
            throw new Error(`Email send failed: ${emailResult.error ?? "Unknown email error"}`);
        }

        await supabase
            .from("diet_plan_orders")
            .update({
                status: "fulfilled",
                fulfilled_at: new Date().toISOString(),
                error_message: null,
            })
            .eq("id", orderId);

        return NextResponse.json({ success: true, emailId: emailResult.id ?? null });
    } catch (error: unknown) {
        const message = getErrorMessage(error);
        console.error(`[DietPlan] Generation failed for order ${orderId}:`, error);

        await supabase
            .from("diet_plan_orders")
            .update({ status: "failed", error_message: message })
            .eq("id", orderId);

        return NextResponse.json(
            { message: "Generation failed", error: message },
            { status: 500 }
        );
    }
}

async function generatePdf(html: string): Promise<Buffer> {
    type PdfPage = {
        setContent: (content: string, options: { waitUntil: "networkidle0" }) => Promise<void>;
        pdf: (options: {
            format: "A4";
            printBackground: boolean;
            margin: { top: string; right: string; bottom: string; left: string };
        }) => Promise<Uint8Array>;
    };
    type PdfBrowser = {
        newPage: () => Promise<PdfPage>;
        close: () => Promise<void>;
    };

    let browser: PdfBrowser | null = null;

    try {
        if (process.env.NODE_ENV === "production") {
            const chromium = (await import("@sparticuz/chromium")).default;
            const puppeteer = (await import("puppeteer-core")).default;
            const headless = "shell" as const;

            browser = await puppeteer.launch({
                args: await puppeteer.defaultArgs({ args: chromium.args, headless }),
                defaultViewport: {
                    width: 1280,
                    height: 720,
                    deviceScaleFactor: 1,
                },
                executablePath: await chromium.executablePath(),
                headless,
            }) as unknown as PdfBrowser;
        } else {
            const puppeteer = (await import("puppeteer")).default;
            browser = await puppeteer.launch({
                executablePath: getDevChromeExecutablePath(),
                headless: true,
            }) as unknown as PdfBrowser;
        }

        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: "networkidle0" });

        const pdf = await page.pdf({
            format: "A4",
            printBackground: true,
            margin: { top: "0mm", right: "0mm", bottom: "0mm", left: "0mm" },
        });

        return Buffer.from(pdf);
    } finally {
        await browser?.close();
    }
}
