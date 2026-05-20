import { getGuidedIssueLabel, getJourneyConfig } from "./config";
import {
  getActiveQuestionSequence,
  getOnboardingResolution,
  SECONDARY_SYMPTOMS_QUESTION_ID,
} from "./flow";
import type {
  JourneyKey,
  OnboardingAnswers,
  QuestionDefinition,
  SelectionOption,
} from "./types";

export type QuestionnaireRunSource = "self_select" | "guided_recommendation" | "website_program_finder";

export const QUESTIONNAIRE_VERSION = "onboarding_redesign_v2";

function getOptionLabel(options: SelectionOption[] | undefined, value: string | null | undefined) {
  if (!options || !value) return null;
  return options.find((option) => option.id === value)?.label ?? value;
}

function serializeQuestionValue(
  question: QuestionDefinition,
  rawValue: string | string[] | undefined
) {
  if (rawValue == null) return null;

  if (question.type === "multi_select") {
    const selectedValues = Array.isArray(rawValue) ? rawValue : [rawValue];
    return selectedValues
      .map((value) => getOptionLabel(question.options, value))
      .filter((value): value is string => Boolean(value));
  }

  if (Array.isArray(rawValue)) return rawValue;

  return getOptionLabel(question.options, rawValue) ?? rawValue;
}

function serializeQuestionEntries(
  question: QuestionDefinition,
  answers: OnboardingAnswers
): [string, string | string[] | null][] {
  if (question.type === "compound_number_input" && question.inputs?.length) {
    return question.inputs.map((input) => [
      input.id,
      serializeQuestionValue(question, answers.questionValues[input.id]),
    ]);
  }

  const entries: [string, string | string[] | null][] = [
    [question.id, serializeQuestionValue(question, answers.questionValues[question.id])],
  ];

  if (question.customInputId) {
    const shouldPersistCustomValue =
      question.customOptionId && answers.questionValues[question.id] === question.customOptionId;

    entries.push([
      question.customInputId,
      shouldPersistCustomValue
        ? serializeQuestionValue(question, answers.questionValues[question.customInputId])
        : null,
    ]);
  }

  return entries;
}

function toNumericValue(value: string | string[] | undefined) {
  if (Array.isArray(value) || !value) return null;
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : null;
}

function normalizeOptionalPhoneNumber(value: string) {
  const trimmedValue = value.trim();
  return trimmedValue.length > 0 ? trimmedValue : null;
}

export function buildRecoveryProfilePersistencePayload(args: {
  answers: OnboardingAnswers;
  source?: QuestionnaireRunSource;
  updatedAt?: string;
  userId: string;
}) {
  const { answers, source, userId } = args;
  const updatedAt = args.updatedAt ?? new Date().toISOString();
  const resolution = getOnboardingResolution(answers);

  if (!resolution.journey || !resolution.recommendedProgram || !resolution.primaryConcernLabel) {
    throw new Error("The onboarding flow is incomplete.");
  }

  const journeyConfig = getJourneyConfig(resolution.journey);
  const activeQuestions = getActiveQuestionSequence(answers);
  const serializedQuestionAnswers = Object.fromEntries(
    activeQuestions.flatMap((question) => serializeQuestionEntries(question, answers))
  );

  const numericBaselineQuestion = journeyConfig.questions.baseline?.find(
    (question) => question.type === "number_input"
  );
  const severityInputId =
    journeyConfig.questions.severity.type === "compound_number_input" &&
    journeyConfig.questions.severity.inputs?.[0]?.id
      ? journeyConfig.questions.severity.inputs[0].id
      : numericBaselineQuestion?.id
        ? numericBaselineQuestion.id
        : journeyConfig.questions.severity.id;
  const spendInputId =
    journeyConfig.questions.severity.type === "compound_number_input" &&
    journeyConfig.questions.severity.inputs?.[1]?.id
      ? journeyConfig.questions.severity.inputs[1].id
      : journeyConfig.questions.spend?.id ?? null;

  const durationAnswer = serializedQuestionAnswers[journeyConfig.questions.duration.id];
  const frictionAnswer = serializedQuestionAnswers[journeyConfig.questions.friction.id];
  const lifestyleAnswer = serializedQuestionAnswers[journeyConfig.questions.lifestyle.id];
  const triggerAnswer = serializedQuestionAnswers[journeyConfig.questions.trigger.id];
  const copingAnswer = serializedQuestionAnswers[journeyConfig.questions.coping.id];
  const outcomeAnswer = journeyConfig.questions.outcome
    ? serializedQuestionAnswers[journeyConfig.questions.outcome.id]
    : null;
  const secondarySymptoms =
    (serializedQuestionAnswers[SECONDARY_SYMPTOMS_QUESTION_ID] as string[] | null) ?? [];
  const dailyConsumptionAmount = toNumericValue(answers.questionValues[severityInputId]);
  const dailyConsumptionCost = spendInputId
    ? toNumericValue(answers.questionValues[spendInputId])
    : null;

  const questionnaireAnswers = {
    version: QUESTIONNAIRE_VERSION,
    path: answers.path,
    quickProfile: {
      name: answers.name.trim(),
      phoneNumber: normalizeOptionalPhoneNumber(answers.phoneNumber),
      age: Number(answers.age),
      gender: answers.gender,
    },
    selectedProgram: answers.path === "self_select" ? journeyConfig.selectionLabel : null,
    mainIssue:
      answers.path === "guided_recommendation"
        ? getGuidedIssueLabel(answers.guidedMainIssue)
        : null,
    journey: resolution.journey,
    recommendedProgram: resolution.recommendedProgram,
    secondarySymptoms,
    answers: serializedQuestionAnswers,
  };

  return {
    legacyPayload: {
      user_id: userId,
      full_name: answers.name.trim(),
      age: Number(answers.age),
      target_selection: journeyConfig.selectionLabel,
      past_attempts: typeof durationAnswer === "string" ? durationAnswer : null,
      triggers: [
        typeof lifestyleAnswer === "string" ? lifestyleAnswer : null,
        typeof triggerAnswer === "string" ? triggerAnswer : null,
        typeof copingAnswer === "string" ? copingAnswer : null,
        typeof outcomeAnswer === "string" ? outcomeAnswer : null,
        ...secondarySymptoms,
      ].filter((value): value is string => Boolean(value)),
      root_cause: resolution.primaryConcernLabel,
      physical_toll: typeof frictionAnswer === "string" ? frictionAnswer : resolution.primaryConcernLabel,
      mental_toll: null,
      daily_consumption_amount: dailyConsumptionAmount,
      daily_consumption_cost: dailyConsumptionCost,
      primary_goal: journeyConfig.primaryGoal,
      updated_at: updatedAt,
    },
    profilePayload: {
      id: userId,
      phone_number: normalizeOptionalPhoneNumber(answers.phoneNumber),
      phone_verified_at: null,
      onboarding_complete: true,
      recommended_program: resolution.recommendedProgram,
      questionnaire_answers: questionnaireAnswers,
      onboarding_completed_at: updatedAt,
      updated_at: updatedAt,
    },
    questionnaireRunPayload: {
      user_id: userId,
      source: source ?? (answers.path === "guided_recommendation" ? "guided_recommendation" : "self_select"),
      questionnaire_version: QUESTIONNAIRE_VERSION,
      journey_key: resolution.journey as JourneyKey,
      recommended_program: resolution.recommendedProgram,
      primary_concern_label: resolution.primaryConcernLabel,
      questionnaire_answers: questionnaireAnswers,
      completed_at: updatedAt,
      updated_at: updatedAt,
    },
    resolution,
  };
}
