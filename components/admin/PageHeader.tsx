import type { ReactNode } from "react";
import { DateRangeControls } from "@/components/admin/DateRangeControls";
import type { AdminDateRange } from "@/lib/admin/types";

export function PageHeader({
  description,
  meta,
  range,
  title,
  withDateRange = true,
}: {
  description: string;
  meta?: ReactNode;
  range?: AdminDateRange;
  title: string;
  withDateRange?: boolean;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
          {title}
        </h1>
        {meta ? <div className="mt-1.5 text-sm leading-6 text-white/70">{meta}</div> : null}
        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/55">{description}</p>
      </div>
      {withDateRange && range ? <DateRangeControls activeRange={range.key} /> : null}
    </div>
  );
}
