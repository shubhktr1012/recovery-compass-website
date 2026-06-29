import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { buildDietPlanPrompt } from "@/lib/diet-plan-prompt";
import {
    generateValidatedDietPlanJson,
    resolveDietPlanAiProvider,
} from "@/lib/diet-plan-generation";
import { renderDietPlanHtml } from "@/lib/diet-plan-pdf-template";
import { sendDietPlanEmail } from "@/lib/mail";
import { generatePdf } from "@/lib/pdf-generator";
import { isDietPlanGenerationStale } from "@/lib/diet-plan-generation-state";
import {
    mapProgramSlugToDietQuestionnaireValue,
    normalizeDietPlanQuestionnaireData,
    withDietPlanQuestionnairePrograms,
} from "@/lib/diet-plan-questionnaire";

export const maxDuration = 300;

function getErrorMessage(error: unknown) {
    if (error instanceof Error) {
        return error.message;
    }

    return "Unknown diet plan generation error";
}

function sanitizeFilenamePart(value: string) {
    return value
        .trim()
        .replace(/[^a-z0-9-]+/gi, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 60) || "Client";
}

function normalizeOrderEmail(value: unknown) {
    return typeof value === "string" ? value.trim().toLowerCase() : "";
}

async function loadOwnedProgramTitlesByEmail({
    email,
    supabase,
}: {
    email: string;
    supabase: ReturnType<typeof getSupabaseAdmin>;
}) {
    if (!email) {
        return [];
    }

    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .ilike("email", email)
        .maybeSingle();

    if (profileError) {
        throw new Error(`Failed to load profile for diet plan enrichment: ${profileError.message}`);
    }

    if (!profile?.id) {
        return [];
    }

    const { data: accessRows, error: accessError } = await supabase
        .from("program_access")
        .select("owned_program, purchase_state")
        .eq("user_id", profile.id)
        .in("purchase_state", ["owned_active", "owned_completed", "owned_archived"]);

    if (accessError) {
        throw new Error(`Failed to load owned programs for diet plan enrichment: ${accessError.message}`);
    }

    return Array.from(
        new Set(
            (accessRows ?? [])
                .map((row) => mapProgramSlugToDietQuestionnaireValue(row.owned_program))
                .filter((value): value is string => Boolean(value))
        )
    );
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
    const requestStartedAt = Date.now();

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

    const isStaleGeneration = isDietPlanGenerationStale({
        claimedAt: order.claimed_at,
        status: order.status,
        updatedAt: order.updated_at,
    });

    if (order.status === "generating" && !isStaleGeneration) {
        return NextResponse.json({ message: "Already generating" });
    }

    if (!["pending", "failed"].includes(order.status) && !isStaleGeneration) {
        return NextResponse.json(
            { message: `Order is not ready for generation. Current status: ${order.status}` },
            { status: 409 }
        );
    }

    const attemptStartedAt = new Date().toISOString();
    let claimQuery = supabase
        .from("diet_plan_orders")
        .update({
            claimed_at: attemptStartedAt,
            status: "generating",
            error_message: null,
        })
        .eq("id", orderId)
        .eq("status", order.status);

    if (isStaleGeneration && order.updated_at) {
        claimQuery = claimQuery.eq("updated_at", order.updated_at);
    }

    const { data: claimedOrder, error: claimError } = await claimQuery
        .select("id")
        .maybeSingle();

    if (claimError) {
        return NextResponse.json(
            { message: `Failed to claim order for generation: ${claimError.message}` },
            { status: 500 }
        );
    }

    if (!claimedOrder) {
        return NextResponse.json({ message: "Order is already being processed" });
    }

    console.info("[DietPlan] Generation started", {
        attemptStartedAt,
        orderId,
        provider: aiProvider.provider,
        recoveredStaleAttempt: isStaleGeneration,
    });

    try {
        const rawQuestionnaireData =
            order.questionnaire_data && typeof order.questionnaire_data === "object"
                ? order.questionnaire_data as Record<string, unknown>
                : {};
        let questionnaireData = normalizeDietPlanQuestionnaireData(rawQuestionnaireData);

        if (!Array.isArray(questionnaireData.programs) || questionnaireData.programs.length === 0) {
            const ownedPrograms = await loadOwnedProgramTitlesByEmail({
                email: normalizeOrderEmail(order.email),
                supabase,
            });

            questionnaireData = withDietPlanQuestionnairePrograms(questionnaireData, ownedPrograms);
        }

        const questionnaireChanged =
            JSON.stringify(questionnaireData) !== JSON.stringify(rawQuestionnaireData);
        const normalizedOrderName =
            typeof questionnaireData.name === "string" && questionnaireData.name.trim()
                ? questionnaireData.name.trim()
                : null;

        if (questionnaireChanged || (normalizedOrderName && normalizedOrderName !== order.name)) {
            const { error: questionnaireUpdateError } = await supabase
                .from("diet_plan_orders")
                .update({
                    name: normalizedOrderName ?? order.name,
                    questionnaire_data: questionnaireData,
                })
                .eq("id", orderId);

            if (questionnaireUpdateError) {
                console.warn("[DietPlan] Failed to persist normalized questionnaire data", {
                    error: questionnaireUpdateError.message,
                    orderId,
                });
            }
        }

        const prompt = buildDietPlanPrompt(questionnaireData);
        console.info("[DietPlan] Requesting AI plan", { orderId });
        const dietPlan = await generateValidatedDietPlanJson({
            provider: aiProvider.provider,
            prompt,
        });
        console.info("[DietPlan] AI plan validated", {
            elapsedMs: Date.now() - requestStartedAt,
            orderId,
        });

        const html = renderDietPlanHtml(dietPlan, questionnaireData);
        const pdfBuffer = await generatePdf(html);
        console.info("[DietPlan] PDF generated", {
            bytes: pdfBuffer.byteLength,
            elapsedMs: Date.now() - requestStartedAt,
            orderId,
        });
        const clientName = String(normalizedOrderName || order.name || "there");

        const dedupeKey = `diet_plan_delivery:${orderId}`;
        const { data: existingDelivery, error: existingDeliveryError } = await supabase
            .from("outbound_email_deliveries")
            .select("id,status")
            .eq("dedupe_key", dedupeKey)
            .maybeSingle();

        if (existingDeliveryError) {
            throw new Error(`Failed to inspect diet plan email delivery: ${existingDeliveryError.message}`);
        }

        if (existingDelivery?.status === "sent") {
            const { error: fulfilledError } = await supabase
                .from("diet_plan_orders")
                .update({
                    status: "fulfilled",
                    fulfilled_at: new Date().toISOString(),
                    error_message: null,
                })
                .eq("id", orderId)
                .eq("status", "generating")
                .eq("claimed_at", attemptStartedAt);

            if (fulfilledError) {
                throw new Error(`Failed to reconcile delivered diet plan: ${fulfilledError.message}`);
            }

            return NextResponse.json({ success: true, deduped: true });
        }

        const deliveryPayload = {
            dedupe_key: dedupeKey,
            email_type: "diet_plan_delivery",
            last_error: null,
            metadata: { order_id: orderId },
            provider: "resend",
            recipient_email: order.email,
            status: "pending",
        };
        const { data: delivery, error: deliveryError } = existingDelivery
            ? await supabase
                .from("outbound_email_deliveries")
                .update(deliveryPayload)
                .eq("id", existingDelivery.id)
                .select("id")
                .single()
            : await supabase
                .from("outbound_email_deliveries")
                .insert(deliveryPayload)
                .select("id")
                .single();

        if (deliveryError || !delivery) {
            throw new Error(`Failed to record diet plan email delivery: ${deliveryError?.message ?? "Unknown error"}`);
        }

        const emailResult = await sendDietPlanEmail({
            to: order.email,
            clientName,
            pdfBuffer,
            pdfFilename: `RC-Diet-Plan-${sanitizeFilenamePart(clientName)}.pdf`,
        });

        if (!emailResult.success) {
            await supabase
                .from("outbound_email_deliveries")
                .update({
                    last_error: emailResult.error ?? "Unknown email error",
                    status: "failed",
                })
                .eq("id", delivery.id);
            throw new Error(`Email send failed: ${emailResult.error ?? "Unknown email error"}`);
        }

        const { error: deliverySentError } = await supabase
            .from("outbound_email_deliveries")
            .update({
                last_error: null,
                metadata: {
                    order_id: orderId,
                    provider_email_id: emailResult.id ?? null,
                },
                sent_at: new Date().toISOString(),
                status: "sent",
            })
            .eq("id", delivery.id);

        if (deliverySentError) {
            throw new Error(`Failed to record diet plan email success: ${deliverySentError.message}`);
        }

        const { data: fulfilledOrder, error: fulfilledError } = await supabase
            .from("diet_plan_orders")
            .update({
                status: "fulfilled",
                fulfilled_at: new Date().toISOString(),
                error_message: null,
            })
            .eq("id", orderId)
            .eq("status", "generating")
            .eq("claimed_at", attemptStartedAt)
            .select("id")
            .maybeSingle();

        if (fulfilledError) {
            throw new Error(`Failed to mark diet plan fulfilled: ${fulfilledError.message}`);
        }

        if (!fulfilledOrder) {
            throw new Error("Diet plan generation lease changed before completion");
        }

        console.info("[DietPlan] Generation completed", {
            elapsedMs: Date.now() - requestStartedAt,
            emailId: emailResult.id ?? null,
            orderId,
        });

        return NextResponse.json({ success: true, emailId: emailResult.id ?? null });
    } catch (error: unknown) {
        const message = getErrorMessage(error);
        console.error(`[DietPlan] Generation failed for order ${orderId}:`, error);

        const { error: failureUpdateError } = await supabase
            .from("diet_plan_orders")
            .update({ status: "failed", error_message: message })
            .eq("id", orderId)
            .eq("status", "generating")
            .eq("claimed_at", attemptStartedAt);

        if (failureUpdateError) {
            console.error("[DietPlan] Failed to persist generation failure", {
                error: failureUpdateError.message,
                orderId,
            });
        }

        return NextResponse.json(
            { message: "Generation failed", error: message },
            { status: 500 }
        );
    }
}
