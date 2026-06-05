"use client";

import { useState } from "react";
import { ArrowRight, Check, Leaf, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const FOCUS_AREAS = [
    "Better Sleep",
    "More Energy",
    "Gut Health",
    "Quit Smoking / Alcohol",
    "Stress Relief",
    "General Wellness",
];

const DEFERRED_QUESTIONS = [
    {
        id: "tried_detox",
        question: "Have you ever tried a detox program before?",
        type: "radio",
        options: ["Yes, and it worked well", "Yes, but didn't see results", "No, this is my first time"],
    },
    {
        id: "dietary_preference",
        question: "Do you have any dietary preferences or restrictions?",
        type: "checkbox",
        options: ["Vegetarian", "Vegan", "Lactose Intolerant", "Gluten Free", "None"],
    },
] as const;

type DetoxLeadFlowProps = {
    source: "homepage_modal" | "landing_page";
    onClaimed?: () => void;
    onClose?: () => void;
};

export function DetoxLeadFlow({ source, onClaimed, onClose }: DetoxLeadFlowProps) {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const [leadId, setLeadId] = useState<string | null>(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [primaryFocus, setPrimaryFocus] = useState("");
    const [answers, setAnswers] = useState<Record<string, string | string[]>>({});

    const isContactValid =
        name.trim().length > 0 &&
        phone.trim().length > 0 &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

    const isQuestionnaireValid =
        primaryFocus.length > 0 &&
        DEFERRED_QUESTIONS.every((question) => {
            const answer = answers[question.id];
            return question.type === "radio"
                ? typeof answer === "string" && answer.length > 0
                : Array.isArray(answer) && answer.length > 0;
        });

    const handleRadioAnswer = (questionId: string, option: string) => {
        setAnswers((current) => ({ ...current, [questionId]: option }));
    };

    const handleCheckboxAnswer = (questionId: string, option: string) => {
        setAnswers((current) => {
            const existing = Array.isArray(current[questionId]) ? current[questionId] as string[] : [];
            return {
                ...current,
                [questionId]: existing.includes(option)
                    ? existing.filter((item) => item !== option)
                    : [...existing, option],
            };
        });
    };

    const handleCreateLead = async () => {
        setIsSubmitting(true);
        setApiError(null);

        try {
            const response = await fetch("/api/detox/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "create_lead",
                    name,
                    email,
                    phone,
                    source,
                    emailConsent: true,
                    whatsappConsent: true,
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Could not save your details. Please try again.");
            }

            setLeadId(data.leadId);
            setStep(2);
        } catch (error) {
            setApiError(error instanceof Error ? error.message : "An unexpected error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleComplete = async () => {
        if (!leadId) {
            setApiError("Please complete your contact details first.");
            setStep(1);
            return;
        }

        setIsSubmitting(true);
        setApiError(null);

        try {
            const response = await fetch("/api/detox/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "complete_questionnaire",
                    leadId,
                    primaryFocus,
                    questionnaireData: answers,
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Could not send your detox program. Please try again.");
            }

            localStorage.setItem("rc:detox-opt-in", "claimed");
            window.dispatchEvent(new CustomEvent("rc-nudge-active"));
            window.dispatchEvent(new CustomEvent("rc-detox-claimed"));

            setStep(3);
            onClaimed?.();
        } catch (error) {
            setApiError(error instanceof Error ? error.message : "An unexpected error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-8 md:p-10 pt-12">
            {step < 3 ? (
                <div className="flex gap-2 mb-6">
                    {[1, 2].map((indicator) => (
                        <div
                            key={indicator}
                            className={cn(
                                "h-1 flex-1 rounded-full transition-all duration-300",
                                indicator <= step ? "bg-[oklch(0.2475_0.0661_146.79)]" : "bg-[oklch(0.2475_0.0661_146.79)]/10"
                            )}
                        />
                    ))}
                </div>
            ) : null}

            {step === 1 ? (
                <div>
                    <div className="flex items-center gap-2 text-[oklch(0.2475_0.0661_146.79)]/40 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
                        <Leaf className="size-3 text-[oklch(0.37_0.076_145)]" />
                        Free 6-Day Program
                    </div>
                    <h2 className="font-erode text-2xl md:text-3xl font-bold leading-tight mb-4">
                        Get your free detox PDF
                    </h2>
                    <p className="text-[13.5px] leading-relaxed text-[oklch(0.2475_0.0661_146.79)]/55 mb-6">
                        A simple 10-15 minute daily reset for hydration, gut health, movement, sleep, and stress support.
                    </p>

                    <div className="space-y-4">
                        <div>
                            <label htmlFor={`${source}-detox-name`} className="block text-[11px] font-bold uppercase tracking-wider text-[oklch(0.2475_0.0661_146.79)]/40 mb-2">
                                Name
                            </label>
                            <input
                                id={`${source}-detox-name`}
                                type="text"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                placeholder="Enter your name"
                                className="w-full h-12 rounded-2xl border border-[oklch(0.2475_0.0661_146.79)]/15 px-4 font-medium text-[oklch(0.2475_0.0661_146.79)] placeholder:text-[oklch(0.2475_0.0661_146.79)]/30 focus:outline-none focus:border-[oklch(0.2475_0.0661_146.79)] focus:ring-1 focus:ring-[oklch(0.2475_0.0661_146.79)] transition-all"
                            />
                        </div>
                        <div>
                            <label htmlFor={`${source}-detox-email`} className="block text-[11px] font-bold uppercase tracking-wider text-[oklch(0.2475_0.0661_146.79)]/40 mb-2">
                                Email Address
                            </label>
                            <input
                                id={`${source}-detox-email`}
                                type="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                placeholder="name@example.com"
                                className="w-full h-12 rounded-2xl border border-[oklch(0.2475_0.0661_146.79)]/15 px-4 font-medium text-[oklch(0.2475_0.0661_146.79)] placeholder:text-[oklch(0.2475_0.0661_146.79)]/30 focus:outline-none focus:border-[oklch(0.2475_0.0661_146.79)] focus:ring-1 focus:ring-[oklch(0.2475_0.0661_146.79)] transition-all"
                            />
                        </div>
                        <div>
                            <label htmlFor={`${source}-detox-phone`} className="block text-[11px] font-bold uppercase tracking-wider text-[oklch(0.2475_0.0661_146.79)]/40 mb-2">
                                WhatsApp Number
                            </label>
                            <input
                                id={`${source}-detox-phone`}
                                type="tel"
                                value={phone}
                                onChange={(event) => setPhone(event.target.value)}
                                placeholder="e.g. +91 99999 99999"
                                className="w-full h-12 rounded-2xl border border-[oklch(0.2475_0.0661_146.79)]/15 px-4 font-medium text-[oklch(0.2475_0.0661_146.79)] placeholder:text-[oklch(0.2475_0.0661_146.79)]/30 focus:outline-none focus:border-[oklch(0.2475_0.0661_146.79)] focus:ring-1 focus:ring-[oklch(0.2475_0.0661_146.79)] transition-all"
                            />
                        </div>
                    </div>

                    <p className="mt-4 text-[11.5px] leading-relaxed text-[oklch(0.2475_0.0661_146.79)]/45">
                        We will send the PDF by email and WhatsApp. You can reply on WhatsApp if you want help choosing a Recovery Compass program.
                    </p>

                    {apiError ? (
                        <div className="mt-4 text-[12px] font-semibold text-red-600 bg-red-50 border border-red-100 rounded-xl p-3.5">
                            {apiError}
                        </div>
                    ) : null}

                    <Button
                        type="button"
                        disabled={!isContactValid || isSubmitting}
                        onClick={handleCreateLead}
                        className="w-full h-12 rounded-[16px] font-bold text-[14px] mt-6 bg-[oklch(0.2475_0.0661_146.79)] text-white hover:bg-[oklch(0.2475_0.0661_146.79)]/90 shadow-lg shadow-[oklch(0.2475_0.0661_146.79)]/15"
                    >
                        {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <>Next: Customize My Routine <ArrowRight className="size-4 ml-1" /></>}
                    </Button>
                </div>
            ) : null}

            {step === 2 ? (
                <div>
                    <div className="text-[oklch(0.2475_0.0661_146.79)]/40 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
                        Personalization
                    </div>
                    <h2 className="font-erode text-2xl md:text-3xl font-bold leading-tight mb-6">
                        Help us customize your routine
                    </h2>

                    <div className="space-y-6">
                        <div>
                            <span className="block text-[13px] font-bold text-[oklch(0.2475_0.0661_146.79)] mb-3">
                                Choose your primary wellness focus
                            </span>
                            <div className="grid grid-cols-2 gap-2">
                                {FOCUS_AREAS.map((focus) => (
                                    <button
                                        key={focus}
                                        type="button"
                                        onClick={() => setPrimaryFocus(focus)}
                                        className={cn(
                                            "min-h-11 rounded-xl text-[12px] font-semibold border text-left px-3.5 py-2 transition-all flex items-center justify-between gap-2",
                                            primaryFocus === focus
                                                ? "bg-[oklch(0.2475_0.0661_146.79)] text-white border-[oklch(0.2475_0.0661_146.79)] shadow-md shadow-[oklch(0.2475_0.0661_146.79)]/15"
                                                : "border-[oklch(0.2475_0.0661_146.79)]/10 text-[oklch(0.2475_0.0661_146.79)]/80 hover:bg-[oklch(0.2475_0.0661_146.79)]/5"
                                        )}
                                    >
                                        {focus}
                                        {primaryFocus === focus ? <Check className="size-3.5" /> : null}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {DEFERRED_QUESTIONS.map((question) => (
                            <div key={question.id}>
                                <span className="block text-[13px] font-bold text-[oklch(0.2475_0.0661_146.79)] mb-3">
                                    {question.question}
                                </span>
                                {question.type === "radio" ? (
                                    <div className="space-y-2">
                                        {question.options.map((option) => {
                                            const isSelected = answers[question.id] === option;
                                            return (
                                                <button
                                                    key={option}
                                                    type="button"
                                                    onClick={() => handleRadioAnswer(question.id, option)}
                                                    className={cn(
                                                        "w-full min-h-11 rounded-xl text-[12.5px] font-medium border text-left px-4 py-2 transition-all flex items-center justify-between gap-3",
                                                        isSelected
                                                            ? "bg-[oklch(0.2475_0.0661_146.79)]/8 border-[oklch(0.2475_0.0661_146.79)] text-[oklch(0.2475_0.0661_146.79)] font-bold"
                                                            : "border-[oklch(0.2475_0.0661_146.79)]/10 text-[oklch(0.2475_0.0661_146.79)]/80 hover:bg-[oklch(0.2475_0.0661_146.79)]/5"
                                                    )}
                                                >
                                                    {option}
                                                    <span className={cn("size-4 rounded-full border flex items-center justify-center shrink-0", isSelected ? "border-[oklch(0.2475_0.0661_146.79)]" : "border-[oklch(0.2475_0.0661_146.79)]/20")}>
                                                        {isSelected ? <span className="size-2 rounded-full bg-[oklch(0.2475_0.0661_146.79)]" /> : null}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-2">
                                        {question.options.map((option) => {
                                            const selectedValues = Array.isArray(answers[question.id]) ? answers[question.id] as string[] : [];
                                            const isSelected = selectedValues.includes(option);
                                            return (
                                                <button
                                                    key={option}
                                                    type="button"
                                                    onClick={() => handleCheckboxAnswer(question.id, option)}
                                                    className={cn(
                                                        "min-h-11 rounded-xl text-[12.5px] font-medium border text-left px-3.5 py-2 transition-all flex items-center justify-between gap-2",
                                                        isSelected
                                                            ? "bg-[oklch(0.2475_0.0661_146.79)]/8 border-[oklch(0.2475_0.0661_146.79)] text-[oklch(0.2475_0.0661_146.79)] font-bold"
                                                            : "border-[oklch(0.2475_0.0661_146.79)]/10 text-[oklch(0.2475_0.0661_146.79)]/80 hover:bg-[oklch(0.2475_0.0661_146.79)]/5"
                                                    )}
                                                >
                                                    {option}
                                                    <span className={cn("size-4 rounded border flex items-center justify-center shrink-0", isSelected ? "bg-[oklch(0.2475_0.0661_146.79)] border-[oklch(0.2475_0.0661_146.79)]" : "border-[oklch(0.2475_0.0661_146.79)]/20")}>
                                                        {isSelected ? <Check className="size-3 text-white" /> : null}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {apiError ? (
                        <div className="mt-4 text-[12px] font-semibold text-red-600 bg-red-50 border border-red-100 rounded-xl p-3.5">
                            {apiError}
                        </div>
                    ) : null}

                    <div className="flex gap-3 mt-8">
                        <Button
                            type="button"
                            disabled={isSubmitting}
                            onClick={() => setStep(1)}
                            className="flex-1 h-12 rounded-[16px] font-bold text-[14px] border border-[oklch(0.2475_0.0661_146.79)]/15 text-[oklch(0.2475_0.0661_146.79)] bg-transparent hover:bg-[oklch(0.2475_0.0661_146.79)]/5 shadow-none"
                        >
                            Back
                        </Button>
                        <Button
                            type="button"
                            disabled={!isQuestionnaireValid || isSubmitting}
                            onClick={handleComplete}
                            className="flex-[2] h-12 rounded-[16px] font-bold text-[14px] bg-[oklch(0.2475_0.0661_146.79)] text-white hover:bg-[oklch(0.2475_0.0661_146.79)]/90 shadow-lg shadow-[oklch(0.2475_0.0661_146.79)]/15 flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? <><Loader2 className="size-4 animate-spin" /> Sending...</> : <>Get Free Detox <ArrowRight className="size-4" /></>}
                        </Button>
                    </div>
                </div>
            ) : null}

            {step === 3 ? (
                <div className="text-center py-4">
                    <div className="relative mb-6 inline-block">
                        <div className="absolute inset-0 rounded-full border-2 border-green-500/20 animate-ping" />
                        <div className="size-16 rounded-full bg-green-50 border border-green-100 flex items-center justify-center">
                            <Check className="size-8 text-green-600" />
                        </div>
                    </div>

                    <h2 className="font-erode text-2xl md:text-3xl font-bold leading-tight mb-3">
                        You are all set, {name}!
                    </h2>
                    <p className="text-[14.5px] text-[oklch(0.2475_0.0661_146.79)]/60 font-medium leading-relaxed max-w-sm mx-auto mb-8">
                        Your free 6-Day Detox Program has been sent. Please check your email or WhatsApp.
                    </p>

                    <div className="flex flex-col gap-3">
                        {onClose ? (
                            <Button
                                type="button"
                                onClick={onClose}
                                className="w-full h-12 rounded-[16px] font-bold text-[14px] border border-[oklch(0.2475_0.0661_146.79)]/15 text-[oklch(0.2475_0.0661_146.79)] bg-transparent hover:bg-[oklch(0.2475_0.0661_146.79)]/5 shadow-none"
                            >
                                Return to Website
                            </Button>
                        ) : null}
                    </div>
                </div>
            ) : null}
        </div>
    );
}
