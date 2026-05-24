import { AlertCircle } from "lucide-react";

export function EmptyState({
  description,
  title = "No data yet",
}: {
  description: string;
  title?: string;
}) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center rounded-3xl border border-dashed border-white/15 bg-white/[0.03] p-8 text-center">
      <div className="mb-4 rounded-full bg-white/[0.08] p-3 text-white/55">
        <AlertCircle className="size-5" />
      </div>
      <h3 className="text-base font-semibold text-white">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-6 text-white/55">{description}</p>
    </div>
  );
}
