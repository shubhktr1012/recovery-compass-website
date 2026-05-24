"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ADMIN_DATE_RANGE_OPTIONS } from "@/lib/admin/date-range";
import { cn } from "@/lib/utils";

export function DateRangeControls({ activeRange }: { activeRange: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] p-1">
      {ADMIN_DATE_RANGE_OPTIONS.map((option) => {
        const isActive = option.key === activeRange;
        return (
          <button
            key={option.key}
            type="button"
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString());
              params.set("range", option.key);
              router.push(`${pathname}?${params.toString()}`);
            }}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium transition",
              isActive
                ? "bg-white text-[#073512]"
                : "text-white/60 hover:bg-white/[0.07] hover:text-white"
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
