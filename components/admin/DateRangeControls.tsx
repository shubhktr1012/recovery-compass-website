"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
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
          <Button
            key={option.key}
            className={cn(
              "h-8 rounded-full px-3 text-xs font-medium",
              isActive
                ? "bg-sky-100 text-[#082035] hover:bg-sky-100"
                : "bg-transparent text-white/60 hover:bg-white/[0.07] hover:text-sky-50"
            )}
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString());
              params.set("range", option.key);
              router.push(`${pathname}?${params.toString()}`);
            }}
            type="button"
            variant={isActive ? "secondary" : "ghost"}
          >
            {option.label}
          </Button>
        );
      })}
    </div>
  );
}
