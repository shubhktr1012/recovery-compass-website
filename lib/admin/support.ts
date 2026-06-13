type SupportProgram = {
  currentDay: number;
  priorityRank: number | null;
  program: string;
  programSlug: string | null;
  programState: string;
  purchaseState: string;
  scheduledStartDate: string | null;
};

type SupportTransaction = {
  amount: string;
  createdAt: string | null;
  fulfillmentStatus: string;
  id: string;
  items: string;
  paymentStatus: string;
  providerOrderId: string | null;
};

type SupportDietOrder = {
  amount: string;
  createdAt: string | null;
  id: string;
  source: string;
  status: string;
};

type BuildSupportSnippetsInput = {
  dietOrders: SupportDietOrder[];
  email: string | null;
  programs: SupportProgram[];
  transactions: SupportTransaction[];
  userId: string;
};

export type SupportSnippet = {
  auditAction: SupportCopyAuditAction;
  body: string;
  description: string;
  label: string;
};

export type SupportCopyAuditAction =
  | "diagnostic_sql_copied"
  | "support_packet_copied"
  | "grant_review_request_copied"
  | "queue_repair_request_copied"
  | "fulfillment_review_copied";

export type SupabaseTableLink = {
  href: string;
  label: string;
  table: string;
};

function sqlLiteral(value: string | null | undefined) {
  if (!value) {
    return "null";
  }

  return `'${value.replaceAll("'", "''")}'`;
}

function formatProgramLines(programs: SupportProgram[]) {
  if (programs.length === 0) {
    return "No owned programs found in admin dashboard.";
  }

  return programs
    .map((program) => {
      const queue = program.priorityRank ? `queue #${program.priorityRank}` : "not queued";
      return `- ${program.program} (${program.programSlug ?? "unknown"}): ${program.programState}, ${program.purchaseState}, day ${program.currentDay}, ${queue}`;
    })
    .join("\n");
}

function formatTransactionLines(transactions: SupportTransaction[]) {
  if (transactions.length === 0) {
    return "No web transactions found in admin dashboard.";
  }

  return transactions
    .map(
      (transaction) =>
        `- ${transaction.id}: ${transaction.amount}, payment=${transaction.paymentStatus}, fulfillment=${transaction.fulfillmentStatus}, order=${transaction.providerOrderId ?? "none"}, items=${transaction.items}`
    )
    .join("\n");
}

function formatDietOrderLines(dietOrders: SupportDietOrder[]) {
  if (dietOrders.length === 0) {
    return "No diet plan orders found for this email in admin dashboard.";
  }

  return dietOrders
    .map(
      (order) =>
        `- ${order.id}: ${order.amount}, status=${order.status}, source=${order.source}, created=${order.createdAt ?? "unknown"}`
    )
    .join("\n");
}

export function getSupabaseProjectRef() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) {
    return null;
  }

  try {
    return new URL(url).hostname.split(".")[0] ?? null;
  } catch {
    return null;
  }
}

export function buildSupabaseTableLinks(projectRef: string | null): SupabaseTableLink[] {
  const tables = [
    "profiles",
    "program_access",
    "user_program_preferences",
    "transactions",
    "diet_plan_orders",
    "outbound_email_deliveries",
    "user_day_states",
    "admin_users",
    "admin_audit_logs",
  ];

  if (!projectRef) {
    return [];
  }

  return tables.map((table) => ({
    href: `https://supabase.com/dashboard/project/${projectRef}/editor/table/${table}`,
    label: table.replaceAll("_", " "),
    table,
  }));
}

export function buildUserSupportSnippets({
  dietOrders,
  email,
  programs,
  transactions,
  userId,
}: BuildSupportSnippetsInput): SupportSnippet[] {
  const diagnosticSql = `-- READ ONLY: user support snapshot
-- Purpose: inspect profile, access, queue, purchases, diet orders, email delivery, and day state.

select id, email, onboarding_complete, recommended_program, created_at, updated_at
from public.profiles
where id = ${sqlLiteral(userId)};

select id, owned_program, purchase_state, completion_state, program_state, current_day,
       priority_rank, scheduled_start_date, started_at, paused_at, completed_at, updated_at
from public.program_access
where user_id = ${sqlLiteral(userId)}
order by priority_rank nulls last, updated_at desc;

select user_id, active_program, queue_reviewed_at, updated_at
from public.user_program_preferences
where user_id = ${sqlLiteral(userId)};

select id, provider, provider_order_id, provider_payment_id, amount, currency,
       payment_status, fulfillment_status, items, created_at, updated_at
from public.transactions
where user_id = ${sqlLiteral(userId)}
order by created_at desc;

select id, email, name, razorpay_order_id, razorpay_payment_id, amount, currency,
       status, source, fulfilled_at, claimed_at, created_at, updated_at
from public.diet_plan_orders
where ${email ? `lower(email) = lower(${sqlLiteral(email)})` : "false"}
order by created_at desc;

select id, email_type, recipient_email, program_slug, status, last_error, sent_at, created_at
from public.outbound_email_deliveries
where user_id = ${sqlLiteral(userId)}
   or ${email ? `lower(recipient_email) = lower(${sqlLiteral(email)})` : "false"}
order by created_at desc;

select program_slug, day_number, day_state, cards_completed, cards_total, finalized_at, updated_at
from public.user_day_states
where user_id = ${sqlLiteral(userId)}
order by program_slug, day_number;`;

  const supportPacket = `Support packet
User ID: ${userId}
Email: ${email ?? "No email"}

Programs:
${formatProgramLines(programs)}

Transactions:
${formatTransactionLines(transactions)}

Diet plan orders:
${formatDietOrderLines(dietOrders)}

Requested next step:
- Describe the exact user issue here.
- Attach payment proof/order ID if relevant.
- Do not change program-purchase payment status manually. Use only audited diet-plan admin actions for manual diet-plan service orders.`;

  const grantRequest = `Requested action: review program grant or entitlement repair
User ID: ${userId}
Email: ${email ?? "No email"}
Program to review/grant: <replace with canonical program slug>
Reason: <paid purchase / team comp / support correction>
Evidence: <transaction ID, Razorpay order ID, RevenueCat evidence, or approval source>

Current programs:
${formatProgramLines(programs)}

Safety checklist before any write:
- Confirm this is the correct user ID and email.
- Confirm payment/approval evidence exists.
- If the user already has an active program, queue the new program instead of creating a second active program.
- Preserve current_day, user_day_states, and queue order unless explicitly repairing them.
- Record the reason and evidence in the audited grant flow.`;

  const queueRequest = `Requested action: review program queue repair
User ID: ${userId}
Email: ${email ?? "No email"}

Current program/queue state:
${formatProgramLines(programs)}

Desired active program: <replace if needed>
Desired queued order:
1. <program slug>
2. <program slug>

Safety checklist before any write:
- Keep exactly one active program.
- Preserve current_day and user_day_states.
- Do not restart already-progressed queued programs.
- Confirm queue_reviewed_at behavior before interrupting the user again.`;

  const fulfillmentRequest = `Requested action: review purchase/diet fulfillment
User ID: ${userId}
Email: ${email ?? "No email"}

Transactions:
${formatTransactionLines(transactions)}

Diet plan orders:
${formatDietOrderLines(dietOrders)}

Safety checklist:
- Do not mark program-purchase payment as paid manually.
- Verify Razorpay/RevenueCat payment truth first.
- For manual diet-plan service orders, use the dedicated audited confirm-payment flow with payment reference and evidence.
- If payment is paid but fulfillment failed, inspect transaction fulfillment_status and outbound_email_deliveries.
- Retry controls must remain role-gated and audited.`;

  return [
    {
      auditAction: "diagnostic_sql_copied",
      body: diagnosticSql,
      description: "Read-only SQL for a full user support snapshot.",
      label: "Copy diagnostic SQL",
    },
    {
      auditAction: "support_packet_copied",
      body: supportPacket,
      description: "Plain-English packet the support team can send to engineering.",
      label: "Copy support packet",
    },
    {
      auditAction: "grant_review_request_copied",
      body: grantRequest,
      description: "Non-executable request template for entitlement/grant review.",
      label: "Copy grant review request",
    },
    {
      auditAction: "queue_repair_request_copied",
      body: queueRequest,
      description: "Non-executable request template for queue/order repairs.",
      label: "Copy queue repair request",
    },
    {
      auditAction: "fulfillment_review_copied",
      body: fulfillmentRequest,
      description: "Non-executable request template for purchase or diet delivery issues.",
      label: "Copy fulfillment review",
    },
  ];
}
