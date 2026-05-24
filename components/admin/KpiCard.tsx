import type { AdminKpi } from "@/lib/admin/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function KpiCard({ kpi }: { kpi: AdminKpi }) {
  return (
    <Card className="border-white/10 bg-white/[0.06] text-white shadow-none">
      <CardHeader className="gap-1 pb-2">
        <CardTitle className="text-sm font-medium text-white/65">{kpi.label}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-3xl font-semibold tracking-tight">{kpi.value}</div>
        {kpi.detail ? (
          <p className="text-xs leading-5 text-white/50">{kpi.detail}</p>
        ) : null}
        {kpi.technical ? (
          <p className="rounded-full bg-white/[0.07] px-2 py-1 font-mono text-[10px] text-white/45">
            {kpi.technical}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function KpiGrid({ items }: { items: AdminKpi[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <KpiCard key={item.label} kpi={item} />
      ))}
    </div>
  );
}
