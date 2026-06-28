import { formatDateTime, formatProgramName } from "@/lib/admin/format";
import type { AdminActivityItem } from "@/lib/admin/types";

export const FREE_DETOX_PROGRAM_SLUG = "free_detox_reset";
export const FREE_DETOX_TOTAL_DAYS = 6;

export type EngagementLevel = "active" | "moderate" | "dormant" | "never_started";

export type PaidProgramUsage = {
  completedAt: string | null;
  currentDay: number;
  dayStates: Array<{
    cards: string;
    day: number;
    finalizedAt: string | null;
    state: string;
  }>;
  pausedAt: string | null;
  priorityRank: number | null;
  program: string;
  programSlug: string | null;
  programState: string;
  purchaseState: string;
  scheduledStartDate: string | null;
  startedAt: string | null;
};

export type FreeDetoxUsage = {
  activatedAt: string | null;
  completedAt: string | null;
  completedDays: number[];
  currentDay: number | null;
  partialDays: number[];
  progressUpdatedAt: string | null;
  status: "completed" | "in_progress" | "activated_no_progress" | "not_activated";
  totalDays: number;
};

export type AppUsageSnapshot = {
  engagementLevel: EngagementLevel;
  eventCountsLast30Days: Record<string, number>;
  freeDetox: FreeDetoxUsage;
  journal: { count: number; lastEntryDate: string | null };
  lastActiveAt: string | null;
  paidPrograms: PaidProgramUsage[];
  programReflections: {
    count: number;
    lastAt: string | null;
    lastDay: number | null;
    lastProgram: string | null;
  };
  recentEvents: Array<{
    detail: string;
    label: string;
    occurredAt: string;
    programSlug: string | null;
  }>;
  routineCheckins: { count: number; lastAt: string | null };
};

type BuildAppUsageSnapshotInput = {
  activity: AdminActivityItem[];
  dayStates: Array<{
    cards: string;
    day: number;
    finalizedAt: string | null;
    program: string;
    state: string;
  }>;
  eventCountsLast30Days: Record<string, number>;
  freeDetoxProgress: {
    completedAt: string | null;
    completedDays: number[];
    currentDay: number;
    partialDays: number[];
    updatedAt: string | null;
  } | null;
  freeTierActivatedAt: string | null;
  journalCount: number;
  journalLastEntryDate: string | null;
  programs: Array<{
    completedAt: string | null;
    currentDay: number;
    priorityRank: number | null;
    program: string;
    programSlug: string | null;
    programState: string;
    purchaseState: string;
    scheduledStartDate: string | null;
    startedAt: string | null;
  }>;
  reflectionCount: number;
  reflectionLast: {
    createdAt: string | null;
    dayNumber: number | null;
    programSlug: string | null;
  } | null;
  routineCheckinCount: number;
  routineCheckinLastAt: string | null;
};

function deriveEngagementLevel(lastActiveAt: string | null, hasProgress: boolean): EngagementLevel {
  if (!lastActiveAt && !hasProgress) {
    return "never_started";
  }

  if (!lastActiveAt) {
    return hasProgress ? "moderate" : "never_started";
  }

  const lastMs = Date.parse(lastActiveAt);
  if (!Number.isFinite(lastMs)) {
    return hasProgress ? "moderate" : "never_started";
  }

  const daysSince = (Date.now() - lastMs) / (1000 * 60 * 60 * 24);
  if (daysSince <= 7) return "active";
  if (daysSince <= 30) return "moderate";
  return "dormant";
}

function buildFreeDetoxUsage(
  freeTierActivatedAt: string | null,
  progress: BuildAppUsageSnapshotInput["freeDetoxProgress"]
): FreeDetoxUsage {
  if (progress?.completedAt) {
    return {
      activatedAt: freeTierActivatedAt,
      completedAt: progress.completedAt,
      completedDays: progress.completedDays,
      currentDay: progress.currentDay,
      partialDays: progress.partialDays,
      progressUpdatedAt: progress.updatedAt,
      status: "completed",
      totalDays: FREE_DETOX_TOTAL_DAYS,
    };
  }

  if (progress) {
    return {
      activatedAt: freeTierActivatedAt,
      completedAt: null,
      completedDays: progress.completedDays,
      currentDay: progress.currentDay,
      partialDays: progress.partialDays,
      progressUpdatedAt: progress.updatedAt,
      status: "in_progress",
      totalDays: FREE_DETOX_TOTAL_DAYS,
    };
  }

  if (freeTierActivatedAt) {
    return {
      activatedAt: freeTierActivatedAt,
      completedAt: null,
      completedDays: [],
      currentDay: null,
      partialDays: [],
      progressUpdatedAt: null,
      status: "activated_no_progress",
      totalDays: FREE_DETOX_TOTAL_DAYS,
    };
  }

  return {
    activatedAt: null,
    completedAt: null,
    completedDays: [],
    currentDay: null,
    partialDays: [],
    progressUpdatedAt: null,
    status: "not_activated",
    totalDays: FREE_DETOX_TOTAL_DAYS,
  };
}

export function buildAppUsageSnapshot(input: BuildAppUsageSnapshotInput): AppUsageSnapshot {
  const paidPrograms: PaidProgramUsage[] = input.programs
    .filter((program) => program.programSlug !== FREE_DETOX_PROGRAM_SLUG)
    .map((program) => ({
      completedAt: program.completedAt,
      currentDay: program.currentDay,
      dayStates:
        "dayStates" in program && Array.isArray((program as PaidProgramUsage).dayStates)
          ? (program as PaidProgramUsage).dayStates
          : [],
      pausedAt: program.pausedAt ?? null,
      priorityRank: program.priorityRank,
      program: program.program,
      programSlug: program.programSlug,
      programState: program.programState,
      purchaseState: program.purchaseState,
      scheduledStartDate: program.scheduledStartDate,
      startedAt: program.startedAt,
    }));

  const lastActiveAt =
    input.activity
      .map((item) => item.occurredAt)
      .filter(Boolean)
      .sort((left, right) => Date.parse(right) - Date.parse(left))[0] ?? null;

  const hasProgress =
    paidPrograms.some((program) => program.currentDay > 0) ||
    Boolean(input.freeDetoxProgress) ||
    input.journalCount > 0 ||
    input.routineCheckinCount > 0;

  const recentEvents = input.activity.slice(0, 10).map((item) => ({
    detail: item.detail,
    label: item.label,
    occurredAt: item.occurredAt,
    programSlug: item.programSlug,
  }));

  return {
    engagementLevel: deriveEngagementLevel(lastActiveAt, hasProgress),
    eventCountsLast30Days: input.eventCountsLast30Days,
    freeDetox: buildFreeDetoxUsage(input.freeTierActivatedAt, input.freeDetoxProgress),
    journal: {
      count: input.journalCount,
      lastEntryDate: input.journalLastEntryDate,
    },
    lastActiveAt,
    paidPrograms,
    programReflections: {
      count: input.reflectionCount,
      lastAt: input.reflectionLast?.createdAt ?? null,
      lastDay: input.reflectionLast?.dayNumber ?? null,
      lastProgram: input.reflectionLast?.programSlug
        ? formatProgramName(input.reflectionLast.programSlug)
        : null,
    },
    recentEvents,
    routineCheckins: {
      count: input.routineCheckinCount,
      lastAt: input.routineCheckinLastAt,
    },
  };
}

export function formatEngagementLevel(level: EngagementLevel) {
  switch (level) {
    case "active":
      return "Active (used app within 7 days)";
    case "moderate":
      return "Moderate (activity within 30 days)";
    case "dormant":
      return "Dormant (no recent activity)";
    default:
      return "Never started / no tracked activity";
  }
}

export function summarizeAppUsageForPrompt(snapshot: AppUsageSnapshot) {
  const lines: string[] = [
    `Engagement: ${formatEngagementLevel(snapshot.engagementLevel)}`,
    snapshot.lastActiveAt
      ? `Last active: ${formatDateTime(snapshot.lastActiveAt)}`
      : "Last active: unknown",
  ];

  if (snapshot.paidPrograms.length > 0) {
    lines.push("Paid programs:");
    for (const program of snapshot.paidPrograms) {
      lines.push(
        `- ${program.program}: day ${program.currentDay}, state=${program.programState}, purchase=${program.purchaseState}`
      );
    }
  }

  const detox = snapshot.freeDetox;
  if (detox.status === "completed") {
    lines.push(`Free Detox: completed (${detox.completedDays.length}/${detox.totalDays} days)`);
  } else if (detox.status === "in_progress") {
    lines.push(
      `Free Detox: day ${detox.currentDay}/${detox.totalDays}, completed days=[${detox.completedDays.join(", ")}]`
    );
  } else if (detox.status === "activated_no_progress") {
    lines.push("Free Detox: activated but no progress row yet");
  } else {
    lines.push("Free Detox: not activated");
  }

  lines.push(
    `Journal entries: ${snapshot.journal.count}${snapshot.journal.lastEntryDate ? `, last=${snapshot.journal.lastEntryDate}` : ""}`
  );
  lines.push(
    `Routine check-ins: ${snapshot.routineCheckins.count}${snapshot.routineCheckins.lastAt ? `, last=${formatDateTime(snapshot.routineCheckins.lastAt)}` : ""}`
  );

  if (snapshot.recentEvents.length > 0) {
    lines.push("Recent events:");
    for (const event of snapshot.recentEvents.slice(0, 5)) {
      lines.push(`- ${event.label}: ${event.detail} (${formatDateTime(event.occurredAt)})`);
    }
  }

  return lines.join("\n");
}
