import { PageHeader } from "@/components/admin/PageHeader";
import { KpiGrid } from "@/components/admin/KpiCard";
import { DataTable } from "@/components/admin/DataTable";
import { getAdminDateRange, resolveSearchParams } from "@/lib/admin/date-range";
import { getAdminActivity } from "@/lib/admin/data";
import { formatDateTime } from "@/lib/admin/format";
import { getAdminAccess } from "@/lib/admin/auth";
import type { AdminSearchParams } from "@/lib/admin/types";

export const dynamic = "force-dynamic";

export default async function AdminActivityPage({
  searchParams,
}: {
  searchParams?: Promise<AdminSearchParams>;
}) {
  const params = await resolveSearchParams(searchParams);
  const range = getAdminDateRange(params);
  const access = await getAdminAccess();
  const role = access.ok ? access.admin.role : "viewer";
  const data = await getAdminActivity(range, role);

  return (
    <div className="space-y-6">
      <PageHeader
        description="Recent app events and audited admin support actions rendered in plain English."
        range={range}
        title="Admin Activity"
      />
      <KpiGrid items={data.kpis} />
      <DataTable
        columns={[
          { key: "occurredAt", label: "When" },
          { key: "label", label: "Activity" },
          { key: "detail", label: "Detail" },
          { key: "eventType", label: "Technical event" },
          { key: "userId", label: "User ID" },
        ]}
        data={data.activity.map((item) => ({
          ...item,
          occurredAt: formatDateTime(item.occurredAt),
          userId: item.userId ?? "Unknown user",
        }))}
      />
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-white/45">
          Admin audit log
        </h2>
        <DataTable
          columns={[
            { key: "createdAt", label: "When" },
            { key: "actor", label: "Admin" },
            { key: "action", label: "Action" },
            { key: "target", label: "Target" },
            { key: "targetProgram", label: "Program" },
            { key: "reason", label: "Reason" },
            { key: "technicalAction", label: "Technical action" },
          ]}
          data={data.auditLogs.map((item) => ({
            ...item,
            createdAt: formatDateTime(item.createdAt),
          }))}
          emptyDescription="No audited admin actions exist in the selected range."
        />
      </section>
    </div>
  );
}
