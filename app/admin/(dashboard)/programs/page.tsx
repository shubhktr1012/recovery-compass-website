import { PageHeader } from "@/components/admin/PageHeader";
import { KpiGrid } from "@/components/admin/KpiCard";
import { DataTable } from "@/components/admin/DataTable";
import { getAdminDateRange, resolveSearchParams } from "@/lib/admin/date-range";
import { getAdminPrograms } from "@/lib/admin/data";
import type { AdminSearchParams } from "@/lib/admin/types";

export const dynamic = "force-dynamic";

export default async function AdminProgramsPage({
  searchParams,
}: {
  searchParams?: Promise<AdminSearchParams>;
}) {
  const params = await resolveSearchParams(searchParams);
  const range = getAdminDateRange(params);
  const data = await getAdminPrograms(range);

  return (
    <div className="space-y-6">
      <PageHeader
        description="Program ownership, active journeys, queued journeys, and average progress."
        range={range}
        title="Programs"
      />
      <KpiGrid items={data.kpis} />
      <DataTable
        columns={[
          { key: "title", label: "Program" },
          { key: "total", label: "Owned" },
          { key: "active", label: "Active" },
          { key: "queued", label: "Queued" },
          { key: "completed", label: "Completed" },
          { key: "averageDay", label: "Avg day" },
          { key: "slug", label: "Technical slug" },
        ]}
        data={data.programs}
      />
    </div>
  );
}
