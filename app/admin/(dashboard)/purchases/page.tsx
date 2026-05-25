import { PageHeader } from "@/components/admin/PageHeader";
import { KpiGrid } from "@/components/admin/KpiCard";
import { DataTable } from "@/components/admin/DataTable";
import { getAdminDateRange, resolveSearchParams } from "@/lib/admin/date-range";
import { getAdminPurchases } from "@/lib/admin/data";
import { getAdminAccess } from "@/lib/admin/auth";
import type { AdminSearchParams } from "@/lib/admin/types";

export const dynamic = "force-dynamic";

export default async function AdminPurchasesPage({
  searchParams,
}: {
  searchParams?: Promise<AdminSearchParams>;
}) {
  const params = await resolveSearchParams(searchParams);
  const range = getAdminDateRange(params);
  const access = await getAdminAccess();
  const role = access.ok ? access.admin.role : "viewer";
  const data = await getAdminPurchases(range, role);

  return (
    <div className="space-y-6">
      <PageHeader
        description="Read-only Razorpay transaction and fulfillment status. This dashboard never manually marks payments as paid."
        range={range}
        title="Purchases"
      />
      <KpiGrid items={data.kpis} />
      <DataTable
        columns={[
          { key: "createdAt", label: "Created" },
          { key: "email", label: "User" },
          { key: "amount", label: "Amount" },
          { key: "paymentStatus", label: "Payment" },
          { key: "fulfillmentStatus", label: "Fulfillment" },
          { key: "items", label: "Items" },
          { key: "orderId", label: "Order ID" },
        ]}
        data={data.rows}
        emptyDescription="No transactions exist in the selected range."
      />
    </div>
  );
}
