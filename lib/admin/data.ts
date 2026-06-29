import { supabaseAdmin } from "@/lib/supabase-admin";
import { publicPrograms } from "@/lib/public-programs";
import {
  buildDailyBuckets,
  getDayKey,
  type getAdminDateRange,
} from "@/lib/admin/date-range";
import {
  formatDateTime,
  formatEmailForAdminRole,
  formatEventTypeLabel,
  formatInrFromPaise,
  formatProgramName,
} from "@/lib/admin/format";
import type {
  AdminActivityItem,
  AdminDateRange,
  AdminKpi,
  AdminRole,
  AdminTrendPoint,
} from "@/lib/admin/types";
import { isDietPlanGenerationStale } from "@/lib/diet-plan-generation-state";

type SupabaseError = { message: string };
type SupabaseListResult<T> = { data: T[] | null; error: SupabaseError | null };
type SupabaseSingleResult<T> = { data: T | null; error: SupabaseError | null };
type SupabaseLooseListQuery = PromiseLike<{ data: unknown[] | null; error: SupabaseError | null }>;

type ProfileRow = {
  id: string;
  email: string | null;
  display_name: string | null;
  onboarding_complete: boolean | null;
  recommended_program: string | null;
  created_at: string | null;
  updated_at: string | null;
};

type UserEventRow = {
  id: string;
  user_id: string | null;
  event_type: string;
  program_slug: string | null;
  day_number: number | null;
  card_id: string | null;
  event_data: Record<string, unknown> | null;
  occurred_at: string | null;
  created_at: string | null;
};

type ProgramAccessRow = {
  id: string;
  user_id: string;
  owned_program: string | null;
  purchase_state: string | null;
  completion_state: string | null;
  program_state: string | null;
  current_day: number | null;
  priority_rank: number | null;
  started_at: string | null;
  scheduled_start_date: string | null;
  paused_at: string | null;
  completed_at: string | null;
  updated_at: string | null;
  created_at: string | null;
};

type TransactionRow = {
  id: string;
  user_id: string | null;
  provider: string | null;
  provider_order_id: string | null;
  provider_payment_id: string | null;
  amount: number | null;
  currency: string | null;
  payment_status: string | null;
  fulfillment_status: string | null;
  items: Array<{ program_slug?: string; title?: string; queue_rank?: number }> | null;
  created_at: string | null;
  updated_at: string | null;
};

type DietPlanOrderRow = {
  admin_notes: string | null;
  id: string;
  email: string | null;
  name: string | null;
  amount: number | null;
  currency: string | null;
  error_message: string | null;
  manual_created_by: string | null;
  manual_payment_confirmed_at: string | null;
  manual_payment_confirmed_by: string | null;
  manual_payment_link_url: string | null;
  manual_payment_reference: string | null;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  status: string | null;
  source: string | null;
  claimed_at: string | null;
  fulfilled_at: string | null;
  created_at: string | null;
  updated_at: string | null;
};

type EmailDeliveryRow = {
  id: string;
  email_type: string | null;
  dedupe_key: string | null;
  user_id: string | null;
  recipient_email: string | null;
  program_slug: string | null;
  status: string | null;
  last_error: string | null;
  sent_at: string | null;
  created_at: string | null;
  updated_at: string | null;
};

type AdminAuditLogRow = {
  id: string;
  action: string;
  admin_email: string | null;
  admin_role: AdminRole | null;
  target_user_id: string | null;
  target_email: string | null;
  target_program: string | null;
  reason: string | null;
  evidence: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string | null;
};

type UserPreferenceRow = {
  user_id: string;
  active_program: string | null;
  queue_reviewed_at: string | null;
  updated_at: string | null;
};

type UserDayStateRow = {
  id: string;
  program_slug: string | null;
  day_number: number | null;
  day_state: string | null;
  cards_completed: number | null;
  cards_total: number | null;
  finalized_at: string | null;
};

const DIET_PLAN_ORDER_BASE_SELECT =
  "id,email,name,amount,currency,razorpay_order_id,razorpay_payment_id,status,source,claimed_at,fulfilled_at,created_at,updated_at";

const DIET_PLAN_ORDER_ADMIN_SELECT =
  `${DIET_PLAN_ORDER_BASE_SELECT},error_message,manual_payment_link_url,manual_payment_reference,manual_payment_confirmed_at,manual_payment_confirmed_by,manual_created_by,admin_notes`;

async function readList<T>(
  query: PromiseLike<SupabaseListResult<T>>,
  label: string
) {
  const { data, error } = await query;
  if (error) {
    throw new Error(`${label}: ${error.message}`);
  }

  return data ?? [];
}

function isMissingManualDietPlanColumn(error: SupabaseError | null) {
  return Boolean(
    error?.message.includes("diet_plan_orders.manual_") ||
    error?.message.includes("diet_plan_orders.admin_notes") ||
    error?.message.includes("diet_plan_orders.error_message")
  );
}

function withDietPlanOrderDefaults(row: Partial<DietPlanOrderRow>): DietPlanOrderRow {
  return {
    admin_notes: row.admin_notes ?? null,
    amount: row.amount ?? null,
    claimed_at: row.claimed_at ?? null,
    created_at: row.created_at ?? null,
    currency: row.currency ?? null,
    email: row.email ?? null,
    error_message: row.error_message ?? null,
    fulfilled_at: row.fulfilled_at ?? null,
    id: row.id ?? "",
    manual_created_by: row.manual_created_by ?? null,
    manual_payment_confirmed_at: row.manual_payment_confirmed_at ?? null,
    manual_payment_confirmed_by: row.manual_payment_confirmed_by ?? null,
    manual_payment_link_url: row.manual_payment_link_url ?? null,
    manual_payment_reference: row.manual_payment_reference ?? null,
    name: row.name ?? null,
    razorpay_order_id: row.razorpay_order_id ?? null,
    razorpay_payment_id: row.razorpay_payment_id ?? null,
    source: row.source ?? null,
    status: row.status ?? null,
    updated_at: row.updated_at ?? null,
  };
}

async function readDietPlanOrders(
  buildQuery: (select: string) => SupabaseLooseListQuery,
  label: string
) {
  const fullResult = await buildQuery(DIET_PLAN_ORDER_ADMIN_SELECT);
  if (!fullResult.error) {
    return (fullResult.data ?? []).map((row) =>
      withDietPlanOrderDefaults(row as Partial<DietPlanOrderRow>)
    );
  }

  if (!isMissingManualDietPlanColumn(fullResult.error)) {
    throw new Error(`${label}: ${fullResult.error.message}`);
  }

  console.warn("[admin] Manual diet plan columns unavailable; falling back to base order fields", {
    error: fullResult.error.message,
    label,
  });

  const baseResult = await buildQuery(DIET_PLAN_ORDER_BASE_SELECT);
  if (baseResult.error) {
    throw new Error(`${label}: ${baseResult.error.message}`);
  }

  return (baseResult.data ?? []).map((row) =>
    withDietPlanOrderDefaults(row as Partial<DietPlanOrderRow>)
  );
}

async function readSingle<T>(
  query: PromiseLike<SupabaseSingleResult<T>>,
  label: string
) {
  const { data, error } = await query;
  if (error) {
    throw new Error(`${label}: ${error.message}`);
  }

  return data;
}

function createTrend(range: AdminDateRange): AdminTrendPoint[] {
  return Array.from(buildDailyBuckets(range).values()).map((bucket) => ({
    ...bucket,
    dayCompletions: 0,
    events: 0,
    purchases: 0,
    revenue: 0,
    signups: 0,
  }));
}

function addToTrend(
  trend: AdminTrendPoint[],
  dateValue: string | null | undefined,
  key: keyof Pick<
    AdminTrendPoint,
    "dayCompletions" | "events" | "purchases" | "revenue" | "signups"
  >,
  amount = 1
) {
  if (!dateValue) {
    return;
  }

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return;
  }

  const dayKey = getDayKey(date);
  const point = trend.find((item) => item.date === dayKey);
  if (!point) {
    return;
  }

  point[key] = (point[key] ?? 0) + amount;
}

function getProgramCounts(rows: ProgramAccessRow[]) {
  return publicPrograms.map((program) => {
    const programRows = rows.filter((row) => row.owned_program === program.dbSlug);
    const currentDays = programRows
      .map((row) => row.current_day ?? 0)
      .filter((day) => day > 0);
    const averageDay =
      currentDays.length > 0
        ? Math.round(
            currentDays.reduce((total, day) => total + day, 0) / currentDays.length
          )
        : 0;

    return {
      active: programRows.filter((row) => row.program_state === "active").length,
      averageDay,
      completed: programRows.filter((row) => row.completion_state === "completed").length,
      queued: programRows.filter((row) => row.priority_rank !== null).length,
      slug: program.dbSlug,
      title: program.title,
      total: programRows.length,
    };
  });
}

function translateActivity(row: UserEventRow): AdminActivityItem {
  const programLabel = row.program_slug ? formatProgramName(row.program_slug) : null;
  const dayLabel = row.day_number ? `Day ${row.day_number}` : null;
  const detailParts = [programLabel, dayLabel, row.card_id].filter(Boolean);

  return {
    id: row.id,
    detail: detailParts.length > 0 ? detailParts.join(" · ") : "General app activity",
    eventType: row.event_type,
    label: formatEventTypeLabel(row.event_type),
    occurredAt: row.occurred_at ?? row.created_at ?? "",
    programSlug: row.program_slug,
    userId: row.user_id,
  };
}

export async function getAdminOverview(range: AdminDateRange) {
  const [profiles, events, transactions, dietOrders, programAccess] = await Promise.all([
    readList<ProfileRow>(
      supabaseAdmin
        .from("profiles")
        .select("id,email,display_name,onboarding_complete,recommended_program,created_at,updated_at")
        .gte("created_at", range.startIso)
        .lte("created_at", range.endIso)
        .limit(2000),
      "profiles overview"
    ),
    readList<UserEventRow>(
      supabaseAdmin
        .from("user_events")
        .select("id,user_id,event_type,program_slug,day_number,card_id,event_data,occurred_at,created_at")
        .gte("occurred_at", range.startIso)
        .lte("occurred_at", range.endIso)
        .order("occurred_at", { ascending: false })
        .limit(3000),
      "events overview"
    ),
    readList<TransactionRow>(
      supabaseAdmin
        .from("transactions")
        .select("id,user_id,provider,provider_order_id,provider_payment_id,amount,currency,payment_status,fulfillment_status,items,created_at,updated_at")
        .gte("created_at", range.startIso)
        .lte("created_at", range.endIso)
        .order("created_at", { ascending: false })
        .limit(1000),
      "transactions overview"
    ),
    readDietPlanOrders(
      (select) =>
        supabaseAdmin
          .from("diet_plan_orders")
          .select(select)
          .gte("created_at", range.startIso)
          .lte("created_at", range.endIso)
          .order("created_at", { ascending: false })
          .limit(1000),
      "diet plan overview"
    ),
    readList<ProgramAccessRow>(
      supabaseAdmin
        .from("program_access")
        .select("id,user_id,owned_program,purchase_state,completion_state,program_state,current_day,priority_rank,started_at,scheduled_start_date,paused_at,completed_at,updated_at,created_at")
        .limit(5000),
      "program access overview"
    ),
  ]);

  const paidTransactions = transactions.filter(
    (transaction) => transaction.payment_status === "paid"
  );
  const revenuePaise = paidTransactions.reduce(
    (total, transaction) => total + (transaction.amount ?? 0),
    0
  );
  const dayCompletions = events.filter((event) => event.event_type === "day_completed");
  const notificationTaps = events.filter((event) => event.event_type === "notification_tap");
  const activePrograms = programAccess.filter((row) => row.program_state === "active");
  const pendingDietPlans = dietOrders.filter((order) =>
    ["pending", "paid", "processing"].includes(order.status ?? "")
  );

  const trend = createTrend(range);
  profiles.forEach((profile) => addToTrend(trend, profile.created_at, "signups"));
  paidTransactions.forEach((transaction) => {
    addToTrend(trend, transaction.created_at, "purchases");
    addToTrend(trend, transaction.created_at, "revenue", transaction.amount ?? 0);
  });
  dayCompletions.forEach((event) => addToTrend(trend, event.occurred_at, "dayCompletions"));
  events.forEach((event) => addToTrend(trend, event.occurred_at, "events"));

  const kpis: AdminKpi[] = [
    {
      detail: "Profiles created in the selected range.",
      label: "New users",
      technical: "profiles.created_at",
      value: profiles.length.toLocaleString("en-IN"),
    },
    {
      detail: "Users who completed onboarding during account creation window.",
      label: "Onboarding complete",
      technical: "profiles.onboarding_complete",
      value: profiles.filter((profile) => profile.onboarding_complete).length.toLocaleString("en-IN"),
    },
    {
      detail: "Paid web transactions in the selected range.",
      label: "Program revenue",
      technical: "transactions.payment_status = paid",
      value: formatInrFromPaise(revenuePaise),
    },
    {
      detail: "Programs currently marked active across all users.",
      label: "Active journeys",
      technical: "program_access.program_state",
      value: activePrograms.length.toLocaleString("en-IN"),
    },
    {
      detail: "Completed program days captured by app analytics.",
      label: "Days completed",
      technical: "user_events.event_type = day_completed",
      value: dayCompletions.length.toLocaleString("en-IN"),
    },
    {
      detail: "Diet plan orders still needing delivery or follow-up.",
      label: "Pending diet plans",
      technical: "diet_plan_orders.status",
      value: pendingDietPlans.length.toLocaleString("en-IN"),
    },
  ];

  return {
    activity: events.slice(0, 10).map(translateActivity),
    kpis,
    programCounts: getProgramCounts(programAccess),
    range,
    trend,
    totals: {
      dietOrders: dietOrders.length,
      notificationTaps: notificationTaps.length,
      paidTransactions: paidTransactions.length,
      revenuePaise,
    },
  };
}

async function getProfilesByIds(userIds: string[]) {
  if (userIds.length === 0) {
    return new Map<string, ProfileRow>();
  }

  const rows = await readList<ProfileRow>(
    supabaseAdmin
      .from("profiles")
      .select("id,email,display_name,onboarding_complete,recommended_program,created_at,updated_at")
      .in("id", userIds),
    "profiles by ids"
  );

  return new Map(rows.map((row) => [row.id, row]));
}

export async function searchAdminUsers(query: string, role: AdminRole = "viewer") {
  const trimmedQuery = query.trim();
  let profiles: ProfileRow[] = [];

  if (!trimmedQuery) {
    profiles = await readList<ProfileRow>(
      supabaseAdmin
        .from("profiles")
        .select("id,email,display_name,onboarding_complete,recommended_program,created_at,updated_at")
        .order("updated_at", { ascending: false })
        .limit(25),
      "recent users"
    );
  } else if (/^[0-9a-f-]{32,36}$/i.test(trimmedQuery)) {
    const profile = await readSingle<ProfileRow>(
      supabaseAdmin
        .from("profiles")
        .select("id,email,display_name,onboarding_complete,recommended_program,created_at,updated_at")
        .eq("id", trimmedQuery)
        .maybeSingle(),
      "user id search"
    );
    profiles = profile ? [profile] : [];
  } else {
    const safeQuery = trimmedQuery.replaceAll("%", "").replaceAll(",", "");
    const [emailRows, nameRows] = await Promise.all([
      readList<ProfileRow>(
        supabaseAdmin
          .from("profiles")
          .select("id,email,display_name,onboarding_complete,recommended_program,created_at,updated_at")
          .ilike("email", `%${safeQuery}%`)
          .limit(20),
        "user email search"
      ),
      readList<ProfileRow>(
        supabaseAdmin
          .from("profiles")
          .select("id,email,display_name,onboarding_complete,recommended_program,created_at,updated_at")
          .ilike("display_name", `%${safeQuery}%`)
          .limit(20),
        "user name search"
      ),
    ]);
    profiles = Array.from(
      new Map([...emailRows, ...nameRows].map((profile) => [profile.id, profile])).values()
    ).slice(0, 25);
  }

  const userIds = profiles.map((profile) => profile.id);
  const accessRows =
    userIds.length > 0
      ? await readList<ProgramAccessRow>(
          supabaseAdmin
            .from("program_access")
            .select("id,user_id,owned_program,purchase_state,completion_state,program_state,current_day,priority_rank,started_at,scheduled_start_date,paused_at,completed_at,updated_at,created_at")
            .in("user_id", userIds),
          "user search program access"
        )
      : [];

  return profiles.map((profile) => {
    const userPrograms = accessRows.filter((row) => row.user_id === profile.id);

    return {
      createdAt: profile.created_at,
      displayName: profile.display_name ?? "Unnamed user",
      email: formatEmailForAdminRole(profile.email, role),
      id: profile.id,
      lastSeen: profile.updated_at,
      onboardingComplete: Boolean(profile.onboarding_complete),
      programCount: userPrograms.length,
      recommendedProgram: formatProgramName(profile.recommended_program),
    };
  });
}

export async function getAdminUserDetail(userId: string, role: AdminRole = "viewer") {
  const [profile, accessRows, events, transactions, dietOrders, emails, dayStates, preference] =
    await Promise.all([
      readSingle<ProfileRow>(
        supabaseAdmin
          .from("profiles")
          .select("id,email,display_name,onboarding_complete,recommended_program,created_at,updated_at")
          .eq("id", userId)
          .maybeSingle(),
        "user detail profile"
      ),
      readList<ProgramAccessRow>(
        supabaseAdmin
          .from("program_access")
          .select("id,user_id,owned_program,purchase_state,completion_state,program_state,current_day,priority_rank,started_at,scheduled_start_date,paused_at,completed_at,updated_at,created_at")
          .eq("user_id", userId)
          .order("priority_rank", { ascending: true, nullsFirst: false }),
        "user detail programs"
      ),
      readList<UserEventRow>(
        supabaseAdmin
          .from("user_events")
          .select("id,user_id,event_type,program_slug,day_number,card_id,event_data,occurred_at,created_at")
          .eq("user_id", userId)
          .order("occurred_at", { ascending: false })
          .limit(50),
        "user detail events"
      ),
      readList<TransactionRow>(
        supabaseAdmin
          .from("transactions")
          .select("id,user_id,provider,provider_order_id,provider_payment_id,amount,currency,payment_status,fulfillment_status,items,created_at,updated_at")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(50),
        "user detail transactions"
      ),
      readDietPlanOrders(
        (select) =>
          supabaseAdmin
            .from("diet_plan_orders")
            .select(select)
            .order("created_at", { ascending: false })
            .limit(50),
        "user detail diet plans"
      ),
      readList<EmailDeliveryRow>(
        supabaseAdmin
          .from("outbound_email_deliveries")
          .select("id,email_type,dedupe_key,user_id,recipient_email,program_slug,status,last_error,sent_at,created_at,updated_at")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(50),
        "user detail emails"
      ),
      readList<UserDayStateRow>(
        supabaseAdmin
          .from("user_day_states")
          .select("id,program_slug,day_number,day_state,cards_completed,cards_total,finalized_at")
          .eq("user_id", userId)
          .order("day_number", { ascending: false })
          .limit(50),
        "user detail day states"
      ),
      readSingle<UserPreferenceRow>(
        supabaseAdmin
          .from("user_program_preferences")
          .select("user_id,active_program,queue_reviewed_at,updated_at")
          .eq("user_id", userId)
          .maybeSingle(),
        "user detail preference"
      ),
    ]);

  if (!profile) {
    return null;
  }

  const matchingDietOrders = dietOrders.filter(
    (order) => order.email && profile.email && order.email.toLowerCase() === profile.email.toLowerCase()
  );

  return {
    activity: events.map(translateActivity),
    dayStates: dayStates.map((row) => ({
      cards: `${row.cards_completed ?? 0}/${row.cards_total ?? 0}`,
      day: row.day_number ?? 0,
      finalizedAt: row.finalized_at,
      program: formatProgramName(row.program_slug),
      state: row.day_state ?? "unknown",
    })),
    dietOrders: matchingDietOrders.map((order) => ({
      adminNotes: order.admin_notes,
      amount: formatInrFromPaise(order.amount),
      canConfirmPayment: order.source === "admin_manual" && ["awaiting_payment", "failed"].includes(order.status ?? ""),
      canGenerate:
        ["pending", "failed"].includes(order.status ?? "") &&
        (order.source !== "admin_manual" || Boolean(order.manual_payment_confirmed_at)),
      createdAt: order.created_at,
      errorMessage: order.error_message,
      id: order.id,
      paymentConfirmedAt: order.manual_payment_confirmed_at,
      paymentLinkUrl: order.manual_payment_link_url,
      paymentReference: order.manual_payment_reference,
      source: order.source ?? "standalone",
      status: order.status ?? "unknown",
    })),
    emails: emails.map((email) => ({
      createdAt: email.created_at,
      emailType: email.email_type ?? "unknown",
      id: email.id,
      lastError: email.last_error,
      sentAt: email.sent_at,
      status: email.status ?? "unknown",
    })),
    profile: {
      createdAt: profile.created_at,
      displayName: profile.display_name ?? "Unnamed user",
      email: formatEmailForAdminRole(profile.email, role),
      id: profile.id,
      onboardingComplete: Boolean(profile.onboarding_complete),
      recommendedProgram: formatProgramName(profile.recommended_program),
      updatedAt: profile.updated_at,
    },
    programs: accessRows.map((row) => ({
      completedAt: row.completed_at,
      currentDay: row.current_day ?? 0,
      id: row.id,
      priorityRank: row.priority_rank,
      program: formatProgramName(row.owned_program),
      programSlug: row.owned_program,
      programState: row.program_state ?? "unknown",
      purchaseState: row.purchase_state ?? "unknown",
      pausedAt: row.paused_at,
      scheduledStartDate: row.scheduled_start_date,
      startedAt: row.started_at,
    })),
    transactions: transactions.map((transaction) => ({
      amount: formatInrFromPaise(transaction.amount),
      createdAt: transaction.created_at,
      fulfillmentStatus: transaction.fulfillment_status ?? "unknown",
      id: transaction.id,
      items:
        transaction.items
          ?.map((item) => item.title ?? formatProgramName(item.program_slug))
          .join(", ") ?? "Unknown items",
      paymentStatus: transaction.payment_status ?? "unknown",
      providerOrderId: transaction.provider_order_id,
    })),
    preference: preference
      ? {
          activeProgram: formatProgramName(preference.active_program),
          queueReviewedAt: preference.queue_reviewed_at,
          updatedAt: preference.updated_at,
        }
      : null,
  };
}

export async function getAdminPrograms(range: AdminDateRange) {
  const accessRows = await readList<ProgramAccessRow>(
    supabaseAdmin
      .from("program_access")
      .select("id,user_id,owned_program,purchase_state,completion_state,program_state,current_day,priority_rank,started_at,scheduled_start_date,paused_at,completed_at,updated_at,created_at")
      .limit(5000),
    "admin programs"
  );

  const recentlyStarted = accessRows.filter((row) => {
    if (!row.started_at) {
      return false;
    }
    const time = new Date(row.started_at).getTime();
    return time >= range.start.getTime() && time <= range.end.getTime();
  });

  return {
    kpis: [
      { label: "Owned program rows", value: accessRows.length.toLocaleString("en-IN") },
      { label: "Active journeys", value: accessRows.filter((row) => row.program_state === "active").length.toLocaleString("en-IN") },
      { label: "Queued journeys", value: accessRows.filter((row) => row.priority_rank !== null).length.toLocaleString("en-IN") },
      { label: "Started in range", value: recentlyStarted.length.toLocaleString("en-IN") },
    ] satisfies AdminKpi[],
    programs: getProgramCounts(accessRows),
    range,
  };
}

export async function getAdminPurchases(range: AdminDateRange, role: AdminRole = "viewer") {
  const transactions = await readList<TransactionRow>(
    supabaseAdmin
      .from("transactions")
      .select("id,user_id,provider,provider_order_id,provider_payment_id,amount,currency,payment_status,fulfillment_status,items,created_at,updated_at")
      .gte("created_at", range.startIso)
      .lte("created_at", range.endIso)
      .order("created_at", { ascending: false })
      .limit(1000),
    "admin purchases"
  );
  const profileById = await getProfilesByIds(
    Array.from(new Set(transactions.map((row) => row.user_id).filter((id): id is string => Boolean(id))))
  );
  const paidTransactions = transactions.filter((transaction) => transaction.payment_status === "paid");
  const revenuePaise = paidTransactions.reduce((total, row) => total + (row.amount ?? 0), 0);

  return {
    kpis: [
      { label: "Paid orders", value: paidTransactions.length.toLocaleString("en-IN") },
      { label: "Revenue", value: formatInrFromPaise(revenuePaise) },
      { label: "Pending fulfillment", value: transactions.filter((row) => row.fulfillment_status === "pending").length.toLocaleString("en-IN") },
      { label: "Failed payments", value: transactions.filter((row) => row.payment_status === "failed").length.toLocaleString("en-IN") },
    ] satisfies AdminKpi[],
    rows: transactions.map((transaction) => {
      const profile = transaction.user_id ? profileById.get(transaction.user_id) : null;
      return {
        amount: formatInrFromPaise(transaction.amount),
        createdAt: formatDateTime(transaction.created_at),
        email: formatEmailForAdminRole(profile?.email, role),
        fulfillmentStatus: transaction.fulfillment_status ?? "unknown",
        id: transaction.id,
        items:
          transaction.items
            ?.map((item) => item.title ?? formatProgramName(item.program_slug))
            .join(", ") ?? "Unknown items",
        orderId: transaction.provider_order_id ?? "No order ID",
        paymentStatus: transaction.payment_status ?? "unknown",
      };
    }),
  };
}

export async function getAdminDietPlans(range: AdminDateRange, role: AdminRole = "viewer") {
  const [orders, emails] = await Promise.all([
    readDietPlanOrders(
      (select) =>
        supabaseAdmin
          .from("diet_plan_orders")
          .select(select)
          .gte("created_at", range.startIso)
          .lte("created_at", range.endIso)
          .order("created_at", { ascending: false })
          .limit(1000),
      "admin diet orders"
    ),
    readList<EmailDeliveryRow>(
      supabaseAdmin
        .from("outbound_email_deliveries")
        .select("id,email_type,dedupe_key,user_id,recipient_email,program_slug,status,last_error,sent_at,created_at,updated_at")
        .gte("created_at", range.startIso)
        .lte("created_at", range.endIso)
        .order("created_at", { ascending: false })
        .limit(1000),
      "admin diet emails"
    ),
  ]);

  const dietEmails = emails.filter((email) => email.email_type?.includes("diet"));

  return {
    kpis: [
      { label: "Diet plan orders", value: orders.length.toLocaleString("en-IN") },
      { label: "Waiting for payment", value: orders.filter((order) => order.status === "awaiting_payment").length.toLocaleString("en-IN") },
      { label: "Ready or generating", value: orders.filter((order) => ["pending", "generating"].includes(order.status ?? "")).length.toLocaleString("en-IN") },
      { label: "Generated / scheduled", value: orders.filter((order) => order.status === "fulfilled").length.toLocaleString("en-IN") },
      { label: "Failed", value: orders.filter((order) => order.status === "failed").length.toLocaleString("en-IN") },
      { label: "Email issues", value: dietEmails.filter((email) => email.status === "failed").length.toLocaleString("en-IN") },
    ] satisfies AdminKpi[],
    rows: orders.map((order) => ({
      adminNotes: order.admin_notes,
      amount: formatInrFromPaise(order.amount),
      canConfirmPayment: order.source === "admin_manual" && ["awaiting_payment", "failed"].includes(order.status ?? ""),
      canGenerate:
        (["pending", "failed"].includes(order.status ?? "") ||
          isDietPlanGenerationStale({
            claimedAt: order.claimed_at,
            status: order.status,
            updatedAt: order.updated_at,
          })) &&
        (order.source !== "admin_manual" || Boolean(order.manual_payment_confirmed_at)),
      createdAt: formatDateTime(order.created_at),
      email: formatEmailForAdminRole(order.email, role),
      errorMessage: order.error_message,
      fulfilledAt: order.fulfilled_at ? formatDateTime(order.fulfilled_at) : "Not generated yet",
      id: order.id,
      manualCreatedBy: order.manual_created_by,
      name: order.name ?? "No name",
      paymentConfirmedAt: order.manual_payment_confirmed_at
        ? formatDateTime(order.manual_payment_confirmed_at)
        : null,
      paymentConfirmedBy: order.manual_payment_confirmed_by,
      paymentLinkUrl: order.manual_payment_link_url,
      paymentReference: order.manual_payment_reference,
      razorpayOrderId: order.razorpay_order_id,
      razorpayPaymentId: order.razorpay_payment_id,
      source: order.source ?? "standalone",
      status: order.status ?? "unknown",
    })),
  };
}

export async function getAdminEngagement(range: AdminDateRange) {
  const events = await readList<UserEventRow>(
    supabaseAdmin
      .from("user_events")
      .select("id,user_id,event_type,program_slug,day_number,card_id,event_data,occurred_at,created_at")
      .gte("occurred_at", range.startIso)
      .lte("occurred_at", range.endIso)
      .order("occurred_at", { ascending: false })
      .limit(5000),
    "admin engagement"
  );
  const trend = createTrend(range);
  events.forEach((event) => addToTrend(trend, event.occurred_at, "events"));
  events
    .filter((event) => event.event_type === "day_completed")
    .forEach((event) => addToTrend(trend, event.occurred_at, "dayCompletions"));

  const byEventType = Array.from(
    events.reduce((map, event) => {
      map.set(event.event_type, (map.get(event.event_type) ?? 0) + 1);
      return map;
    }, new Map<string, number>())
  )
    .map(([eventType, count]) => ({
      count,
      label: formatEventTypeLabel(eventType),
      technical: eventType,
    }))
    .sort((a, b) => b.count - a.count);

  const byProgram = Array.from(
    events.reduce((map, event) => {
      const key = event.program_slug ?? "unknown";
      map.set(key, (map.get(key) ?? 0) + 1);
      return map;
    }, new Map<string, number>())
  )
    .map(([programSlug, count]) => ({
      count,
      label: formatProgramName(programSlug),
      technical: programSlug,
    }))
    .sort((a, b) => b.count - a.count);

  return {
    byEventType,
    byProgram,
    kpis: [
      { label: "Tracked actions", value: events.length.toLocaleString("en-IN") },
      { label: "Day completions", value: events.filter((event) => event.event_type === "day_completed").length.toLocaleString("en-IN") },
      { label: "Cards completed", value: events.filter((event) => event.event_type === "card_completed").length.toLocaleString("en-IN") },
      { label: "Notification opens", value: events.filter((event) => event.event_type === "notification_tap").length.toLocaleString("en-IN") },
    ] satisfies AdminKpi[],
    trend,
  };
}

export async function getAdminActivity(range: AdminDateRange, role: AdminRole = "viewer") {
  const [events, auditLogs] = await Promise.all([
    readList<UserEventRow>(
      supabaseAdmin
        .from("user_events")
        .select("id,user_id,event_type,program_slug,day_number,card_id,event_data,occurred_at,created_at")
        .gte("occurred_at", range.startIso)
        .lte("occurred_at", range.endIso)
        .order("occurred_at", { ascending: false })
        .limit(200),
      "admin activity"
    ),
    readList<AdminAuditLogRow>(
      supabaseAdmin
        .from("admin_audit_logs")
        .select("id,action,admin_email,admin_role,target_user_id,target_email,target_program,reason,evidence,metadata,created_at")
        .gte("created_at", range.startIso)
        .lte("created_at", range.endIso)
        .order("created_at", { ascending: false })
        .limit(200),
      "admin audit logs"
    ),
  ]);

  return {
    activity: events.map(translateActivity),
    auditLogs: auditLogs.map((log) => ({
      action: formatEventTypeLabel(log.action),
      actor: formatEmailForAdminRole(log.admin_email, role),
      createdAt: log.created_at,
      evidence: log.evidence ?? "No evidence",
      id: log.id,
      reason: log.reason ?? "No reason",
      role: log.admin_role ?? "unknown",
      target: log.target_email
        ? formatEmailForAdminRole(log.target_email, role)
        : log.target_user_id ?? "No target",
      targetProgram: formatProgramName(log.target_program),
      targetUserId: log.target_user_id ?? "No user ID",
      technicalAction: log.action,
    })),
    kpis: [
      { label: "Activity rows", value: events.length.toLocaleString("en-IN") },
      { label: "Unique users", value: new Set(events.map((event) => event.user_id).filter(Boolean)).size.toLocaleString("en-IN") },
      { label: "Program events", value: events.filter((event) => event.program_slug).length.toLocaleString("en-IN") },
      { label: "Admin audit rows", value: auditLogs.length.toLocaleString("en-IN") },
    ] satisfies AdminKpi[],
  };
}

export type AdminDateRangeGetter = typeof getAdminDateRange;
