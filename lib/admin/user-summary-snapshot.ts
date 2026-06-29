import { formatDateTime, formatProgramName } from "@/lib/admin/format";
import type { AdminUserSummaryContext } from "@/lib/admin/user-summary-context";
import {
  formatEngagementLevel,
  FREE_DETOX_PROGRAM_SLUG,
  FREE_DETOX_TOTAL_DAYS,
} from "@/lib/admin/user-app-usage";

export const ADMIN_USER_SUMMARY_SCHEMA_VERSION = 3;

export const EMPTY_SUMMARY_VALUE = "—";

export type SummaryRow = {
  badgeTone?: "sky" | "amber" | "rose" | "teal" | "violet" | "slate";
  key: string;
  label: string;
  value: string;
};

export type AdminUserSummarySnapshot = {
  appUsageAndActivity: SummaryRow[];
  communication: SummaryRow[];
  dietAndAddOns: SummaryRow[];
  overview: SummaryRow[];
  profileAndIntent: SummaryRow[];
  programOwnership: SummaryRow[];
  purchasesAndRevenue: SummaryRow[];
};

export type AdminUserSummaryInsights = {
  headline: string;
  nextBestAction: string;
  recommendedTone: string;
  risks: string[];
  salesTalkingPoints: string[];
};

export type AdminUserSummary = {
  insights: AdminUserSummaryInsights;
  schemaVersion: 3;
  snapshot: AdminUserSummarySnapshot;
};

function row(
  key: string,
  label: string,
  value: string | null | undefined,
  options: Pick<SummaryRow, "badgeTone"> = {}
): SummaryRow {
  const trimmed = value?.trim();
  return {
    badgeTone: options.badgeTone,
    key,
    label,
    value: trimmed ? trimmed : EMPTY_SUMMARY_VALUE,
  };
}

function yesNo(value: boolean | null | undefined) {
  if (value === true) return "Yes";
  if (value === false) return "No";
  return EMPTY_SUMMARY_VALUE;
}

function consentAt(value: string | null | undefined) {
  return value ? formatDateTime(value) : "Not consented";
}

function deriveAccountType(context: AdminUserSummaryContext) {
  const paidPrograms = context.appUsage.paidPrograms;
  const hasPaidAccess = paidPrograms.length > 0;

  if (hasPaidAccess) {
    return "Paid program owner";
  }

  if (context.appUsage.freeDetox.status !== "not_activated") {
    return "Free Detox user";
  }

  if (context.detail.programs.length > 0) {
    return "Program access (no paid journey)";
  }

  return "Prospect / no program access";
}

function formatFreeDetoxStatus(context: AdminUserSummaryContext) {
  switch (context.appUsage.freeDetox.status) {
    case "completed":
      return "Completed";
    case "in_progress":
      return "In progress";
    case "activated_no_progress":
      return "Activated, not started";
    default:
      return "Not activated";
  }
}

function formatFreeDetoxProgress(context: AdminUserSummaryContext) {
  const { freeDetox } = context.appUsage;

  if (freeDetox.status === "completed") {
    return `Completed (${freeDetox.completedDays.length}/${freeDetox.totalDays} days)`;
  }

  if (freeDetox.currentDay && freeDetox.status === "in_progress") {
    return `Day ${freeDetox.currentDay} of ${freeDetox.totalDays}`;
  }

  if (freeDetox.status === "activated_no_progress") {
    return "Activated, no day progress yet";
  }

  return EMPTY_SUMMARY_VALUE;
}

function formatAllPrograms(context: AdminUserSummaryContext) {
  if (context.detail.programs.length === 0) {
    return EMPTY_SUMMARY_VALUE;
  }

  return context.detail.programs
    .map((program) => {
      const parts = [program.program, program.programState];
      if (program.currentDay > 0) {
        parts.push(`day ${program.currentDay}`);
      }
      if (program.pausedAt) {
        parts.push("paused");
      }
      return parts.join(" · ");
    })
    .join("; ");
}

function formatActivePrograms(context: AdminUserSummaryContext) {
  const active = context.detail.programs.filter((program) => program.programState === "active");
  if (active.length === 0) {
    return "None active";
  }

  return `${active.length} · ${active.map((program) => program.program).join(", ")}`;
}

function formatQueuePosition(context: AdminUserSummaryContext) {
  const queued = context.detail.programs
    .filter((program) => program.priorityRank !== null)
    .sort((left, right) => (left.priorityRank ?? 99) - (right.priorityRank ?? 99));

  if (queued.length === 0) {
    return EMPTY_SUMMARY_VALUE;
  }

  const next = queued[0];
  return `#${next.priorityRank} · ${next.program}`;
}

function formatActiveProgramDay(context: AdminUserSummaryContext) {
  const activePaid = context.appUsage.paidPrograms
    .filter((program) => program.programState === "active")
    .sort((left, right) => right.currentDay - left.currentDay)[0];

  if (activePaid) {
    return `${activePaid.program} · day ${activePaid.currentDay}`;
  }

  const activeFromDetail = context.detail.programs.find(
    (program) =>
      program.programState === "active" && program.programSlug !== FREE_DETOX_PROGRAM_SLUG
  );

  if (activeFromDetail && activeFromDetail.currentDay > 0) {
    return `${activeFromDetail.program} · day ${activeFromDetail.currentDay}`;
  }

  return EMPTY_SUMMARY_VALUE;
}

function formatRecentActivity(context: AdminUserSummaryContext) {
  const recent = context.appUsage.recentEvents[0];
  if (!recent) {
    return EMPTY_SUMMARY_VALUE;
  }

  return `${recent.label} · ${formatDateTime(recent.occurredAt)}`;
}

function formatPurchaseChannel(context: AdminUserSummaryContext) {
  const paidWeb = context.detail.transactions.filter(
    (transaction) => transaction.paymentStatus === "paid"
  ).length;

  if (paidWeb > 0) {
    return "Web checkout";
  }

  if (context.detail.programs.length > 0) {
    return "Likely app store (no web transactions)";
  }

  return EMPTY_SUMMARY_VALUE;
}

function formatReferralUsed(context: AdminUserSummaryContext) {
  const redemption = context.extras.referralRedemptions[0];
  if (!redemption) {
    return "None";
  }

  return `${redemption.referral_code_snapshot} · ${redemption.partner_name_snapshot}`;
}

function formatQuestionnaireRecommend(context: AdminUserSummaryContext) {
  const latestRun = context.extras.questionnaireRuns[0];
  if (latestRun?.recommended_program) {
    return formatProgramName(latestRun.recommended_program);
  }

  if (context.detail.profile.recommendedProgram) {
    return context.detail.profile.recommendedProgram;
  }

  return EMPTY_SUMMARY_VALUE;
}

function formatLatestEmailStatus(context: AdminUserSummaryContext) {
  const latest = context.detail.emails[0];
  if (!latest) {
    return EMPTY_SUMMARY_VALUE;
  }

  return `${latest.emailType} · ${latest.status}`;
}

export function buildAdminUserSummarySnapshot(
  context: AdminUserSummaryContext
): AdminUserSummarySnapshot {
  const { appUsage, detail, extras } = context;
  const latestDietOrder = detail.dietOrders[0];
  const paidTransactions = detail.transactions.filter(
    (transaction) => transaction.paymentStatus === "paid"
  );

  return {
    overview: [
      row("accountType", "Account type", deriveAccountType(context), { badgeTone: "violet" }),
      row("memberSince", "Member since", formatDateTime(detail.profile.createdAt)),
      row("onboarding", "Onboarding", yesNo(detail.profile.onboardingComplete), {
        badgeTone: detail.profile.onboardingComplete ? "sky" : "amber",
      }),
      row("recommendedProgram", "Recommended program", detail.profile.recommendedProgram),
      row(
        "activePreference",
        "Active preference",
        detail.preference?.activeProgram ?? EMPTY_SUMMARY_VALUE
      ),
      row(
        "queueReviewed",
        "Queue reviewed",
        detail.preference?.queueReviewedAt
          ? formatDateTime(detail.preference.queueReviewedAt)
          : "Not reviewed"
      ),
    ],
    programOwnership: [
      row("programsOwned", "Programs owned", String(detail.programs.length)),
      row("activePrograms", "Active programs", formatActivePrograms(context)),
      row("freeDetoxStatus", "Free Detox status", formatFreeDetoxStatus(context), {
        badgeTone: appUsage.freeDetox.status === "in_progress" ? "teal" : undefined,
      }),
      row("freeDetoxProgress", "Free Detox progress", formatFreeDetoxProgress(context)),
      row("queuePosition", "Queue position", formatQueuePosition(context)),
      row("allPrograms", "All programs", formatAllPrograms(context)),
    ],
    appUsageAndActivity: [
      row("engagement", "Engagement", formatEngagementLevel(appUsage.engagementLevel), {
        badgeTone:
          appUsage.engagementLevel === "active"
            ? "sky"
            : appUsage.engagementLevel === "dormant"
              ? "rose"
              : "amber",
      }),
      row(
        "lastActive",
        "Last active",
        appUsage.lastActiveAt ? formatDateTime(appUsage.lastActiveAt) : EMPTY_SUMMARY_VALUE
      ),
      row("activeProgramDay", "Active program day", formatActiveProgramDay(context)),
      row("journalEntries", "Journal entries", String(appUsage.journal.count)),
      row(
        "lastJournal",
        "Last journal",
        appUsage.journal.lastEntryDate
          ? formatDateTime(appUsage.journal.lastEntryDate)
          : EMPTY_SUMMARY_VALUE
      ),
      row("checkIns", "Check-ins", String(appUsage.routineCheckins.count)),
      row(
        "lastCheckIn",
        "Last check-in",
        appUsage.routineCheckins.lastAt
          ? formatDateTime(appUsage.routineCheckins.lastAt)
          : EMPTY_SUMMARY_VALUE
      ),
      row("recentActivity", "Recent activity", formatRecentActivity(context)),
    ],
    purchasesAndRevenue: [
      row("webSpend", "Web spend", extras.totalWebSpendInr),
      row("paidTransactions", "Paid transactions", String(paidTransactions.length)),
      row("purchaseChannel", "Purchase channel", formatPurchaseChannel(context)),
      row("referralUsed", "Referral used", formatReferralUsed(context)),
    ],
    dietAndAddOns: [
      row("dietOrders", "Diet orders", String(detail.dietOrders.length)),
      row(
        "latestOrderStatus",
        "Latest order status",
        latestDietOrder?.status ?? EMPTY_SUMMARY_VALUE,
        {
          badgeTone:
            latestDietOrder?.status === "delivered"
              ? "sky"
              : latestDietOrder?.status === "failed"
                ? "rose"
                : "amber",
        }
      ),
      row(
        "latestOrderDate",
        "Latest order date",
        latestDietOrder?.createdAt
          ? formatDateTime(latestDietOrder.createdAt)
          : EMPTY_SUMMARY_VALUE
      ),
    ],
    profileAndIntent: [
      row("primaryConcern", "Primary concern", extras.primaryConcern ?? EMPTY_SUMMARY_VALUE),
      row("questionnaireRecommend", "Questionnaire recommend", formatQuestionnaireRecommend(context)),
      row("detoxLeads", "Detox leads", String(extras.detoxLeads.length)),
      row("consultationLeads", "Consultation leads", String(extras.consultationLeads.length)),
    ],
    communication: [
      row("pushOptIn", "Push opt-in", yesNo(extras.pushOptIn), {
        badgeTone: extras.pushOptIn ? "sky" : "slate",
      }),
      row("whatsappService", "WhatsApp service", consentAt(extras.whatsappServiceConsentAt)),
      row("whatsappMarketing", "WhatsApp marketing", consentAt(extras.whatsappMarketingConsentAt)),
      row("notifications", "Notifications", yesNo(extras.notificationsEnabled)),
      row("latestEmailStatus", "Latest email status", formatLatestEmailStatus(context)),
    ],
  };
}
