import { PageHeader } from "@/components/admin/PageHeader";
import { KpiGrid } from "@/components/admin/KpiCard";
import { TrendLineChart, SimpleBarChart } from "@/components/admin/AdminCharts";
import { EmptyState } from "@/components/admin/EmptyState";
import { getAdminDateRange, resolveSearchParams } from "@/lib/admin/date-range";
import { getAdminOverview } from "@/lib/admin/data";
import { formatDateTime } from "@/lib/admin/format";
import type { AdminSearchParams } from "@/lib/admin/types";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage({
  searchParams,
}: {
  searchParams?: Promise<AdminSearchParams>;
}) {
  const params = await resolveSearchParams(searchParams);
  const range = getAdminDateRange(params);
  const data = await getAdminOverview(range);

  return (
    <div className="space-y-6">
      <PageHeader
        description="A plain-English snapshot of user growth, purchases, program activity, and support signals."
        range={range}
        title="Home"
      />
      <KpiGrid items={data.kpis} />
      <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-white/45">
            Growth and completion trend
          </h2>
          <TrendLineChart
            data={data.trend}
            lines={[
              { color: "#8bd3ff", key: "signups", label: "New users" },
              { color: "#f7c66a", key: "purchases", label: "Paid purchases" },
              { color: "#c7b7ff", key: "dayCompletions", label: "Days completed" },
            ]}
          />
        </section>
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-white/45">
            Program ownership
          </h2>
          <SimpleBarChart
            data={data.programCounts.map((program) => ({
              count: program.total,
              label: program.title,
              technical: program.slug,
            }))}
          />
        </section>
      </div>
      <section className="rounded-3xl border border-white/10 bg-white/[0.05] p-5">
        <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-white/45">
          Recent activity
        </h2>
        {data.activity.length === 0 ? (
          <div className="mt-4">
            <EmptyState description="No tracked app activity exists for the selected range." />
          </div>
        ) : (
          <div className="mt-4 divide-y divide-white/10">
            {data.activity.map((item, index) => (
              <div key={item.id} className="flex gap-4 py-3">
                <div
                  className={
                    [
                      "mt-1 size-2 rounded-full bg-sky-300",
                      "mt-1 size-2 rounded-full bg-amber-300",
                      "mt-1 size-2 rounded-full bg-violet-300",
                      "mt-1 size-2 rounded-full bg-rose-300",
                    ][index % 4]
                  }
                />
                <div>
                  <p className="font-medium text-white">{item.label}</p>
                  <p className="mt-1 text-sm text-white/55">{item.detail}</p>
                  <p className="mt-1 font-mono text-xs text-white/35">
                    {formatDateTime(item.occurredAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
