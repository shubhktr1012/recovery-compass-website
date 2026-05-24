import { PageHeader } from "@/components/admin/PageHeader";
import { KpiGrid } from "@/components/admin/KpiCard";
import { SimpleBarChart, TrendLineChart } from "@/components/admin/AdminCharts";
import { getAdminDateRange, resolveSearchParams } from "@/lib/admin/date-range";
import { getAdminEngagement } from "@/lib/admin/data";
import type { AdminSearchParams } from "@/lib/admin/types";

export const dynamic = "force-dynamic";

export default async function AdminEngagementPage({
  searchParams,
}: {
  searchParams?: Promise<AdminSearchParams>;
}) {
  const params = await resolveSearchParams(searchParams);
  const range = getAdminDateRange(params);
  const data = await getAdminEngagement(range);

  return (
    <div className="space-y-6">
      <PageHeader
        description="App analytics translated into non-technical labels, with event names available for debugging."
        range={range}
        title="Engagement"
      />
      <KpiGrid items={data.kpis} />
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-white/45">
          Daily engagement
        </h2>
        <TrendLineChart
          data={data.trend}
          lines={[
            { color: "#b7e7c0", key: "events", label: "Tracked actions" },
            { color: "#ffffff", key: "dayCompletions", label: "Days completed" },
          ]}
        />
      </section>
      <div className="grid gap-4 xl:grid-cols-2">
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-white/45">
            Activity type
          </h2>
          <SimpleBarChart data={data.byEventType} />
        </section>
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-white/45">
            Program activity
          </h2>
          <SimpleBarChart data={data.byProgram} />
        </section>
      </div>
    </div>
  );
}
