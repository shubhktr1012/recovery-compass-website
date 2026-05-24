import { PageHeader } from "@/components/admin/PageHeader";
import { KpiGrid } from "@/components/admin/KpiCard";
import { DataTable } from "@/components/admin/DataTable";
import { getAdminDateRange, resolveSearchParams } from "@/lib/admin/date-range";
import { getAdminActivity } from "@/lib/admin/data";
import { formatDateTime } from "@/lib/admin/format";
import type { AdminSearchParams } from "@/lib/admin/types";

export const dynamic = "force-dynamic";

export default async function AdminActivityPage({
  searchParams,
}: {
  searchParams?: Promise<AdminSearchParams>;
}) {
  const params = await resolveSearchParams(searchParams);
  const range = getAdminDateRange(params);
  const data = await getAdminActivity(range);

  return (
    <div className="space-y-6">
      <PageHeader
        description="Recent app events rendered in plain English. True admin mutation audit logs are parked until the admin_users migration."
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
    </div>
  );
}
