import type { AdminKpi } from "@/lib/admin/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const KPI_ACCENTS = [
  {
    background: "bg-[radial-gradient(circle_at_18%_0%,rgba(139,211,255,0.18),transparent_38%)]",
    dot: "bg-sky-300",
    value: "text-sky-100",
  },
  {
    background: "bg-[radial-gradient(circle_at_18%_0%,rgba(247,198,106,0.18),transparent_38%)]",
    dot: "bg-amber-300",
    value: "text-amber-100",
  },
  {
    background: "bg-[radial-gradient(circle_at_18%_0%,rgba(199,183,255,0.18),transparent_38%)]",
    dot: "bg-violet-300",
    value: "text-violet-100",
  },
  {
    background: "bg-[radial-gradient(circle_at_18%_0%,rgba(255,159,178,0.16),transparent_38%)]",
    dot: "bg-rose-300",
    value: "text-rose-100",
  },
];

export function KpiCard({ index = 0, kpi }: { index?: number; kpi: AdminKpi }) {
  const accent = KPI_ACCENTS[index % KPI_ACCENTS.length];

  const isTextValue = kpi.valueTone === "text";

  return (
    <Card
      className={cn(
        "min-w-0 border-white/10 bg-white/[0.06] text-white shadow-none",
        accent.background
      )}
    >
      <CardHeader className="gap-1 pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-white/65">
          <span className={cn("size-2 rounded-full", accent.dot)} />
          {kpi.label}
        </CardTitle>
      </CardHeader>
      <CardContent className="min-w-0 space-y-2">
        <div
          className={cn(
            "font-semibold tracking-tight",
            isTextValue ? "break-words text-sm leading-6" : "text-3xl",
            accent.value
          )}
        >
          {kpi.value}
        </div>
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
      {items.map((item, index) => (
        <KpiCard index={index} key={item.label} kpi={item} />
      ))}
    </div>
  );
}
