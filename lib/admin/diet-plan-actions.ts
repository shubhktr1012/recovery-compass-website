import { DIET_PLAN_STANDALONE_PRICE_INR } from "@/lib/diet-plan-product";
import { normalizeDietPlanQuestionnaireData } from "@/lib/diet-plan-questionnaire";

const DEFAULT_DIET_PLAN_PRICE_PAISE = DIET_PLAN_STANDALONE_PRICE_INR * 100;
const MAX_MANUAL_DIET_PLAN_PRICE_PAISE = 1000000;

export type ParsedManualDietPlanOrder = {
  adminNotes: string | null;
  amount: number;
  email: string;
  evidence: string;
  name: string | null;
  paymentLinkUrl: string;
  questionnaireData: Record<string, unknown>;
  reason: string;
};

export type ParsedManualDietPlanPayment = {
  evidence: string;
  orderId: string;
  paymentReference: string;
  reason: string;
  triggerGeneration: boolean;
};

export function normalizeAdminText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function normalizeAdminEmail(value: unknown) {
  return normalizeAdminText(value).toLowerCase();
}

export function isValidAdminEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isValidUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function parseAmountInPaise(value: unknown) {
  if (value === undefined || value === null || value === "") {
    return DEFAULT_DIET_PLAN_PRICE_PAISE;
  }

  const amount = typeof value === "number" ? value : Number.parseInt(String(value), 10);
  if (
    !Number.isFinite(amount) ||
    !Number.isInteger(amount) ||
    amount <= 0 ||
    amount > MAX_MANUAL_DIET_PLAN_PRICE_PAISE
  ) {
    throw new Error("Amount must be a positive paise value below Rs 10,000.");
  }

  return amount;
}

function parseHttpsUrl(value: unknown) {
  const url = normalizeAdminText(value);
  if (!url) {
    throw new Error("Razorpay payment link URL is required.");
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error("Razorpay payment link URL must be a valid URL.");
  }

  if (parsed.protocol !== "https:") {
    throw new Error("Razorpay payment link URL must use HTTPS.");
  }

  return parsed.toString();
}

function parseQuestionnaireData(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Questionnaire data is required.");
  }

  return normalizeDietPlanQuestionnaireData(value as Record<string, unknown>);
}

export function parseManualDietPlanOrderPayload(body: unknown): ParsedManualDietPlanOrder {
  const payload = body && typeof body === "object" ? body as Record<string, unknown> : {};
  const email = normalizeAdminEmail(payload.email);
  const reason = normalizeAdminText(payload.reason);
  const evidence = normalizeAdminText(payload.evidence);

  if (!isValidAdminEmail(email)) {
    throw new Error("A valid client email is required.");
  }

  if (reason.length < 3 || evidence.length < 3) {
    throw new Error("Reason and evidence are required.");
  }

  const questionnaireData = parseQuestionnaireData(payload.questionnaireData);
  const questionnaireName = normalizeAdminText(questionnaireData.name);

  return {
    adminNotes: normalizeAdminText(payload.adminNotes) || null,
    amount: parseAmountInPaise(payload.amountInPaise),
    email,
    evidence,
    name: normalizeAdminText(payload.name) || questionnaireName || null,
    paymentLinkUrl: parseHttpsUrl(payload.paymentLinkUrl),
    questionnaireData,
    reason,
  };
}

export function parseManualDietPlanPaymentPayload(body: unknown): ParsedManualDietPlanPayment {
  const payload = body && typeof body === "object" ? body as Record<string, unknown> : {};
  const orderId = normalizeAdminText(payload.orderId);
  const paymentReference = normalizeAdminText(payload.paymentReference);
  const reason = normalizeAdminText(payload.reason);
  const evidence = normalizeAdminText(payload.evidence);

  if (!isValidUuid(orderId)) {
    throw new Error("A valid diet plan order id is required.");
  }

  if (paymentReference.length < 3) {
    throw new Error("Payment reference is required.");
  }

  if (reason.length < 3 || evidence.length < 3) {
    throw new Error("Reason and evidence are required.");
  }

  return {
    evidence,
    orderId,
    paymentReference,
    reason,
    triggerGeneration: payload.triggerGeneration !== false,
  };
}

export function parseDietPlanGenerationPayload(body: unknown) {
  const payload = body && typeof body === "object" ? body as Record<string, unknown> : {};
  const orderId = normalizeAdminText(payload.orderId);
  const reason = normalizeAdminText(payload.reason);
  const evidence = normalizeAdminText(payload.evidence);

  if (!isValidUuid(orderId)) {
    throw new Error("A valid diet plan order id is required.");
  }

  if (reason.length < 3 || evidence.length < 3) {
    throw new Error("Reason and evidence are required.");
  }

  return { evidence, orderId, reason };
}

export function getAdminRouteBaseUrl(request: Request) {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    new URL(request.url).origin
  ).replace(/\/$/, "");
}

export async function triggerDietPlanGeneration({
  baseUrl,
  orderId,
}: {
  baseUrl: string;
  orderId: string;
}) {
  if (!process.env.DIET_PLAN_INTERNAL_SECRET) {
    throw new Error("DIET_PLAN_INTERNAL_SECRET is not configured.");
  }

  const response = await fetch(`${baseUrl}/api/diet-plan/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-internal-secret": process.env.DIET_PLAN_INTERNAL_SECRET,
    },
    body: JSON.stringify({ orderId }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "(unreadable)");
    throw new Error(`Diet plan generation trigger failed (${response.status}): ${body}`);
  }
}
