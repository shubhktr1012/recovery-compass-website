import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { KpiGrid } from "@/components/admin/KpiCard";
import { ProgramGrantPanel } from "@/components/admin/ProgramGrantPanel";
import { SupportWorkflowPanel } from "@/components/admin/SupportWorkflowPanel";
import { UserAiSummaryPanel } from "@/components/admin/UserAiSummaryPanel";
import { getAdminUserDetail } from "@/lib/admin/data";
import { formatDateTime } from "@/lib/admin/format";
import { canGrantPrograms, getAdminAccess } from "@/lib/admin/auth";
import { recordAdminAuditLog } from "@/lib/admin/audit";
import {
  buildSupabaseTableLinks,
  buildUserSupportSnippets,
  getSupabaseProjectRef,
} from "@/lib/admin/support";

export const dynamic = "force-dynamic";

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const access = await getAdminAccess();
  const admin = access.ok ? access.admin : null;
  const user = await getAdminUserDetail(userId, admin?.role ?? "viewer");

  if (!user) {
    notFound();
  }

  if (admin) {
    await recordAdminAuditLog({
      action: "user_detail_viewed",
      admin,
      metadata: { source: "admin_dashboard" },
      targetEmail: user.profile.email,
      targetUserId: user.profile.id,
    });
  }

  const supportSnippets = buildUserSupportSnippets({
    dietOrders: user.dietOrders,
    email: user.profile.email,
    programs: user.programs,
    transactions: user.transactions,
    userId: user.profile.id,
  });
  const tableLinks = buildSupabaseTableLinks(getSupabaseProjectRef());

  return (
    <div className="space-y-6">
      <PageHeader
        description="Full user detail is limited to this drilldown. Owner and ops can make audited program grants; viewers remain read-only."
        title={user.profile.displayName}
        withDateRange={false}
      />
      <KpiGrid
        items={[
          { label: "Email", value: user.profile.email ?? "No email" },
          { label: "Programs", value: user.programs.length.toLocaleString("en-IN") },
          { label: "Transactions", value: user.transactions.length.toLocaleString("en-IN") },
          { label: "Onboarded", value: user.profile.onboardingComplete ? "Yes" : "No" },
          { label: "Active preference", value: user.preference?.activeProgram ?? "Not set" },
          {
            label: "Queue reviewed",
            value: user.preference?.queueReviewedAt
              ? formatDateTime(user.preference.queueReviewedAt)
              : "Not reviewed",
          },
        ]}
      />
      <UserAiSummaryPanel userId={user.profile.id} />
      <SupportWorkflowPanel
        snippets={supportSnippets}
        tableLinks={tableLinks}
        targetEmail={user.profile.email}
        targetUserId={user.profile.id}
      />
      <ProgramGrantPanel
        canGrant={admin ? canGrantPrograms(admin) : false}
        programs={user.programs}
        userId={user.profile.id}
      />

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-white/45">
          Programs
        </h2>
        <DataTable
          columns={[
            { key: "program", label: "Program" },
            { key: "currentDay", label: "Day" },
            { key: "programState", label: "State" },
            { key: "priorityRank", label: "Queue" },
            { key: "scheduledStartDate", label: "Scheduled" },
            { key: "startedAt", label: "Started" },
            { key: "completedAt", label: "Completed" },
          ]}
          data={user.programs.map((program) => ({
            ...program,
            completedAt: program.completedAt ? formatDateTime(program.completedAt) : "Not completed",
            priorityRank: program.priorityRank ?? "Not queued",
            scheduledStartDate: program.scheduledStartDate ?? "Not scheduled",
            startedAt: program.startedAt ? formatDateTime(program.startedAt) : "Not started",
          }))}
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-white/45">
          Payments
        </h2>
        <DataTable
          columns={[
            { key: "amount", label: "Amount" },
            { key: "paymentStatus", label: "Payment" },
            { key: "fulfillmentStatus", label: "Fulfillment" },
            { key: "items", label: "Items" },
            { key: "createdAt", label: "Created" },
          ]}
          data={user.transactions.map((transaction) => ({
            ...transaction,
            createdAt: formatDateTime(transaction.createdAt),
          }))}
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-white/45">
          Diet plan orders
        </h2>
        <DataTable
          columns={[
            { key: "createdAt", label: "Created" },
            { key: "amount", label: "Amount" },
            { key: "status", label: "Status" },
            { key: "source", label: "Source" },
            { key: "id", label: "Order ID" },
          ]}
          data={user.dietOrders.map((order) => ({
            ...order,
            createdAt: formatDateTime(order.createdAt),
          }))}
          emptyDescription="No diet plan orders match this user's email."
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-white/45">
          Email delivery
        </h2>
        <DataTable
          columns={[
            { key: "createdAt", label: "Created" },
            { key: "emailType", label: "Email type" },
            { key: "status", label: "Status" },
            { key: "sentAt", label: "Sent" },
            { key: "lastError", label: "Last error" },
          ]}
          data={user.emails.map((email) => ({
            ...email,
            createdAt: formatDateTime(email.createdAt),
            lastError: email.lastError ?? "No error",
            sentAt: email.sentAt ? formatDateTime(email.sentAt) : "Not sent",
          }))}
          emptyDescription="No outbound email rows exist for this user."
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-white/45">
          Recent day states
        </h2>
        <DataTable
          columns={[
            { key: "program", label: "Program" },
            { key: "day", label: "Day" },
            { key: "state", label: "State" },
            { key: "cards", label: "Cards" },
            { key: "finalizedAt", label: "Finalized" },
          ]}
          data={user.dayStates.map((dayState) => ({
            ...dayState,
            finalizedAt: dayState.finalizedAt
              ? formatDateTime(dayState.finalizedAt)
              : "Not finalized",
          }))}
          emptyDescription="No day-state rows exist for this user."
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-white/45">
          Recent activity
        </h2>
        <DataTable
          columns={[
            { key: "label", label: "Activity" },
            { key: "detail", label: "Detail" },
            { key: "eventType", label: "Technical event" },
            { key: "occurredAt", label: "When" },
          ]}
          data={user.activity.map((item) => ({
            ...item,
            occurredAt: formatDateTime(item.occurredAt),
          }))}
        />
      </section>
    </div>
  );
}
