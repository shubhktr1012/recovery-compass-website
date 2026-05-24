import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { KpiGrid } from "@/components/admin/KpiCard";
import { getAdminUserDetail } from "@/lib/admin/data";
import { formatDateTime } from "@/lib/admin/format";

export const dynamic = "force-dynamic";

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const user = await getAdminUserDetail(userId);

  if (!user) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        description="Full user detail is intentionally limited to this drilldown. Future mutations will require audit logging."
        title={user.profile.displayName}
        withDateRange={false}
      />
      <KpiGrid
        items={[
          { label: "Email", value: user.profile.email ?? "No email" },
          { label: "Programs", value: user.programs.length.toLocaleString("en-IN") },
          { label: "Transactions", value: user.transactions.length.toLocaleString("en-IN") },
          { label: "Onboarded", value: user.profile.onboardingComplete ? "Yes" : "No" },
        ]}
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
          ]}
          data={user.programs.map((program) => ({
            ...program,
            priorityRank: program.priorityRank ?? "Not queued",
            scheduledStartDate: program.scheduledStartDate ?? "Not scheduled",
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
