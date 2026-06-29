import { getAdminUserDetail } from "@/lib/admin/data";
import { formatInrFromPaise, formatProgramName } from "@/lib/admin/format";
import type { AdminRole } from "@/lib/admin/types";
import {
  buildAppUsageSnapshot,
  FREE_DETOX_PROGRAM_SLUG,
  type AppUsageSnapshot,
} from "@/lib/admin/user-app-usage";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const ADMIN_USER_SUMMARY_CONTEXT_VERSION = 2;

type QuestionnaireRunRow = {
  completed_at: string;
  journey_key: string;
  primary_concern_label: string | null;
  questionnaire_version: string;
  recommended_program: string;
  source: string;
};

type ProfileExtrasRow = {
  consecutive_absent_days: number | null;
  email: string | null;
  free_tier_activated_at: string | null;
  notifications_enabled: boolean | null;
  onboarding_completed_at: string | null;
  phone_number: string | null;
  phone_verified_at: string | null;
  primary_concern: string | null;
  push_opt_in: boolean | null;
  questionnaire_answers: Record<string, unknown> | null;
  timezone: string | null;
  whatsapp_marketing_consent_at: string | null;
  whatsapp_service_consent_at: string | null;
};

type FreeProgramProgressRow = {
  completed_at: string | null;
  completed_days: number[] | null;
  current_day: number | null;
  partial_days: number[] | null;
  updated_at: string | null;
};

type UserEventCountRow = {
  event_type: string;
  occurred_at: string | null;
};

type ReferralRedemptionRow = {
  commission_amount_paise: number;
  created_at: string;
  partner_name_snapshot: string;
  payout_status: string;
  redemption_status: string;
  referral_code_snapshot: string;
};

type LeadRow = {
  created_at: string;
  email: string | null;
  entry_point?: string | null;
  name?: string | null;
  primary_focus?: string | null;
};

export type AdminUserSummaryContext = {
  appUsage: AppUsageSnapshot;
  contextVersion: number;
  dataGaps: string[];
  detail: NonNullable<Awaited<ReturnType<typeof getAdminUserDetail>>>;
  extras: {
    consecutiveAbsentDays: number;
    detoxLeads: LeadRow[];
    consultationLeads: LeadRow[];
    notificationsEnabled: boolean;
    onboardingCompletedAt: string | null;
    phoneNumber: string | null;
    phoneVerifiedAt: string | null;
    primaryConcern: string | null;
    pushOptIn: boolean;
    questionnaireAnswersSummary: Record<string, string>;
    questionnaireRuns: QuestionnaireRunRow[];
    referralRedemptions: ReferralRedemptionRow[];
    timezone: string | null;
    totalWebSpendInr: string;
    whatsappMarketingConsentAt: string | null;
    whatsappServiceConsentAt: string | null;
  };
  generatedForRole: AdminRole;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function summarizeQuestionnaireAnswers(value: unknown): Record<string, string> {
  if (!isRecord(value)) {
    return {};
  }

  const keys = [
    "name",
    "age",
    "gender",
    "goal",
    "primaryGoal",
    "primary_concern",
    "path",
    "selfSelectJourney",
    "guidedMainIssue",
  ] as const;

  const summary: Record<string, string> = {};
  for (const key of keys) {
    const entry = value[key];
    if (typeof entry === "string" && entry.trim()) {
      summary[key] = entry.trim();
    }
  }

  const questionValues = value.questionValues;
  if (isRecord(questionValues)) {
    for (const [key, entry] of Object.entries(questionValues)) {
      if (typeof entry === "string" && entry.trim()) {
        summary[`q_${key}`] = entry.trim();
      } else if (Array.isArray(entry) && entry.every((item) => typeof item === "string")) {
        summary[`q_${key}`] = entry.join(", ");
      }
    }
  }

  return summary;
}

async function readList<T>(
  query: PromiseLike<{ data: T[] | null; error: { message: string } | null }>,
  label: string
) {
  const { data, error } = await query;
  if (error) {
    throw new Error(`${label}: ${error.message}`);
  }
  return data ?? [];
}

async function readSingle<T>(
  query: PromiseLike<{ data: T | null; error: { message: string } | null }>,
  label: string
) {
  const { data, error } = await query;
  if (error) {
    throw new Error(`${label}: ${error.message}`);
  }
  return data;
}

function attachDayStatesBySlug(
  programs: NonNullable<Awaited<ReturnType<typeof getAdminUserDetail>>>["programs"],
  dayStates: NonNullable<Awaited<ReturnType<typeof getAdminUserDetail>>>["dayStates"]
) {
  const slugByProgramLabel = new Map(
    programs.map((program) => [program.program, program.programSlug])
  );

  const bySlug = new Map<
    string,
    Array<{
      cards: string;
      day: number;
      finalizedAt: string | null;
      state: string;
    }>
  >();

  for (const state of dayStates) {
    const slug =
      programs.find((program) => program.program === state.program)?.programSlug ??
      slugByProgramLabel.get(state.program) ??
      null;
    if (!slug) continue;
    const bucket = bySlug.get(slug) ?? [];
    bucket.push({
      cards: state.cards,
      day: state.day,
      finalizedAt: state.finalizedAt,
      state: state.state,
    });
    bySlug.set(slug, bucket);
  }

  return bySlug;
}

export async function buildAdminUserSummaryContext(
  userId: string,
  role: AdminRole
): Promise<AdminUserSummaryContext | null> {
  const detail = await getAdminUserDetail(userId, role);
  if (!detail) {
    return null;
  }

  const rawEmail = detail.profile.email;
  const emailForQuery =
    role === "viewer" && rawEmail?.includes("*")
      ? null
      : rawEmail?.trim().toLowerCase() ?? null;

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [
    profileExtras,
    questionnaireRuns,
    freeDetoxProgress,
    journalAgg,
    routineAgg,
    reflectionAgg,
    recentEventsForCounts,
    paidTransactionAmounts,
    referralRedemptions,
    detoxLeads,
    consultationLeads,
  ] = await Promise.all([
    readSingle<ProfileExtrasRow>(
      supabaseAdmin
        .from("profiles")
        .select(
          "email,phone_number,phone_verified_at,primary_concern,questionnaire_answers,onboarding_completed_at,free_tier_activated_at,notifications_enabled,push_opt_in,timezone,whatsapp_service_consent_at,whatsapp_marketing_consent_at,consecutive_absent_days"
        )
        .eq("id", userId)
        .maybeSingle(),
      "summary profile extras"
    ),
    readList<QuestionnaireRunRow>(
      supabaseAdmin
        .from("questionnaire_runs")
        .select(
          "questionnaire_version,journey_key,recommended_program,primary_concern_label,source,completed_at"
        )
        .eq("user_id", userId)
        .order("completed_at", { ascending: false })
        .limit(3),
      "summary questionnaire runs"
    ),
    readSingle<FreeProgramProgressRow>(
      supabaseAdmin
        .from("free_program_progress")
        .select("current_day,completed_days,partial_days,completed_at,updated_at")
        .eq("user_id", userId)
        .eq("program_slug", FREE_DETOX_PROGRAM_SLUG)
        .maybeSingle(),
      "summary free detox progress"
    ),
    Promise.all([
      supabaseAdmin
        .from("journal_entries")
        .select("entry_date", { count: "exact", head: true })
        .eq("user_id", userId),
      supabaseAdmin
        .from("journal_entries")
        .select("entry_date")
        .eq("user_id", userId)
        .order("entry_date", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]),
    Promise.all([
      supabaseAdmin
        .from("routine_checkins")
        .select("created_at", { count: "exact", head: true })
        .eq("user_id", userId),
      supabaseAdmin
        .from("routine_checkins")
        .select("created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]),
    Promise.all([
      supabaseAdmin
        .from("program_reflections")
        .select("created_at", { count: "exact", head: true })
        .eq("user_id", userId),
      supabaseAdmin
        .from("program_reflections")
        .select("created_at,program_slug,day_number")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]),
    readList<UserEventCountRow>(
      supabaseAdmin
        .from("user_events")
        .select("event_type,occurred_at")
        .eq("user_id", userId)
        .gte("occurred_at", thirtyDaysAgo)
        .order("occurred_at", { ascending: false })
        .limit(500),
      "summary event counts"
    ),
    readList<{ amount: number | null }>(
      supabaseAdmin
        .from("transactions")
        .select("amount")
        .eq("user_id", userId)
        .eq("payment_status", "paid"),
      "summary transaction totals"
    ),
    readList<ReferralRedemptionRow>(
      supabaseAdmin
        .from("referral_redemptions")
        .select(
          "referral_code_snapshot,partner_name_snapshot,redemption_status,payout_status,commission_amount_paise,created_at"
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(10),
      "summary referral redemptions"
    ),
    emailForQuery
      ? readList<LeadRow>(
          supabaseAdmin
            .from("detox_leads")
            .select("name,email,primary_focus,created_at")
            .ilike("email", emailForQuery)
            .order("created_at", { ascending: false })
            .limit(5),
          "summary detox leads"
        )
      : Promise.resolve([]),
    emailForQuery
      ? readList<LeadRow>(
          supabaseAdmin
            .from("complete_plan_consultation_leads")
            .select("name,email,entry_point,created_at")
            .ilike("email", emailForQuery)
            .order("created_at", { ascending: false })
            .limit(5),
          "summary consultation leads"
        )
      : Promise.resolve([]),
  ]);

  const eventCountsLast30Days = recentEventsForCounts.reduce<Record<string, number>>(
    (counts, row) => {
      counts[row.event_type] = (counts[row.event_type] ?? 0) + 1;
      return counts;
    },
    {}
  );

  const dayStatesBySlug = attachDayStatesBySlug(detail.programs, detail.dayStates);

  const paidPrograms = detail.programs
    .filter((program) => program.programSlug !== FREE_DETOX_PROGRAM_SLUG)
    .map((program) => ({
      completedAt: program.completedAt,
      currentDay: program.currentDay,
      dayStates: program.programSlug ? dayStatesBySlug.get(program.programSlug) ?? [] : [],
      pausedAt: null,
      priorityRank: program.priorityRank,
      program: program.program,
      programSlug: program.programSlug,
      programState: program.programState,
      purchaseState: program.purchaseState,
      scheduledStartDate: program.scheduledStartDate,
      startedAt: program.startedAt,
    }));

  const appUsage = buildAppUsageSnapshot({
    activity: detail.activity,
    dayStates: detail.dayStates.map((state) => ({
      cards: state.cards,
      day: state.day,
      finalizedAt: state.finalizedAt,
      program: state.program,
      state: state.state,
    })),
    eventCountsLast30Days,
    freeDetoxProgress: freeDetoxProgress
      ? {
          completedAt: freeDetoxProgress.completed_at,
          completedDays: freeDetoxProgress.completed_days ?? [],
          currentDay: freeDetoxProgress.current_day ?? 1,
          partialDays: freeDetoxProgress.partial_days ?? [],
          updatedAt: freeDetoxProgress.updated_at,
        }
      : null,
    freeTierActivatedAt: profileExtras?.free_tier_activated_at ?? null,
    journalCount: journalAgg[0].count ?? 0,
    journalLastEntryDate: journalAgg[1].data?.entry_date ?? null,
    programs: paidPrograms,
    reflectionCount: reflectionAgg[0].count ?? 0,
    reflectionLast: reflectionAgg[1].data
      ? {
          createdAt: reflectionAgg[1].data.created_at,
          dayNumber: reflectionAgg[1].data.day_number,
          programSlug: reflectionAgg[1].data.program_slug,
        }
      : null,
    routineCheckinCount: routineAgg[0].count ?? 0,
    routineCheckinLastAt: routineAgg[1].data?.created_at ?? null,
  });

  const dataGaps: string[] = [];
  if (detail.programs.length > 0 && detail.transactions.length === 0) {
    dataGaps.push("User has program access but no web checkout transactions (likely app/RevenueCat purchase).");
  }
  if (role === "viewer" && rawEmail?.includes("*")) {
    dataGaps.push("Viewer role: email is masked; email-matched leads may be incomplete.");
  }
  if (!profileExtras?.questionnaire_answers && questionnaireRuns.length === 0) {
    dataGaps.push("No onboarding questionnaire snapshot stored on profile or questionnaire_runs.");
  }

  const totalWebSpendPaise = paidTransactionAmounts.reduce(
    (sum, row) => sum + (row.amount ?? 0),
    0
  );

  return {
    appUsage,
    contextVersion: ADMIN_USER_SUMMARY_CONTEXT_VERSION,
    dataGaps,
    detail,
    extras: {
      consecutiveAbsentDays: profileExtras?.consecutive_absent_days ?? 0,
      detoxLeads,
      consultationLeads,
      notificationsEnabled: Boolean(profileExtras?.notifications_enabled),
      onboardingCompletedAt: profileExtras?.onboarding_completed_at ?? null,
      phoneNumber:
        role === "viewer" && profileExtras?.phone_number
          ? "(masked for viewer)"
          : profileExtras?.phone_number ?? null,
      phoneVerifiedAt: profileExtras?.phone_verified_at ?? null,
      primaryConcern: profileExtras?.primary_concern ?? null,
      pushOptIn: Boolean(profileExtras?.push_opt_in),
      questionnaireAnswersSummary: summarizeQuestionnaireAnswers(
        profileExtras?.questionnaire_answers
      ),
      questionnaireRuns,
      referralRedemptions,
      timezone: profileExtras?.timezone ?? null,
      totalWebSpendInr: formatInrFromPaise(totalWebSpendPaise),
      whatsappMarketingConsentAt: profileExtras?.whatsapp_marketing_consent_at ?? null,
      whatsappServiceConsentAt: profileExtras?.whatsapp_service_consent_at ?? null,
    },
    generatedForRole: role,
  };
}

export function buildUserSummaryPromptContext(context: AdminUserSummaryContext) {
  const { detail, extras, appUsage, dataGaps } = context;

  return {
    account: {
      createdAt: detail.profile.createdAt,
      displayName: detail.profile.displayName,
      email: detail.profile.email,
      id: detail.profile.id,
      onboardingComplete: detail.profile.onboardingComplete,
      onboardingCompletedAt: extras.onboardingCompletedAt,
      recommendedProgram: detail.profile.recommendedProgram,
      updatedAt: detail.profile.updatedAt,
    },
    appUsage,
    communication: {
      emails: detail.emails.slice(0, 15),
      notificationsEnabled: extras.notificationsEnabled,
      pushOptIn: extras.pushOptIn,
      whatsappMarketingConsentAt: extras.whatsappMarketingConsentAt,
      whatsappServiceConsentAt: extras.whatsappServiceConsentAt,
    },
    dataGaps,
    dietOrders: detail.dietOrders,
    intent: {
      consultationLeads: extras.consultationLeads,
      detoxLeads: extras.detoxLeads,
      primaryConcern: extras.primaryConcern,
      questionnaireAnswersSummary: extras.questionnaireAnswersSummary,
      questionnaireRuns: extras.questionnaireRuns.map((run) => ({
        ...run,
        recommended_program: formatProgramName(run.recommended_program),
      })),
    },
    preference: detail.preference,
    profileContact: {
      consecutiveAbsentDays: extras.consecutiveAbsentDays,
      phoneNumber: extras.phoneNumber,
      phoneVerifiedAt: extras.phoneVerifiedAt,
      timezone: extras.timezone,
    },
    programs: detail.programs,
    purchases: {
      referralRedemptions: extras.referralRedemptions,
      totalWebSpendInr: extras.totalWebSpendInr,
      transactions: detail.transactions,
    },
    recentActivity: detail.activity.slice(0, 20),
  };
}
