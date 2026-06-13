import { PageHeader } from "@/components/admin/PageHeader";
import { KpiGrid } from "@/components/admin/KpiCard";
import { DietPlanOpsPanel } from "@/components/admin/DietPlanOpsPanel";
import { getAdminDateRange, resolveSearchParams } from "@/lib/admin/date-range";
import { getAdminDietPlans } from "@/lib/admin/data";
import { getAdminAccess, canManageDietPlans } from "@/lib/admin/auth";
import type { AdminSearchParams } from "@/lib/admin/types";

export const dynamic = "force-dynamic";

export default async function AdminDietPlansPage({
  searchParams,
}: {
  searchParams?: Promise<AdminSearchParams>;
}) {
  const params = await resolveSearchParams(searchParams);
  const range = getAdminDateRange(params);
  const access = await getAdminAccess();
  const role = access.ok ? access.admin.role : "viewer";
  const canManage = access.ok ? canManageDietPlans(access.admin) : false;
  const data = await getAdminDietPlans(range, role);

  return (
    <div className="space-y-6">
      <PageHeader
        description="Diet plan order, payment, generation, and scheduled email status. Manual service orders must use the audited admin flow."
        range={range}
        title="Diet Plans"
      />
      <KpiGrid items={data.kpis} />
      <DietPlanOpsPanel canManage={canManage} rows={data.rows} />
    </div>
  );
}
