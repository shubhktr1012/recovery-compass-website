import { NextRequest, NextResponse } from "next/server";
import { isProgramFinderEnabled } from "@/lib/features";
import { buildRecoveryProfilePersistencePayload, type OnboardingAnswers } from "@/lib/recovery-profile";
import { createSupabaseServerClient } from "@/lib/supabase-server";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function isStringRecord(value: unknown): value is Record<string, string | string[]> {
  if (!isRecord(value)) return false;

  return Object.values(value).every((entry) => {
    if (typeof entry === "string") return true;
    return Array.isArray(entry) && entry.every((item) => typeof item === "string");
  });
}

function parseAnswers(value: unknown): OnboardingAnswers {
  if (!isRecord(value)) {
    throw new Error("Questionnaire answers are required.");
  }

  const questionValues = value.questionValues;
  if (!isStringRecord(questionValues)) {
    throw new Error("Questionnaire answers are invalid.");
  }

  return {
    name: typeof value.name === "string" ? value.name : "",
    phoneNumber: typeof value.phoneNumber === "string" ? value.phoneNumber : "",
    age: typeof value.age === "string" ? value.age : "",
    gender:
      value.gender === "Male" || value.gender === "Female" || value.gender === "Prefer not to say"
        ? value.gender
        : "",
    path:
      value.path === "self_select" || value.path === "guided_recommendation"
        ? value.path
        : null,
    selfSelectJourney:
      typeof value.selfSelectJourney === "string"
        ? (value.selfSelectJourney as OnboardingAnswers["selfSelectJourney"])
        : null,
    guidedMainIssue:
      typeof value.guidedMainIssue === "string"
        ? (value.guidedMainIssue as OnboardingAnswers["guidedMainIssue"])
        : null,
    questionValues,
  };
}

export async function POST(req: NextRequest) {
  try {
    if (!isProgramFinderEnabled()) {
      return NextResponse.json({ message: "Program Finder is not available." }, { status: 404 });
    }

    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const answers = parseAnswers((body as { answers?: unknown }).answers);
    const payload = buildRecoveryProfilePersistencePayload({
      answers,
      source: "website_program_finder",
      userId: user.id,
    });

    const profilePayload = {
      ...payload.profilePayload,
      email: user.email ?? null,
    };

    const [{ error: onboardingError }, { error: profileError }, { error: runError }] = await Promise.all([
      supabase
        .from("onboarding_responses")
        .upsert(payload.legacyPayload, { onConflict: "user_id" }),
      supabase
        .from("profiles")
        .upsert(profilePayload, { onConflict: "id" }),
      supabase
        .from("questionnaire_runs")
        .insert(payload.questionnaireRunPayload),
    ]);

    if (onboardingError) throw onboardingError;
    if (profileError) throw profileError;
    if (runError) throw runError;

    return NextResponse.json({
      journey: payload.resolution.journey,
      recommendedProgram: payload.resolution.recommendedProgram,
      primaryConcernLabel: payload.resolution.primaryConcernLabel,
    });
  } catch (error) {
    console.error("[ProgramFinder] Failed to complete questionnaire:", error);
    return NextResponse.json({ message: getErrorMessage(error) }, { status: 400 });
  }
}
