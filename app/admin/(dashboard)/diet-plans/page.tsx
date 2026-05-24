import { PageHeader } from "@/components/admin/PageHeader";
import { KpiGrid } from "@/components/admin/KpiCard";
import { DataTable } from "@/components/admin/DataTable";
import { getAdminDateRange, resolveSearchParams } from "@/lib/admin/date-range";
import { getAdminDietPlans } from "@/lib/admin/data";
import type { AdminSearchParams } from "@/lib/admin/types";

export const dynamic = "force-dynamic";

export default async function AdminDietPlansPage({
  searchParams,
}: {
  searchParams?: Promise<AdminSearchParams>;
}) {
  const params = await resolveSearchParams(searchParams);
  const range = getAdminDateRange(params);
  const data = await getAdminDietPlans(range);

  return (
    <div className="space-y-6">
      <PageHeader
        description="Diet plan order, delivery, and email status. Manual retries are intentionally parked for Phase 2."
        range={range}
        title="Diet Plans"
      />
      <KpiGrid items={data.kpis} />
      <DataTable
        columns={[
          { key: "createdAt", label: "Created" },
          { key: "email", label: "Email" },
          { key: "name", label: "Name" },
          { key: "amount", label: "Amount" },
          { key: "status", label: "Status" },
          { key: "source", label: "Source" },
          { key: "fulfilledAt", label: "Delivered" },
        ]}
        data={data.rows}
        emptyDescription="No diet plan orders exist in the selected range."
      />
    </div>
  );
}
