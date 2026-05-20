"use client";

import { Suspense, useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FooterVariantTwo } from "@/components/sections";
import { NavbarSticky } from "@/components/navbar-sticky";
import { useCart } from "@/lib/context/cart-context";
import { useUser } from "@/lib/context/user-context";
import { isProgramFinderEnabled } from "@/lib/features";
import { cn } from "@/lib/utils";
import {
  buildOnboardingSteps,
  createInitialOnboardingAnswers,
  getOnboardingResolution,
  type OnboardingAnswers,
  type OnboardingStep,
  type QuestionDefinition,
  type SelectionOption,
} from "@/lib/recovery-profile";
import { publicPrograms, toCartItem } from "@/lib/public-programs";

const DRAFT_KEY = "rc_program_finder_draft_v1";

type ProgramFinderResponse = {
  message?: string;
  journey?: string | null;
  recommendedProgram?: string | null;
  primaryConcernLabel?: string | null;
};

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function restoreDraft(): OnboardingAnswers {
  if (typeof window === "undefined") {
    return createInitialOnboardingAnswers();
  }

  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) return createInitialOnboardingAnswers();
    const parsed = JSON.parse(raw) as Partial<OnboardingAnswers>;
    return {
      ...createInitialOnboardingAnswers(),
      ...parsed,
      questionValues:
        parsed.questionValues && typeof parsed.questionValues === "object"
          ? parsed.questionValues
          : {},
    };
  } catch {
    return createInitialOnboardingAnswers();
  }
}

function optionIsSelected(current: string | string[] | undefined, optionId: string) {
  return Array.isArray(current) ? current.includes(optionId) : current === optionId;
}

function stepIsComplete(step: OnboardingStep, answers: OnboardingAnswers) {
  switch (step.type) {
    case "quick_profile":
      return Boolean(answers.name.trim() && answers.age.trim() && answers.gender);
    case "path_choice":
      return Boolean(answers.path);
    case "program_choice":
      return Boolean(answers.selfSelectJourney);
    case "guided_issue":
      return Boolean(answers.guidedMainIssue);
    case "recommendation":
      return true;
    case "question": {
      const question = step.question;
      const value = answers.questionValues[question.id];
      if (!question.required || question.allowEmpty) {
        return true;
      }

      if (question.type === "multi_select") {
        return isStringArray(value) && value.length > 0;
      }

      if (question.type === "compound_number_input") {
        return Boolean(
          question.inputs?.every((input) => {
            const inputValue = answers.questionValues[input.id];
            return typeof inputValue === "string" && inputValue.trim();
          })
        );
      }

      return typeof value === "string" && value.trim().length > 0;
    }
  }
}

function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <label className="mb-2.5 block text-sm font-bold text-[#06290C]/70">
      {children}
    </label>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="h-[52px] w-full rounded-2xl border border-[#06290C]/12 bg-white px-4 text-[15px] font-medium text-[#06290C] shadow-sm shadow-[#06290C]/[0.02] outline-none transition-[border-color,box-shadow] placeholder:text-[#06290C]/35 focus:border-[#06290C]/30 focus:ring-4 focus:ring-[#06290C]/[0.08]"
    />
  );
}

function OptionButton({
  option,
  selected,
  onClick,
}: {
  option: SelectionOption;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", bounce: 0, duration: 0.3 }}
      className={cn(
        "group flex w-full items-start gap-3.5 rounded-2xl border p-4 text-left transition-colors",
        selected
          ? "border-[#06290C]/30 bg-[#F4F7F5] text-[#06290C] shadow-sm shadow-[#06290C]/5"
          : "border-[#06290C]/10 bg-white text-[#06290C]/70 shadow-sm shadow-[#06290C]/[0.02] hover:border-[#06290C]/20"
      )}
    >
      <span
        className={cn(
          "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border text-white transition-colors",
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
      <span className="min-w-0">
        <span className="block text-[15px] font-medium leading-5">{option.label}</span>
        {option.description && (
          <span className="mt-1.5 block text-[13px] font-medium leading-relaxed text-[#06290C]/45">
            {option.description}
          </span>
        )}
      </span>
    </motion.button>
  );
}

export default function ProgramFinderPage() {
  return (
    <Suspense fallback={null}>
      <ProgramFinderContent />
    </Suspense>
  );
}

function ProgramFinderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") || "/checkout";
  const { addItem } = useCart();
  const { user, openAuthModal, refreshAccountData } = useUser();
  const programFinderEnabled = isProgramFinderEnabled();
  const [answers, setAnswers] = useState<OnboardingAnswers>(() => restoreDraft());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingAuthSubmit, setPendingAuthSubmit] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const steps = useMemo(() => buildOnboardingSteps(answers), [answers]);
  const currentStep = steps[Math.min(currentIndex, steps.length - 1)];
  const isLastStep = currentIndex >= steps.length - 1;
  const canContinue = currentStep ? stepIsComplete(currentStep, answers) : false;
  const resolution = getOnboardingResolution(answers);
  const recommendedProgram = publicPrograms.find(
    (program) => program.dbSlug === resolution.recommendedProgram
  );

  useEffect(() => {
    if (!programFinderEnabled) {
      router.replace("/");
    }
  }, [programFinderEnabled, router]);

  useEffect(() => {
    if (!programFinderEnabled) {
      return;
    }

    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(answers));
  }, [answers, programFinderEnabled]);

  useEffect(() => {
    if (currentIndex > steps.length - 1) {
      setCurrentIndex(Math.max(steps.length - 1, 0));
    }
  }, [currentIndex, steps.length]);

  useEffect(() => {
    if (user && pendingAuthSubmit) {
      setPendingAuthSubmit(false);
      void submitAnswers();
    }
    // submitAnswers intentionally reads the latest answers from state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingAuthSubmit, user]);

  if (!programFinderEnabled) {
    return null;
  }

  function updateQuestionValue(questionId: string, value: string | string[]) {
    setAnswers((current) => ({
      ...current,
      questionValues: {
        ...current.questionValues,
        [questionId]: value,
      },
    }));
  }

  function toggleMultiValue(questionId: string, optionId: string) {
    setAnswers((current) => {
      const existing = current.questionValues[questionId];
      const selected = isStringArray(existing) ? existing : [];
      const next = selected.includes(optionId)
        ? selected.filter((id) => id !== optionId)
        : [...selected, optionId];

      return {
        ...current,
        questionValues: {
          ...current.questionValues,
          [questionId]: next,
        },
      };
    });
  }

  async function submitAnswers() {
    if (!user) {
      setPendingAuthSubmit(true);
      openAuthModal("signin");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/program-finder/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      const body = (await response.json()) as ProgramFinderResponse;

      if (!response.ok) {
        throw new Error(body.message || "Could not save your recommendation.");
      }

      const program = publicPrograms.find((item) => item.dbSlug === body.recommendedProgram);
      if (program) {
        addItem(toCartItem(program), { openCart: false });
      }

      window.localStorage.removeItem(DRAFT_KEY);
      await refreshAccountData();
      router.push(returnTo);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Could not save your recommendation.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleNext() {
    if (!canContinue || !currentStep) {
      return;
    }

    if (isLastStep) {
      void submitAnswers();
      return;
    }

    setCurrentIndex((index) => Math.min(index + 1, steps.length - 1));
  }

  function renderQuestion(question: QuestionDefinition) {
    if (question.type === "compound_number_input") {
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          {question.inputs?.map((input) => {
            const value = answers.questionValues[input.id];
            return (
              <div key={input.id} className="space-y-2">
                <FieldLabel>{input.label}</FieldLabel>
                <TextInput
                  type="number"
                  value={typeof value === "string" ? value : ""}
                  placeholder={input.placeholder}
                  onChange={(nextValue) => updateQuestionValue(input.id, nextValue)}
                />
              </div>
            );
          })}
        </div>
      );
    }

    if (question.type === "number_input") {
      const value = answers.questionValues[question.id];
      return (
        <TextInput
          type="number"
          value={typeof value === "string" ? value : ""}
          placeholder={question.placeholder}
          onChange={(nextValue) => updateQuestionValue(question.id, nextValue)}
        />
      );
    }

    const currentValue = answers.questionValues[question.id];

    return (
      <div className="space-y-3">
        {question.options?.map((option) => (
          <OptionButton
            key={option.id}
            option={option}
            selected={optionIsSelected(currentValue, option.id)}
            onClick={() => {
              if (question.type === "multi_select") {
                toggleMultiValue(question.id, option.id);
              } else {
                updateQuestionValue(question.id, option.id);
              }
            }}
          />
        ))}
        {question.customOptionId && currentValue === question.customOptionId && question.customInputId && (
          <div className="space-y-2 pt-1">
            <FieldLabel>{question.customInputLabel ?? "Your answer"}</FieldLabel>
            <TextInput
              value={
                typeof answers.questionValues[question.customInputId] === "string"
                  ? (answers.questionValues[question.customInputId] as string)
                  : ""
              }
              placeholder={question.customInputPlaceholder}
              onChange={(nextValue) => updateQuestionValue(question.customInputId!, nextValue)}
            />
          </div>
        )}
      </div>
    );
  }

  function renderStep(step: OnboardingStep) {
    switch (step.type) {
      case "quick_profile":
        return (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <FieldLabel>Name</FieldLabel>
              <TextInput
                value={answers.name}
                placeholder="Your name"
                onChange={(name) => setAnswers((current) => ({ ...current, name }))}
              />
            </div>
            <div className="space-y-2">
              <FieldLabel>Age</FieldLabel>
              <TextInput
                type="number"
                value={answers.age}
                placeholder="Age"
                onChange={(age) => setAnswers((current) => ({ ...current, age }))}
              />
            </div>
            <div className="space-y-2">
              <FieldLabel>Phone (optional)</FieldLabel>
              <TextInput
                value={answers.phoneNumber}
                placeholder="+91..."
                onChange={(phoneNumber) => setAnswers((current) => ({ ...current, phoneNumber }))}
              />
            </div>
            <div className="space-y-3 sm:col-span-2">
              <FieldLabel>Gender</FieldLabel>
              <div className="grid gap-3 sm:grid-cols-3">
                {(["Male", "Female", "Prefer not to say"] as const).map((gender) => (
                  <OptionButton
                    key={gender}
                    option={{ id: gender, label: gender }}
                    selected={answers.gender === gender}
                    onClick={() => setAnswers((current) => ({ ...current, gender }))}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      case "path_choice":
        return (
          <div className="space-y-3">
            {step.options.map((option) => (
              <OptionButton
                key={option.id}
                option={option}
                selected={answers.path === option.id}
                onClick={() => {
                  setAnswers((current) => ({
                    ...current,
                    path: option.id,
                    selfSelectJourney: null,
                    guidedMainIssue: null,
                    questionValues: {},
                  }));
                }}
              />
            ))}
          </div>
        );
      case "program_choice":
        return (
          <div className="space-y-3">
            {step.options.map((option) => (
              <OptionButton
                key={option.id}
                option={option}
                selected={answers.selfSelectJourney === option.id}
                onClick={() => {
                  setAnswers((current) => ({
                    ...current,
                    selfSelectJourney: option.id,
                    questionValues: {},
                  }));
                }}
              />
            ))}
          </div>
        );
      case "guided_issue":
        return (
          <div className="space-y-3">
            {step.options.map((option) => (
              <OptionButton
                key={option.id}
                option={option}
                selected={answers.guidedMainIssue === option.id}
                onClick={() => {
                  setAnswers((current) => ({
                    ...current,
                    guidedMainIssue: option.id,
                    questionValues: {},
                  }));
                }}
              />
            ))}
          </div>
        );
      case "question":
        return renderQuestion(step.question);
      case "recommendation":
        return (
          <div className="space-y-5">
            <div className="rounded-[32px] bg-[oklch(0.2475_0.0661_146.79)] p-6 text-white shadow-2xl shadow-[oklch(0.2475_0.0661_146.79)]/12">
              <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-white/12">
                <Sparkles className="size-5" />
              </div>
              <p className="font-erode text-2xl font-semibold leading-tight">
                {recommendedProgram?.title ?? step.recommendation.title}
              </p>
              <p className="mt-3 text-sm font-medium leading-relaxed text-white/64">
                {step.recommendation.whyFits}
              </p>
            </div>
            <div className="grid gap-3">
              {step.recommendation.focusPoints.map((point) => (
                <div
                  key={point}
                  className="flex gap-3 rounded-2xl bg-[#F5F5F7] p-4 text-sm font-semibold leading-relaxed text-[#06290C]/70"
                >
                  <Check className="mt-0.5 size-4 shrink-0 text-[oklch(0.2475_0.0661_146.79)]" strokeWidth={3} />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>
        );
    }
  }

  return (
    <div className="min-h-screen bg-white text-[#06290C] font-satoshi">
      <NavbarSticky simple />
      <main className="mx-auto w-full max-w-2xl px-5 py-10 md:py-20">
        {currentIndex === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="mb-12 text-center"
          >
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.22em] text-[#06290C]/45">
              Program Finder
            </p>
            <h1 className="font-erode text-5xl font-semibold leading-[0.95] tracking-tight text-[#06290C] md:text-6xl">
              Find your first program.
            </h1>
            <p className="mx-auto mt-5 max-w-md text-[15px] font-medium leading-relaxed text-[#06290C]/55">
              Answer once. We save your profile, recommend a path, and use it across the website and app.
            </p>
          </motion.div>
        ) : null}

        {currentStep ? (
          <>
            <div className="mb-8 border-b border-[#06290C]/10 pb-6">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#06290C]/40">
                Step {Math.min(currentIndex + 1, steps.length)} of {steps.length}
              </p>
              <h2 className="font-erode text-3xl font-semibold leading-tight text-[#06290C] md:text-4xl">
                {currentStep.title}
              </h2>
              <p className="mt-3 text-[14px] font-medium leading-relaxed text-[#06290C]/50">
                {currentStep.description}
              </p>
              <div className="mt-5 flex gap-1">
                {steps.map((step, index) => (
                  <span
                    key={step.id}
                    className={cn(
                      "h-1 rounded-full transition-all duration-300",
                      index <= currentIndex ? "w-8 bg-[#06290C]" : "w-4 bg-[#06290C]/10"
                    )}
                  />
                ))}
              </div>
            </div>

            <AnimatePresence mode="popLayout">
              <motion.div
                key={currentStep.id}
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -18 }}
                transition={{ duration: 0.24, ease: "easeOut" }}
              >
                {renderStep(currentStep)}
              </motion.div>
            </AnimatePresence>
          </>
        ) : null}

        {error && (
          <div className="mt-8 rounded-2xl bg-[#FFF5F5] px-4 py-3 text-sm font-bold text-[#C82A2A]">
            {error}
          </div>
        )}

        <div className="mt-12 flex items-center justify-between gap-4 border-t border-[#06290C]/10 pt-8">
          <Button
            type="button"
            variant="outline"
            disabled={currentIndex === 0 || isSubmitting}
            onClick={() => setCurrentIndex((index) => Math.max(index - 1, 0))}
            className="h-[52px] rounded-full border-[#06290C]/15 px-7 text-[15px] font-semibold text-[#06290C] transition-all hover:border-[#06290C]/30 hover:bg-[#F5F5F7] active:scale-[0.98]"
          >
            <ArrowLeft className="mr-2 size-[18px]" />
            Back
          </Button>
          <Button
            type="button"
            disabled={!canContinue || isSubmitting}
            onClick={handleNext}
            className="h-[52px] rounded-full bg-[#06290C] px-8 text-[15px] font-semibold text-white shadow-md shadow-[#06290C]/20 transition-all hover:bg-[#06290C]/90 active:scale-[0.98] disabled:opacity-45"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Saving
              </>
            ) : isLastStep ? (
              <>
                Add to cart
                <ArrowRight className="ml-2 size-[18px]" />
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="ml-2 size-[18px]" />
              </>
            )}
          </Button>
        </div>
      </main>
      <FooterVariantTwo />
    </div>
  );
}
