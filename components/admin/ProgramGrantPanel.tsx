"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, TicketCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PROGRAM_OPTIONS, type ProgramSlug } from "@/lib/program-access";

type ProgramGrantSummary = {
  currentDay: number;
  priorityRank: number | null;
  program: string;
  programSlug: string | null;
  programState: string;
  purchaseState: string;
};

type GrantResult = {
  alreadyOwned: boolean;
  completionState: string;
  currentDay: number | null;
  priorityRank: number | null;
  programLabel: string;
  programSlug: string;
  programState: string;
  purchaseState: string;
};

export function ProgramGrantPanel({
  canGrant,
  programs,
  userId,
}: {
  canGrant: boolean;
  programs: ProgramGrantSummary[];
  userId: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [programSlug, setProgramSlug] = useState<ProgramSlug>(PROGRAM_OPTIONS[0].slug);
  const [reason, setReason] = useState("");
  const [evidence, setEvidence] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<GrantResult | null>(null);

  const selectedAccess = useMemo(
    () => programs.find((program) => program.programSlug === programSlug),
    [programSlug, programs]
  );
  const blockingProgram = programs.find((program) =>
    ["active", "scheduled", "paused"].includes(program.programState)
  );

  const preview = selectedAccess
    ? `Already owned: ${selectedAccess.programState}, ${selectedAccess.purchaseState}, day ${selectedAccess.currentDay}. This grant will not reset progress.`
    : blockingProgram
      ? `Will be queued after ${blockingProgram.program}. No second active journey will be created.`
      : "Will be granted as ready for setup. The user still chooses a start date in the app.";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setResult(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/program-grants", {
        body: JSON.stringify({
          evidence,
          programSlug,
          reason,
          userId,
        }),
        headers: {
          "content-type": "application/json",
        },
        method: "POST",
      });

      const payload = (await response.json()) as
        | { grant: GrantResult; success: true }
        | { message?: string };

      if (!response.ok || !("success" in payload)) {
        setError(
          "message" in payload && payload.message
            ? payload.message
            : "Could not grant program."
        );
        return;
      }

      setResult(payload.grant);
      setReason("");
      setEvidence("");
      startTransition(() => router.refresh());
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Could not grant program."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_0%_0%,rgba(199,183,255,0.12),transparent_34%),rgba(255,255,255,0.045)]">
      <div className="border-b border-white/10 p-5">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-violet-300/12 p-3 text-violet-100">
            <TicketCheck className="size-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Audited program grant</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-white/58">
              Use this only for support-approved entitlement corrections. It never marks a
              payment as paid and never starts a second active journey.
            </p>
          </div>
        </div>
      </div>

      <div className="p-5">
        {!canGrant ? (
          <div className="flex items-start gap-3 rounded-3xl border border-amber-200/15 bg-amber-300/10 p-4 text-sm leading-6 text-amber-50">
            <ShieldAlert className="mt-0.5 size-5 shrink-0" />
            <p>Viewer admins can inspect data, but only owner and ops admins can grant programs.</p>
          </div>
        ) : (
          <form className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-white/75">Program</span>
                <select
                  className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.08] px-4 text-sm text-white outline-none"
                  onChange={(event) => setProgramSlug(event.target.value as ProgramSlug)}
                  value={programSlug}
                >
                  {PROGRAM_OPTIONS.map((program) => (
                    <option
                      className="bg-[#101716] text-white"
                      key={program.slug}
                      value={program.slug}
                    >
                      {program.label}
                    </option>
                  ))}
                </select>
              </label>

              <div className="rounded-3xl border border-sky-200/15 bg-sky-300/10 p-4 text-sm leading-6 text-sky-50">
                {preview}
              </div>
            </div>

            <div className="space-y-4">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-white/75">Reason</span>
                <input
                  className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.08] px-4 text-sm text-white outline-none placeholder:text-white/35"
                  onChange={(event) => setReason(event.target.value)}
                  placeholder="Support correction, team access, paid web issue..."
                  required
                  value={reason}
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-white/75">Evidence / reference</span>
                <input
                  className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.08] px-4 text-sm text-white outline-none placeholder:text-white/35"
                  onChange={(event) => setEvidence(event.target.value)}
                  placeholder="Razorpay order ID, RevenueCat evidence, approval source..."
                  required
                  value={evidence}
                />
              </label>

              <Button
                className="h-12 rounded-2xl bg-violet-100 px-6 text-[#1f1735] hover:bg-violet-50"
                disabled={isSubmitting || isPending}
                type="submit"
              >
                {isSubmitting || isPending ? "Granting..." : "Grant program"}
              </Button>
            </div>
          </form>
        )}

        {error ? (
          <div className="mt-4 rounded-3xl border border-rose-200/15 bg-rose-300/10 p-4 text-sm text-rose-50">
            {error}
          </div>
        ) : null}

        {result ? (
          <div className="mt-4 rounded-3xl border border-sky-200/15 bg-sky-300/10 p-4 text-sm leading-6 text-sky-50">
            {result.alreadyOwned ? "Existing access preserved." : "Program granted."}{" "}
            {result.programLabel} is now {result.programState}
            {result.priorityRank ? ` at queue #${result.priorityRank}` : ""}.
          </div>
        ) : null}
      </div>
    </section>
  );
}
