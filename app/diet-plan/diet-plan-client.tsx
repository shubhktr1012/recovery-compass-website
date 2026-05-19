"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Script from "next/script";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NavbarSticky } from "@/components/navbar-sticky";
import { FooterVariantTwo } from "@/components/sections";
import { cn } from "@/lib/utils";

type QuestionnaireData = {
    name: string;
    age: string;
    gender: string;
    city: string;
    height: string;
    weight: string;
    conditions: string[];
    medications: string;
    allergies: string;
    diet: string;
    region: string;
    regionOther: string;
    grain: string;
    oil: string;
    fasting: string;
    btime: string;
    ltime: string;
    dtime: string;
    portion: string;
    lateeat: string;
    cooks: string;
    sepcook: string;
    activity: string;
    programs: string[];
    goal: string;
    dineout: string;
    loves: string;
    hates: string;
    spice: string;
    tea: string;
    alcohol: string;
    softdrink: string;
    other: string;
};

type CreateOrderResponse = {
    orderId: string;
    amount: number;
    currency: string;
    message?: string;
};

type VerifyPaymentResponse = {
    orderId?: string;
    message?: string;
};

type PrefillResponse = {
    name?: string;
    email?: string;
    programs?: string[];
    questionnaireData?: unknown;
    message?: string;
};

type RazorpaySuccessResponse = {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
};

type RazorpayFailureResponse = {
    error: {
        description?: string;
    };
};

type RazorpayOptions = {
    key: string | undefined;
    amount: number;
    currency: string;
    name: string;
    description: string;
    image: string;
    order_id: string;
    handler: (response: RazorpaySuccessResponse) => Promise<void>;
    prefill: {
        name: string;
        email: string;
        contact: string;
    };
    theme: {
        color: string;
    };
    modal: {
        backdropclose: boolean;
        escape: boolean;
        confirm_close: boolean;
        ondismiss: () => void;
    };
};

type RazorpayInstance = {
    on: (event: "payment.failed", handler: (response: RazorpayFailureResponse) => void) => void;
    open: () => void;
};

type RazorpayConstructor = new (options: RazorpayOptions) => RazorpayInstance;
type RazorpayWindow = Window & { Razorpay?: RazorpayConstructor };

const INITIAL_DATA: QuestionnaireData = {
    name: "",
    age: "",
    gender: "",
    city: "",
    height: "",
    weight: "",
    conditions: [],
    medications: "",
    allergies: "",
    diet: "",
    region: "",
    regionOther: "",
    grain: "",
    oil: "",
    fasting: "",
    btime: "",
    ltime: "",
    dtime: "",
    portion: "",
    lateeat: "",
    cooks: "",
    sepcook: "",
    activity: "",
    programs: [],
    goal: "",
    dineout: "",
    loves: "",
    hates: "",
    spice: "",
    tea: "",
    alcohol: "",
    softdrink: "",
    other: "",
};

const LOCAL_DRAFT_VERSION = 1;
const LOCAL_STANDALONE_DRAFT_KEY = "rc:diet-plan-draft:standalone";
const DRAFT_SAVE_DELAY_MS = 700;
const QUESTIONNAIRE_KEYS = Object.keys(INITIAL_DATA) as Array<keyof QuestionnaireData>;

type LocalDietPlanDraft = {
    version?: number;
    step?: number;
    email?: string;
    data?: unknown;
};

function getLocalDraftKey(isCartCheckout: boolean, dietOrderId: string) {
    return isCartCheckout && dietOrderId
        ? `rc:diet-plan-draft:addon:${dietOrderId}`
        : LOCAL_STANDALONE_DRAFT_KEY;
}

function clampStep(value: unknown) {
    if (typeof value !== "number" || !Number.isFinite(value)) {
        return 0;
    }

    return Math.min(Math.max(Math.round(value), 0), STEPS.length - 1);
}

function normalizeQuestionnaireDraft(value: unknown): Partial<QuestionnaireData> {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
        return {};
    }

    const record = value as Record<string, unknown>;
    const draft: Partial<QuestionnaireData> = {};

    for (const key of QUESTIONNAIRE_KEYS) {
        const expected = INITIAL_DATA[key];
        const incoming = record[key];

        if (Array.isArray(expected)) {
            if (Array.isArray(incoming)) {
                draft[key] = incoming.filter((item): item is string => typeof item === "string") as never;
            }
            continue;
        }

        if (typeof expected === "string" && typeof incoming === "string") {
            draft[key] = incoming as never;
        }
    }

    return draft;
}

function fillMissingQuestionnaireData(
    current: QuestionnaireData,
    draft: Partial<QuestionnaireData>
): QuestionnaireData {
    const next = { ...current };

    for (const key of QUESTIONNAIRE_KEYS) {
        const currentValue = next[key];
        const draftValue = draft[key];

        if (Array.isArray(currentValue)) {
            if (currentValue.length === 0 && Array.isArray(draftValue) && draftValue.length > 0) {
                next[key] = draftValue as never;
            }
            continue;
        }

        if (
            typeof currentValue === "string" &&
            currentValue.trim().length === 0 &&
            typeof draftValue === "string" &&
            draftValue.trim().length > 0
        ) {
            next[key] = draftValue as never;
        }
    }

    return next;
}

function hasDraftProgress(data: QuestionnaireData, email: string, step: number) {
    if (step > 0 || email.trim().length > 0) {
        return true;
    }

    return QUESTIONNAIRE_KEYS.some((key) => {
        const value = data[key];
        return Array.isArray(value) ? value.length > 0 : value.trim().length > 0;
    });
}

const STEPS = [
    "Profile",
    "Health",
    "Food culture",
    "Daily habits",
    "Lifestyle",
    "Preferences",
    "Review & pay",
];

const genderOptions = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Other", value: "other" },
];

const conditionOptions = [
    { label: "Type 2 diabetes", value: "Type 2 diabetes" },
    { label: "Type 1 diabetes", value: "Type 1 diabetes" },
    { label: "Pre-diabetes", value: "Pre-diabetes" },
    { label: "High blood pressure", value: "High blood pressure" },
    { label: "High cholesterol", value: "High cholesterol" },
    { label: "Thyroid condition", value: "Thyroid" },
    { label: "PCOS / PCOD", value: "PCOS / PCOD" },
    { label: "Heart condition", value: "Heart condition" },
    { label: "Kidney issues", value: "Kidney issues" },
    { label: "Fatty liver", value: "Fatty liver" },
    { label: "Anaemia", value: "Anaemia" },
    { label: "Acidity / IBS", value: "Acidity / IBS" },
    { label: "Pregnant / breastfeeding", value: "Pregnant / breastfeeding" },
    { label: "None of the above", value: "None" },
];

const dietOptions = [
    { label: "Pure vegetarian", value: "Pure vegetarian" },
    { label: "Vegan", value: "Vegan" },
    { label: "Eggetarian", value: "Eggetarian" },
    { label: "Non-vegetarian", value: "Non-vegetarian" },
    { label: "Non-veg (no beef)", value: "No beef" },
    { label: "Non-veg (no pork)", value: "No pork" },
    { label: "Fish only", value: "Fish only" },
    { label: "Jain", value: "Jain" },
];

const regionOptions = [
    { label: "Kerala", value: "Kerala" },
    { label: "Tamil Nadu", value: "Tamil Nadu" },
    { label: "Andhra", value: "Andhra / Telangana" },
    { label: "Karnataka", value: "Karnataka" },
    { label: "Maharashtra", value: "Maharashtra" },
    { label: "Punjab", value: "Punjab" },
    { label: "Gujarat", value: "Gujarat" },
    { label: "Bengal", value: "Bengal" },
    { label: "Rajasthan", value: "Rajasthan" },
    { label: "UP / Bihar", value: "UP / Bihar" },
    { label: "Northeast", value: "Northeast" },
    { label: "Other", value: "Other" },
];

const grainOptions = [
    { label: "White rice", value: "White rice" },
    { label: "Brown / red rice", value: "Brown / red rice" },
    { label: "Wheat roti", value: "Wheat roti" },
    { label: "Ragi / millets", value: "Ragi / bajra / jowar" },
    { label: "Mix of above", value: "Mix" },
];

const oilOptions = [
    { label: "Coconut oil", value: "Coconut oil" },
    { label: "Mustard oil", value: "Mustard oil" },
    { label: "Groundnut oil", value: "Groundnut oil" },
    { label: "Sunflower oil", value: "Sunflower oil" },
    { label: "Ghee", value: "Ghee" },
    { label: "Olive oil", value: "Olive oil" },
];

const portionOptions = [
    { label: "Small eater", value: "Small" },
    { label: "Medium", value: "Medium" },
    { label: "Large eater", value: "Large" },
];

const lateEatOptions = [
    { label: "Never", value: "Never" },
    { label: "Sometimes", value: "Sometimes" },
    { label: "Most nights", value: "Most nights" },
];

const cooksOptions = [
    { label: "Cooks themselves", value: "Cooks themselves" },
    { label: "Family cooks", value: "Family member cooks" },
    { label: "Tiffin / delivery", value: "Tiffin / delivery" },
    { label: "Mostly eats out", value: "Mostly eats out" },
];

const separateCookingOptions = [
    { label: "Yes, fine with it", value: "Yes, fine with it" },
    { label: "No — must use family meal", value: "No, same as family" },
    { label: "Small add-ons only", value: "Small add-ons only" },
];

const activityOptions = [
    { label: "Sedentary (desk job)", value: "Sedentary" },
    { label: "Lightly active", value: "Light" },
    { label: "Moderate (3-4x/week)", value: "Moderate" },
    { label: "Very active (daily)", value: "Very active" },
];

const programOptions = [
    { label: "6-Day Control", value: "6-Day Control" },
    { label: "Sleep Reset", value: "Sleep Reset" },
    { label: "Energy Vitality", value: "Energy Vitality" },
    { label: "Men's Vitality", value: "Men's Vitality" },
    { label: "Female Age Reversal", value: "Female Age Reversal" },
    { label: "90-Day Master", value: "90-Day Master" },
    { label: "None yet", value: "None yet" },
];

const goalOptions = [
    { label: "Blood sugar control", value: "Blood sugar control" },
    { label: "Weight loss", value: "Weight loss" },
    { label: "Weight gain", value: "Weight gain" },
    { label: "More energy", value: "More energy" },
    { label: "Better sleep", value: "Better sleep" },
    { label: "Hormonal balance", value: "Hormonal balance" },
    { label: "Gut health", value: "Gut health" },
    { label: "General wellness", value: "General wellness" },
];

const dineOutOptions = [
    { label: "Rarely", value: "Rarely" },
    { label: "Weekly", value: "Weekly" },
    { label: "Frequently", value: "Frequently" },
    { label: "Most meals", value: "Most meals" },
];

const spiceOptions = [
    { label: "Mild", value: "Mild" },
    { label: "Medium", value: "Medium" },
    { label: "Very spicy", value: "Very spicy" },
];

const alcoholOptions = [
    { label: "None", value: "None" },
    { label: "Occasional", value: "Occasional" },
    { label: "Weekly", value: "Weekly" },
    { label: "Daily", value: "Daily" },
];

const softDrinkOptions = [
    { label: "Never", value: "Never" },
    { label: "Occasionally", value: "Occasionally" },
    { label: "Daily habit", value: "Daily habit" },
];

function getErrorMessage(error: unknown) {
    if (error instanceof Error) {
        return error.message;
    }

    return "Something went wrong";
}

function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function FieldLabel({ children }: { children: React.ReactNode }) {
    return (
        <label className="mb-2.5 block text-sm font-bold text-[oklch(0.2475_0.0661_146.79)]/70">
            {children}
        </label>
    );
}

function Hint({ children }: { children: React.ReactNode }) {
    return (
        <p className="mt-2.5 text-[13px] font-medium leading-relaxed text-[oklch(0.2475_0.0661_146.79)]/50">
            {children}
        </p>
    );
}

function TextField({
    id,
    label,
    value,
    onChange,
    placeholder,
    type = "text",
    min,
    max,
}: {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: string;
    min?: number;
    max?: number;
}) {
    return (
        <div>
            <FieldLabel>{label}</FieldLabel>
            <Input
                id={id}
                type={type}
                min={min}
                max={max}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                className="h-[52px] rounded-2xl border-[#06290C]/12 bg-white px-4 text-[15px] font-medium text-[#06290C] shadow-sm shadow-[#06290C]/[0.02] transition-[border-color,box-shadow] placeholder:text-[#06290C]/35 focus-visible:border-[#06290C]/30 focus-visible:ring-4 focus-visible:ring-[#06290C]/[0.08]"
            />
        </div>
    );
}

function TextAreaField({
    id,
    label,
    value,
    onChange,
    placeholder,
    hint,
}: {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    hint?: string;
}) {
    return (
        <div>
            <FieldLabel>{label}</FieldLabel>
            <textarea
                id={id}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                className="min-h-[110px] w-full resize-y rounded-2xl border border-[#06290C]/12 bg-white px-4 py-4 text-[15px] font-medium leading-relaxed text-[#06290C] shadow-sm shadow-[#06290C]/[0.02] outline-none transition-[color,box-shadow,border-color] placeholder:text-[#06290C]/35 focus-visible:border-[#06290C]/30 focus-visible:ring-4 focus-visible:ring-[#06290C]/[0.08]"
            />
            {hint ? <Hint>{hint}</Hint> : null}
        </div>
    );
}

function PillGroup({
    id,
    value,
    options,
    onChange,
}: {
    id: string;
    value: string;
    options: Array<{ label: string; value: string }>;
    onChange: (value: string) => void;
}) {
    return (
        <div id={id} className="flex flex-wrap gap-2">
            {options.map((option) => {
                const selected = value === option.value;

                return (
                    <motion.button
                        key={option.value}
                        type="button"
                        data-val={option.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.96 }}
                        transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                        onClick={() => onChange(selected ? "" : option.value)}
                        className={cn(
                            "rounded-[20px] border px-4 py-2.5 text-[14px] font-medium transition-colors",
                            selected
                                ? "border-[#06290C] bg-[#06290C] text-white shadow-md shadow-[#06290C]/20"
                                : "border-[#06290C]/10 bg-white text-[#06290C]/70 shadow-sm shadow-[#06290C]/[0.02] hover:border-[#06290C]/25 hover:bg-[#F5F5F7]"
                        )}
                    >
                        {option.label}
                    </motion.button>
                );
            })}
        </div>
    );
}

function CheckGroup({
    id,
    value,
    options,
    noneValue,
    onChange,
}: {
    id: string;
    value: string[];
    options: Array<{ label: string; value: string }>;
    noneValue?: string;
    onChange: (value: string[]) => void;
}) {
    function toggle(optionValue: string) {
        if (noneValue && optionValue === noneValue) {
            onChange(value.includes(optionValue) ? [] : [optionValue]);
            return;
        }

        const withoutNone = noneValue ? value.filter((item) => item !== noneValue) : value;
        onChange(
            withoutNone.includes(optionValue)
                ? withoutNone.filter((item) => item !== optionValue)
                : [...withoutNone, optionValue]
        );
    }

    return (
        <div id={id} className="grid gap-2 sm:grid-cols-2">
            {options.map((option) => {
                const selected = value.includes(option.value);

                return (
                    <motion.button
                        key={option.value}
                        type="button"
                        data-val={option.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                        onClick={() => toggle(option.value)}
                        className={cn(
                            "group flex items-center gap-3.5 rounded-2xl border p-4 text-left transition-colors",
                            selected
                                ? "border-[#06290C]/30 bg-[#F4F7F5] text-[#06290C] shadow-sm shadow-[#06290C]/5"
                                : "border-[#06290C]/10 bg-white text-[#06290C]/70 shadow-sm shadow-[#06290C]/[0.02] hover:border-[#06290C]/20"
                        )}
                    >
                        <span
                            className={cn(
                                "flex size-5 shrink-0 items-center justify-center rounded-md border text-white transition-colors",
                                selected
                                    ? "border-[#06290C] bg-[#06290C]"
                                    : "border-[#06290C]/20 bg-[#06290C]/5 group-hover:border-[#06290C]/30"
                            )}
                        >
                            <AnimatePresence>
                                {selected && (
                                    <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
                                    >
                                        <Check className="size-3" strokeWidth={3} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </span>
                        <span className="text-[15px] font-medium leading-5">{option.label}</span>
                    </motion.button>
                );
            })}
        </div>
    );
}

function SummaryRow({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex items-start justify-between gap-5 border-b border-[#06290C]/10 py-4 last:border-b-0">
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#06290C]/45">
                {label}
            </span>
            <span className="max-w-[65%] text-right text-[15px] font-medium leading-relaxed text-[#06290C]">
                {value || "-"}
            </span>
        </div>
    );
}

export function DietPlanClientContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const cartCheckoutRequested = searchParams.get("cart_checkout") === "true";
    const dietOrderId = searchParams.get("diet_order_id")?.trim() ?? "";
    const claimToken = searchParams.get("token")?.trim() ?? "";
    const hasCartCheckoutClaim = Boolean(dietOrderId && claimToken);
    const isCartCheckout = cartCheckoutRequested && hasCartCheckoutClaim;
    const [step, setStep] = useState(0);
    const [data, setData] = useState<QuestionnaireData>(INITIAL_DATA);
    const [email, setEmail] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState("");
    const [draftHydrated, setDraftHydrated] = useState(false);
    const localDraftKey = useMemo(
        () => getLocalDraftKey(isCartCheckout, dietOrderId),
        [dietOrderId, isCartCheckout]
    );
    const normalizedEmail = email.trim().toLowerCase();
    const hasProgress = useMemo(
        () => hasDraftProgress(data, email, step),
        [data, email, step]
    );
    const resolvedRegion = data.region === "Other" && data.regionOther.trim()
        ? data.regionOther.trim()
        : data.region;
    const questionnaireData = useMemo(
        () => ({
            ...data,
            region: resolvedRegion,
        }),
        [data, resolvedRegion]
    );

    useEffect(() => {
        setDraftHydrated(false);

        try {
            const rawDraft = window.localStorage.getItem(localDraftKey);

            if (rawDraft) {
                const draft = JSON.parse(rawDraft) as LocalDietPlanDraft;
                const restoredData = normalizeQuestionnaireDraft(draft.data);

                setData((current) => fillMissingQuestionnaireData(current, restoredData));
                setEmail((current) => current || (typeof draft.email === "string" ? draft.email : ""));
                setStep(clampStep(draft.step));
            }
        } catch (draftError) {
            console.warn("[DietPlan] Failed to restore local questionnaire draft:", draftError);
        } finally {
            setDraftHydrated(true);
        }
    }, [localDraftKey]);

    useEffect(() => {
        if (!draftHydrated || !cartCheckoutRequested || !hasCartCheckoutClaim) {
            return;
        }

        const controller = new AbortController();
        const params = new URLSearchParams({
            diet_order_id: dietOrderId,
            token: claimToken,
        });

        async function loadPrefill() {
            try {
                const response = await fetch(`/api/diet-plan/prefill?${params.toString()}`, {
                    signal: controller.signal,
                });
                const prefill = await response.json() as PrefillResponse;

                if (!response.ok) {
                    console.warn("[DietPlan] Prefill unavailable:", prefill.message);
                    return;
                }

                const serverDraft = normalizeQuestionnaireDraft(prefill.questionnaireData);
                setEmail((current) => current || prefill.email || "");
                setData((current) => ({
                    ...fillMissingQuestionnaireData(current, serverDraft),
                    name: current.name || serverDraft.name || prefill.name || "",
                    programs:
                        current.programs.length > 0
                            ? current.programs
                            : Array.isArray(serverDraft.programs) && serverDraft.programs.length > 0
                                ? serverDraft.programs
                            : prefill.programs && prefill.programs.length > 0
                                ? prefill.programs
                                : current.programs,
                }));
            } catch (prefillError) {
                if (prefillError instanceof DOMException && prefillError.name === "AbortError") {
                    return;
                }
                console.warn("[DietPlan] Failed to load prefill:", prefillError);
            }
        }

        void loadPrefill();

        return () => controller.abort();
    }, [cartCheckoutRequested, claimToken, dietOrderId, draftHydrated, hasCartCheckoutClaim]);

    useEffect(() => {
        if (!draftHydrated || !hasProgress) {
            return;
        }

        const timeoutId = window.setTimeout(() => {
            try {
                const draft: LocalDietPlanDraft = {
                    version: LOCAL_DRAFT_VERSION,
                    step,
                    email,
                    data,
                };

                window.localStorage.setItem(localDraftKey, JSON.stringify(draft));
            } catch (draftError) {
                console.warn("[DietPlan] Failed to save local questionnaire draft:", draftError);
            }
        }, DRAFT_SAVE_DELAY_MS);

        return () => window.clearTimeout(timeoutId);
    }, [data, draftHydrated, email, hasProgress, localDraftKey, step]);

    useEffect(() => {
        if (!draftHydrated || !isCartCheckout || !hasProgress) {
            return;
        }

        const controller = new AbortController();
        const timeoutId = window.setTimeout(async () => {
            try {
                const response = await fetch("/api/diet-plan/draft", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    signal: controller.signal,
                    body: JSON.stringify({
                        diet_order_id: dietOrderId,
                        claim_token: claimToken,
                        email: normalizedEmail,
                        name: data.name,
                        questionnaire_data: questionnaireData,
                    }),
                });

                if (!response.ok) {
                    const body = await response.json().catch(() => null) as { message?: string } | null;
                    console.warn("[DietPlan] Draft autosave unavailable:", body?.message || response.statusText);
                }
            } catch (draftError) {
                if (!(draftError instanceof DOMException && draftError.name === "AbortError")) {
                    console.warn("[DietPlan] Failed to autosave questionnaire draft:", draftError);
                }
            }
        }, DRAFT_SAVE_DELAY_MS);

        return () => {
            window.clearTimeout(timeoutId);
            controller.abort();
        };
    }, [
        claimToken,
        data.name,
        dietOrderId,
        draftHydrated,
        hasProgress,
        isCartCheckout,
        normalizedEmail,
        questionnaireData,
    ]);

    const canPay = data.name.trim().length > 0 && isValidEmail(normalizedEmail);

    const summaryRows = useMemo(() => [
        ["Name", data.name || "-"],
        ["Age", data.age || "-"],
        ["Gender", data.gender || "-"],
        ["Region", data.city || resolvedRegion || "-"],
        ["Conditions", data.conditions.join(", ") || "None"],
        ["Medications", data.medications || "None"],
        ["Diet type", data.diet || "-"],
        ["Regional cuisine", resolvedRegion || "-"],
        ["Staple grain", data.grain || "-"],
        ["Cooking oil", data.oil || "-"],
        ["Meal times", [data.btime, data.ltime, data.dtime].filter(Boolean).join(" | ") || "-"],
        ["Separate cooking", data.sepcook || "-"],
        ["Activity level", data.activity || "-"],
        ["Programs active", data.programs.join(", ") || "None"],
        ["Primary goal", data.goal || "-"],
        ["Foods loved", data.loves || "-"],
        ["Alcohol", data.alcohol || "-"],
    ], [data, resolvedRegion]);

    function updateField<Key extends keyof QuestionnaireData>(key: Key, value: QuestionnaireData[Key]) {
        setData((current) => ({ ...current, [key]: value }));
    }

    function updateRegion(value: string) {
        setData((current) => ({
            ...current,
            region: value,
            regionOther: value === "Other" ? current.regionOther : "",
        }));
    }

    function nextStep() {
        setError("");
        setStep((current) => Math.min(current + 1, STEPS.length - 1));
    }

    function previousStep() {
        setError("");
        setStep((current) => Math.max(current - 1, 0));
    }

    function clearLocalDraft() {
        try {
            window.localStorage.removeItem(localDraftKey);
        } catch (draftError) {
            console.warn("[DietPlan] Failed to clear local questionnaire draft:", draftError);
        }
    }

    function loadRazorpayScript() {
        return new Promise<boolean>((resolve) => {
            if ((window as RazorpayWindow).Razorpay) {
                resolve(true);
                return;
            }

            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    }

    async function handlePayment() {
        setError("");

        if (!canPay) {
            setError("Please enter the client name and a valid email address before payment.");
            return;
        }

        if (cartCheckoutRequested && !hasCartCheckoutClaim) {
            setError("This paid diet plan link is missing its order claim. Please return to your checkout success page and use the diet profile button there.");
            return;
        }

        setIsProcessing(true);

        try {
            if (isCartCheckout) {
                const submitResponse = await fetch("/api/diet-plan/submit-questionnaire", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        diet_order_id: dietOrderId,
                        claim_token: claimToken,
                        email: normalizedEmail,
                        name: data.name,
                        questionnaire_data: questionnaireData,
                    }),
                });

                const submitData = await submitResponse.json();

                if (!submitResponse.ok) {
                    throw new Error(submitData.message || "Failed to submit questionnaire");
                }

                clearLocalDraft();
                router.push(`/diet-plan/confirmation`);
                return;
            }

            const loaded = await loadRazorpayScript();
            if (!loaded) {
                throw new Error("Razorpay SDK failed to load. Please check your connection.");
            }

            const createResponse = await fetch("/api/diet-plan/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: normalizedEmail,
                    questionnaire_data: questionnaireData,
                }),
            });
            const orderData = await createResponse.json() as CreateOrderResponse;

            if (!createResponse.ok) {
                throw new Error(orderData.message || "Failed to create payment order");
            }

            const Razorpay = (window as RazorpayWindow).Razorpay;
            if (!Razorpay) {
                throw new Error("Razorpay SDK unavailable after loading.");
            }

            const rzp = new Razorpay({
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "Recovery Compass",
                description: "Personalised Diet Plan PDF",
                image: "/rc-logo-primary.svg",
                order_id: orderData.orderId,
                handler: async (response: RazorpaySuccessResponse) => {
                    try {
                        const verifyResponse = await fetch("/api/diet-plan/verify-payment", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                email: normalizedEmail,
                                name: data.name,
                                questionnaire_data: questionnaireData,
                            }),
                        });
                        const verifyData = await verifyResponse.json() as VerifyPaymentResponse;

                        if (!verifyResponse.ok) {
                            throw new Error(verifyData.message || "Payment verification failed");
                        }

                        clearLocalDraft();
                        router.push(`/diet-plan/confirmation${verifyData.orderId ? `?orderId=${verifyData.orderId}` : ""}`);
                    } catch (verifyError) {
                        console.error("[DietPlan] Payment verification error:", verifyError);
                        setError(getErrorMessage(verifyError));
                        setIsProcessing(false);
                    }
                },
                prefill: {
                    name: data.name,
                    email: normalizedEmail,
                    contact: "",
                },
                theme: {
                    color: "#1a3a2a",
                },
                modal: {
                    backdropclose: false,
                    escape: false,
                    confirm_close: true,
                    ondismiss: () => setIsProcessing(false),
                },
            });

            rzp.on("payment.failed", (response: RazorpayFailureResponse) => {
                setError(`Payment failed: ${response.error.description || "Please try again."}`);
                setIsProcessing(false);
            });

            rzp.open();
        } catch (paymentError) {
            console.error("[DietPlan] Payment error:", paymentError);
            setError(getErrorMessage(paymentError));
            setIsProcessing(false);
        }
    }

    return (
        <div className="min-h-screen bg-white text-[#06290C] font-satoshi">
            {!cartCheckoutRequested && <Script src="https://checkout.razorpay.com/v1/checkout.js" />}
            <NavbarSticky simple />

            <main className="mx-auto w-full max-w-2xl px-5 py-10 md:py-20">
                <AnimatePresence mode="wait">
                    {step === 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15, height: 0, margin: 0, overflow: "hidden" }}
                            className="mb-16 text-center"
                        >
                            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-[#06290C]/50">
                                Personalised diet plan
                            </p>
                            <h1 className="font-erode text-4xl font-medium leading-[1.05] tracking-tight text-[#06290C] md:text-[3.5rem]">
                                Eat from your own kitchen.<br />Get a plan that understands it.
                            </h1>
                            <p className="mx-auto mt-6 max-w-lg text-[15px] font-medium leading-relaxed text-[#06290C]/70">
                                A 7-step intake for your health conditions, regional foods, meal timings, and family cooking setup.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="mb-12 flex flex-col justify-between border-b border-[#06290C]/10 pb-6 md:flex-row md:items-end">
                    <div>
                        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#06290C]/40">
                            Step {step + 1} of {STEPS.length}
                        </p>
                        <h2 className="font-erode text-3xl font-medium tracking-tight text-[#06290C] md:text-4xl">
                            {STEPS[step]}
                        </h2>
                    </div>
                    <div className="mt-6 flex items-center gap-1.5 md:mt-0 md:pb-2">
                        {STEPS.map((_, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "h-[3px] rounded-full transition-all duration-500",
                                    i === step ? "w-8 bg-[#06290C]" : i < step ? "w-2 bg-[#06290C]/30" : "w-2 bg-[#06290C]/10"
                                )}
                            />
                        ))}
                    </div>
                </div>

                <AnimatePresence mode="popLayout">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -16 }}
                        transition={{ duration: 0.24, ease: "easeOut" }}
                        className="w-full"
                    >
                            {step === 0 ? (
                                <div className="grid gap-5">
                                    <div className="grid gap-5 md:grid-cols-2">
                                        <TextField id="f-name" label="Name" value={data.name} onChange={(value) => updateField("name", value)} placeholder="Client name" />
                                        <TextField id="f-age" label="Age" type="number" min={10} max={100} value={data.age} onChange={(value) => updateField("age", value)} placeholder="e.g. 38" />
                                    </div>
                                    <div className="grid gap-5 md:grid-cols-2">
                                        <div>
                                            <FieldLabel>Gender</FieldLabel>
                                            <PillGroup id="pg-gender" value={data.gender} options={genderOptions} onChange={(value) => updateField("gender", value)} />
                                        </div>
                                        <TextField id="f-city" label="City / region" value={data.city} onChange={(value) => updateField("city", value)} placeholder="e.g. Kerala, Mumbai" />
                                    </div>
                                    <div className="grid gap-5 md:grid-cols-2">
                                        <div>
                                            <FieldLabel>Height</FieldLabel>
                                            <div className="flex gap-2">
                                                <div className="relative flex-1">
                                                    <Input
                                                        type="number"
                                                        placeholder="ft"
                                                        className="h-[52px] w-full rounded-2xl border-[#06290C]/12 bg-white pl-4 pr-8 text-[15px] font-medium text-[#06290C] shadow-sm shadow-[#06290C]/[0.02] transition-[border-color,box-shadow] placeholder:text-[#06290C]/35 focus-visible:border-[#06290C]/30 focus-visible:ring-4 focus-visible:ring-[#06290C]/[0.08]"
                                                        onChange={(e) => {
                                                            const ft = e.target.value;
                                                            const currIn = data.height.split("'")[1]?.replace('"', '') || "";
                                                            updateField("height", `${ft}'${currIn}"`);
                                                        }}
                                                        value={data.height.split("'")[0] || ""}
                                                    />
                                                    <span className="absolute right-3 top-[17px] text-[13px] font-bold text-[#06290C]/40">ft</span>
                                                </div>
                                                <div className="relative flex-1">
                                                    <Input
                                                        type="number"
                                                        placeholder="in"
                                                        className="h-[52px] w-full rounded-2xl border-[#06290C]/12 bg-white pl-4 pr-8 text-[15px] font-medium text-[#06290C] shadow-sm shadow-[#06290C]/[0.02] transition-[border-color,box-shadow] placeholder:text-[#06290C]/35 focus-visible:border-[#06290C]/30 focus-visible:ring-4 focus-visible:ring-[#06290C]/[0.08]"
                                                        onChange={(e) => {
                                                            const inch = e.target.value;
                                                            const currFt = data.height.split("'")[0] || "";
                                                            updateField("height", `${currFt}'${inch}"`);
                                                        }}
                                                        value={data.height.split("'")[1]?.replace('"', '') || ""}
                                                    />
                                                    <span className="absolute right-3 top-[17px] text-[13px] font-bold text-[#06290C]/40">in</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <FieldLabel>Weight</FieldLabel>
                                            <div className="relative">
                                                <Input
                                                    type="number"
                                                    placeholder="e.g. 75"
                                                    className="h-[52px] w-full rounded-2xl border-[#06290C]/12 bg-white pl-4 pr-10 text-[15px] font-medium text-[#06290C] shadow-sm shadow-[#06290C]/[0.02] transition-[border-color,box-shadow] placeholder:text-[#06290C]/35 focus-visible:border-[#06290C]/30 focus-visible:ring-4 focus-visible:ring-[#06290C]/[0.08]"
                                                    onChange={(e) => updateField("weight", e.target.value)}
                                                    value={data.weight}
                                                />
                                                <span className="absolute right-4 top-[17px] text-[13px] font-bold text-[#06290C]/40">kg</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : null}

                            {step === 1 ? (
                                <div className="grid gap-5">
                                    <div>
                                        <FieldLabel>Tick everything that applies</FieldLabel>
                                        <CheckGroup id="cg-conditions" value={data.conditions} options={conditionOptions} noneValue="None" onChange={(value) => updateField("conditions", value)} />
                                    </div>
                                    <TextField id="f-meds" label="Any medications that affect diet?" value={data.medications} onChange={(value) => updateField("medications", value)} placeholder="e.g. Metformin, thyroid medication, blood thinners - or leave blank" />
                                    <TextField id="f-allergies" label="Any food allergies or intolerances?" value={data.allergies} onChange={(value) => updateField("allergies", value)} placeholder="e.g. dairy, gluten, nuts, shellfish - or leave blank" />
                                </div>
                            ) : null}

                            {step === 2 ? (
                                <div className="grid gap-6">
                                    <div>
                                        <FieldLabel>Diet type</FieldLabel>
                                        <PillGroup id="pg-diet" value={data.diet} options={dietOptions} onChange={(value) => updateField("diet", value)} />
                                    </div>
                                    <div>
                                        <FieldLabel>State / regional cuisine</FieldLabel>
                                        <PillGroup id="pg-region" value={data.region} options={regionOptions} onChange={updateRegion} />
                                        {data.region === "Other" ? (
                                            <div className="mt-4">
                                                <TextField
                                                    id="f-region-other"
                                                    label="Which regional cuisine?"
                                                    value={data.regionOther}
                                                    onChange={(value) => updateField("regionOther", value)}
                                                    placeholder="e.g. Sindhi, Kashmiri, Goan, Marwari, Indori home food"
                                                />
                                            </div>
                                        ) : null}
                                    </div>
                                    <div>
                                        <FieldLabel>Staple grain eaten daily</FieldLabel>
                                        <PillGroup id="pg-grain" value={data.grain} options={grainOptions} onChange={(value) => updateField("grain", value)} />
                                    </div>
                                    <div>
                                        <FieldLabel>Cooking oil used at home</FieldLabel>
                                        <PillGroup id="pg-oil" value={data.oil} options={oilOptions} onChange={(value) => updateField("oil", value)} />
                                    </div>
                                    <TextField id="f-fasting" label="Any fasting days or religious food rules?" value={data.fasting} onChange={(value) => updateField("fasting", value)} placeholder="e.g. Monday fast, no onion-garlic, Navratri - or leave blank" />
                                </div>
                            ) : null}

                            {step === 3 ? (
                                <div className="grid gap-6">
                                    <div className="grid gap-5 md:grid-cols-3">
                                        <TextField id="f-btime" label="Breakfast time" type="time" value={data.btime} onChange={(value) => updateField("btime", value)} />
                                        <TextField id="f-ltime" label="Lunch time" type="time" value={data.ltime} onChange={(value) => updateField("ltime", value)} />
                                        <TextField id="f-dtime" label="Dinner time" type="time" value={data.dtime} onChange={(value) => updateField("dtime", value)} />
                                    </div>
                                    <div>
                                        <FieldLabel>Typical portion size</FieldLabel>
                                        <PillGroup id="pg-portion" value={data.portion} options={portionOptions} onChange={(value) => updateField("portion", value)} />
                                    </div>
                                    <div>
                                        <FieldLabel>Do they eat after 9 PM?</FieldLabel>
                                        <PillGroup id="pg-lateeat" value={data.lateeat} options={lateEatOptions} onChange={(value) => updateField("lateeat", value)} />
                                    </div>
                                    <div>
                                        <FieldLabel>Who cooks at home?</FieldLabel>
                                        <PillGroup id="pg-cooks" value={data.cooks} options={cooksOptions} onChange={(value) => updateField("cooks", value)} />
                                    </div>
                                    <div>
                                        <FieldLabel>Separate cooking for the client?</FieldLabel>
                                        <PillGroup id="pg-sepcook" value={data.sepcook} options={separateCookingOptions} onChange={(value) => updateField("sepcook", value)} />
                                        <Hint>This determines whether the plan modifies the family meal or builds a custom one</Hint>
                                    </div>
                                </div>
                            ) : null}

                            {step === 4 ? (
                                <div className="grid gap-6">
                                    <div>
                                        <FieldLabel>Activity level</FieldLabel>
                                        <PillGroup id="pg-activity" value={data.activity} options={activityOptions} onChange={(value) => updateField("activity", value)} />
                                    </div>
                                    <div>
                                        <FieldLabel>Recovery Compass programs active</FieldLabel>
                                        <CheckGroup id="cg-programs" value={data.programs} options={programOptions} noneValue="None yet" onChange={(value) => updateField("programs", value)} />
                                    </div>
                                    <div>
                                        <FieldLabel>Primary goal from the diet</FieldLabel>
                                        <PillGroup id="pg-goal" value={data.goal} options={goalOptions} onChange={(value) => updateField("goal", value)} />
                                    </div>
                                    <div>
                                        <FieldLabel>Dining out — how often?</FieldLabel>
                                        <PillGroup id="pg-dineout" value={data.dineout} options={dineOutOptions} onChange={(value) => updateField("dineout", value)} />
                                    </div>
                                </div>
                            ) : null}

                            {step === 5 ? (
                                <div className="grid gap-6">
                                    <TextAreaField id="f-loves" label="5 foods they love" value={data.loves} onChange={(value) => updateField("loves", value)} placeholder="e.g. fish curry, dal, curd rice, eggs, chapati with sabzi..." hint="This is the most important field - a plan that ignores what someone enjoys gets abandoned in a week" />
                                    <TextAreaField id="f-hates" label="Foods they dislike or avoid" value={data.hates} onChange={(value) => updateField("hates", value)} placeholder="e.g. bitter gourd, oats, mushrooms..." />
                                    <div>
                                        <FieldLabel>Spice preference</FieldLabel>
                                        <PillGroup id="pg-spice" value={data.spice} options={spiceOptions} onChange={(value) => updateField("spice", value)} />
                                    </div>
                                    <div className="h-px bg-[oklch(0.2475_0.0661_146.79)]/8" />
                                    <TextField id="f-tea" label="Tea / coffee habit" value={data.tea} onChange={(value) => updateField("tea", value)} placeholder="e.g. 3 cups chai with sugar, 1 black coffee - or none" />
                                    <div>
                                        <FieldLabel>Alcohol</FieldLabel>
                                        <PillGroup id="pg-alcohol" value={data.alcohol} options={alcoholOptions} onChange={(value) => updateField("alcohol", value)} />
                                    </div>
                                    <div>
                                        <FieldLabel>Soft drinks or juices?</FieldLabel>
                                        <PillGroup id="pg-softdrink" value={data.softdrink} options={softDrinkOptions} onChange={(value) => updateField("softdrink", value)} />
                                    </div>
                                </div>
                            ) : null}

                            {step === 6 ? (
                                <div className="grid gap-6">
                                    <TextAreaField id="f-other" label="Any other health info, preferences, or context?" value={data.other} onChange={(value) => updateField("other", value)} placeholder="Anything that would help make this plan more accurate - e.g. works night shifts, recovering from surgery, has a very picky family..." />
                                    <div>
                                        <FieldLabel>Email for PDF delivery</FieldLabel>
                                        <Input
                                            id="f-email"
                                            type="email"
                                            value={email}
                                            onChange={(event) => setEmail(event.target.value)}
                                            placeholder="client@example.com"
                                            className="h-[52px] rounded-2xl border-[oklch(0.2475_0.0661_146.79)]/12 bg-white px-4 text-[15px] font-medium text-[oklch(0.2475_0.0661_146.79)] shadow-sm shadow-[oklch(0.2475_0.0661_146.79)]/[0.02] transition-[border-color,box-shadow] placeholder:text-[oklch(0.2475_0.0661_146.79)]/35 focus-visible:border-[oklch(0.2475_0.0661_146.79)]/30 focus-visible:ring-4 focus-visible:ring-[oklch(0.2475_0.0661_146.79)]/[0.08]"
                                        />
                                        <Hint>This is where the generated PDF will be sent.</Hint>
                                    </div>

                                    <div className="mt-12">
                                        <p className="mb-6 text-[11px] font-bold uppercase tracking-[0.2em] text-[#06290C]/50">
                                            Summary
                                        </p>
                                        <div className="grid gap-1 border-t border-[#06290C]/5 pt-2">
                                            {summaryRows.map(([label, value]) => (
                                                <SummaryRow key={label} label={label} value={value} />
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-10 grid gap-4 md:grid-cols-2">
                                        <div className="flex items-center justify-between rounded-3xl bg-[#F5F5F7] px-6 py-5">
                                            <span className="text-[15px] font-semibold text-[#06290C]/80">
                                                {cartCheckoutRequested ? "Payment" : "Total Price"}
                                            </span>
                                            <span className="font-erode text-[32px] font-medium text-[#06290C]">
                                                {cartCheckoutRequested ? "Paid" : "₹599"}
                                            </span>
                                        </div>
                                        <div className="flex gap-4 rounded-3xl bg-[#F5F5F7] px-6 py-5">
                                            <ShieldCheck className="mt-0.5 size-[22px] shrink-0 text-[#06290C]/70" />
                                            <p className="text-[14px] font-medium leading-relaxed text-[#06290C]/70">
                                                {cartCheckoutRequested
                                                    ? "This profile will be attached to your paid checkout add-on."
                                                    : "Payment is handled securely through Razorpay."}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : null}
                        </motion.div>
                    </AnimatePresence>

                    {error ? (
                        <div className="mt-8 rounded-2xl bg-[#FFF5F5] px-4 py-3 text-sm font-bold text-[#C82A2A]">
                            {error}
                        </div>
                    ) : null}

                    <div className="mt-12 flex items-center justify-between gap-4 border-t border-[#06290C]/10 pt-8">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={previousStep}
                            disabled={step === 0 || isProcessing}
                            className="h-[52px] rounded-full border-[#06290C]/15 px-7 text-[15px] font-semibold text-[#06290C] transition-all hover:bg-[#F5F5F7] hover:border-[#06290C]/30 active:scale-[0.98]"
                        >
                            <ArrowLeft className="mr-2 size-[18px]" />
                            Back
                        </Button>

                        {step < STEPS.length - 1 ? (
                            <Button
                                type="button"
                                onClick={nextStep}
                                className="h-[52px] rounded-full bg-[#06290C] px-8 text-[15px] font-semibold text-white shadow-md shadow-[#06290C]/20 transition-all hover:bg-[#06290C]/90 active:scale-[0.98]"
                            >
                                Continue
                                <ArrowRight className="ml-2 size-[18px]" />
                            </Button>
                        ) : (
                            <div className="flex-1 max-w-sm">
                                {cartCheckoutRequested ? (
                                    <p className="mb-8 text-[15px] font-medium leading-relaxed text-[#06290C]/60 text-center">
                                        {hasCartCheckoutClaim
                                            ? "You have already paid for the diet plan in your program cart."
                                            : "This paid checkout link is incomplete. Please return to the checkout success page and open the diet profile button again."}
                                    </p>
                                ) : (
                                    <div className="mb-8 rounded-2xl border border-[#06290C]/10 bg-white p-5 shadow-sm">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-[13px] font-bold uppercase tracking-wider text-[#06290C]/40">Total</p>
                                                <p className="mt-1 font-erode text-2xl font-semibold">₹599</p>
                                            </div>
                                            <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[12px] font-bold text-emerald-600">
                                                <ShieldCheck className="size-4" /> Secured
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <Button
                                    onClick={handlePayment}
                                    disabled={!canPay || isProcessing || (cartCheckoutRequested && !hasCartCheckoutClaim)}
                                    className="h-14 w-full rounded-2xl bg-[#06290C] text-[15px] font-bold text-white shadow-xl shadow-[#06290C]/10 transition-all hover:bg-[#06290C]/90 hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0"
                                >
                                    {isProcessing ? (
                                        <span className="flex items-center gap-2"><Loader2 className="size-5 animate-spin" /> {cartCheckoutRequested ? "Submitting..." : "Processing..."}</span>
                                    ) : (
                                        <span className="flex items-center gap-2">{cartCheckoutRequested ? "Submit Profile" : "Pay ₹599 & Generate Plan"} <ArrowRight className="size-5" /></span>
                                    )}
                                </Button>
                            </div>
                        )}
                    </div>
            </main>

            <FooterVariantTwo />
        </div>
    );
}

export function DietPlanClient() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white" />}>
            <DietPlanClientContent />
        </Suspense>
    );
}
