"use client";

import { Button } from "@/components/ui/button";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="rounded-[2rem] border border-red-300/20 bg-red-300/10 p-6 text-white">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-100/60">
        Admin data error
      </p>
      <h2 className="mt-3 text-2xl font-semibold">Could not load this view</h2>
      <p className="mt-2 text-sm leading-6 text-red-50/70">{error.message}</p>
      <Button
        className="mt-5 rounded-full bg-white text-[#073512] hover:bg-white/90"
        onClick={reset}
      >
        Try again
      </Button>
    </div>
  );
}
