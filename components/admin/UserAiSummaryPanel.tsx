"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Loader2, RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CopySupportButton } from "@/components/admin/CopySupportButton";
import { cn } from "@/lib/utils";
import type { AdminUserSummary, AdminUserSummarySection } from "@/lib/admin/user-summary-schema";
import { getSectionDisplayFacts } from "@/lib/admin/user-summary-schema";

type SummaryPayload = {
  cached: boolean;
  context?: Record<string, unknown>;
  contextVersion: number;
  generatedAt: string;
  generatedByAdminEmail: string;
  model: string;
  plainText: string;
  stale?: boolean;
  summary: AdminUserSummary;
};

const NARRATIVE_SECTIONS = new Set<keyof AdminUserSummary>([
  "salesAndOutreach",
  "risksAndOpenIssues",
]);

const SECTION_LABELS: Record<keyof AdminUserSummary | "nextBestAction", string> = {
  appUsageAndActivity: "App usage & activity",
  communication: "Communication",
  dietAndAddOns: "Diet & add-ons",
  headline: "Headline",
  nextBestAction: "Next best action",
  overview: "Overview",
  profileAndIntent: "Profile & intent",
  programOwnership: "Program ownership",
  purchasesAndRevenue: "Purchases & revenue",
  risksAndOpenIssues: "Risks & open issues",
  salesAndOutreach: "Sales & outreach",
};

function SummarySectionCard({
  highlight,
  label,
  narrative,
  section,
}: {
  highlight?: boolean;
  label: string;
  narrative?: boolean;
  section: AdminUserSummarySection;
}) {
  const facts = getSectionDisplayFacts(section);
  const showSummary = Boolean(section.summary.trim());
  const showBullets = narrative && section.bullets.length > 0;

  return (
    <Card
      className={cn(
        "border-white/10 bg-black/15 text-white shadow-none",
        highlight
          ? "border-teal-200/20 bg-teal-300/[0.08]"
          : "border-white/10 bg-black/15"
      )}
    >
      <CardContent className="p-4">
      <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
        {label}
      </h3>

      {showSummary ? (
        <p className="mt-3 text-sm leading-6 text-white/72">{section.summary}</p>
      ) : null}

      {facts.length > 0 ? (
        <dl
          className={cn(
            "space-y-2.5",
            showSummary ? "mt-3" : "mt-3"
          )}
        >
          {facts.map((fact) => (
            <div className="grid gap-1 sm:grid-cols-[minmax(7rem,34%)_1fr] sm:gap-3" key={`${fact.label}-${fact.value}`}>
              <dt className="text-xs font-medium uppercase tracking-[0.12em] text-white/42">
                {fact.label}
              </dt>
              <dd className="text-sm leading-6 text-white/82">{fact.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {showBullets ? (
        <ul className="mt-3 space-y-2 text-sm leading-6 text-white/66">
          {section.bullets.map((bullet) => (
            <li className="flex gap-2" key={bullet}>
              <span className="text-white/30">•</span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {!showSummary && facts.length === 0 && !showBullets ? (
        <p className="mt-3 text-sm text-white/45">No data for this section.</p>
      ) : null}
      </CardContent>
    </Card>
  );
}

export function UserAiSummaryPanel({ userId }: { userId: string }) {
  const [payload, setPayload] = useState<SummaryPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSources, setShowSources] = useState(false);
  const loadInFlightRef = useRef<Promise<void> | null>(null);

  const loadSummary = useCallback(
    async (force = false, signal?: AbortSignal) => {
      if (!force && loadInFlightRef.current) {
        await loadInFlightRef.current;
        return;
      }

      setError(null);
      if (force) {
        setIsGenerating(true);
      } else {
        setIsLoading(true);
      }

      const task = (async () => {
        try {
          if (!force) {
            const cachedResponse = await fetch(`/api/admin/users/${userId}/summary`, {
              signal,
            });
            const cachedData = await cachedResponse.json();

            if (signal?.aborted) {
              return;
            }

            if (cachedResponse.ok && cachedData.summary) {
              setPayload(cachedData.summary as SummaryPayload);
              if (!cachedData.stale) {
                return;
              }
            }
          }

          const generateResponse = await fetch(`/api/admin/users/${userId}/summary`, {
            body: JSON.stringify({ force }),
            headers: { "content-type": "application/json" },
            method: "POST",
            signal,
          });
          const generateData = await generateResponse.json();

          if (signal?.aborted) {
            return;
          }

          if (!generateResponse.ok) {
            throw new Error(generateData.message ?? "Failed to generate user summary");
          }

          setPayload(generateData.summary as SummaryPayload);
        } catch (loadError) {
          if (signal?.aborted || (loadError instanceof DOMException && loadError.name === "AbortError")) {
            return;
          }

          setError(loadError instanceof Error ? loadError.message : "Something went wrong");
        } finally {
          if (!signal?.aborted) {
            setIsLoading(false);
            setIsGenerating(false);
          }
        }
      })();

      if (!force) {
        loadInFlightRef.current = task;
      }

      try {
        await task;
      } finally {
        if (loadInFlightRef.current === task) {
          loadInFlightRef.current = null;
        }
      }
    },
    [userId]
  );

  useEffect(() => {
    const controller = new AbortController();
    void loadSummary(false, controller.signal);
    return () => controller.abort();
  }, [loadSummary]);

  const sectionEntries = useMemo(() => {
    if (!payload?.summary) {
      return [];
    }

    return (
      [
        ["overview", payload.summary.overview],
        ["programOwnership", payload.summary.programOwnership],
        ["appUsageAndActivity", payload.summary.appUsageAndActivity],
        ["purchasesAndRevenue", payload.summary.purchasesAndRevenue],
        ["dietAndAddOns", payload.summary.dietAndAddOns],
        ["profileAndIntent", payload.summary.profileAndIntent],
        ["communication", payload.summary.communication],
        ["salesAndOutreach", payload.summary.salesAndOutreach],
        ["risksAndOpenIssues", payload.summary.risksAndOpenIssues],
      ] as Array<[keyof AdminUserSummary, AdminUserSummarySection]>
    ).map(([key, section]) => ({
      highlight: key === "appUsageAndActivity" || key === "salesAndOutreach",
      key,
      label: SECTION_LABELS[key],
      narrative: NARRATIVE_SECTIONS.has(key),
      section,
    }));
  }, [payload]);

  return (
    <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_0%_0%,rgba(167,139,250,0.14),transparent_34%),rgba(255,255,255,0.045)]">
      <div className="border-b border-white/10 p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-violet-100">
              <Sparkles className="size-5" />
              <h2 className="text-lg font-semibold">AI user summary</h2>
            </div>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-white/58">
              Gemini-generated snapshot for support and sales outreach. Cached until you
              regenerate.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {payload?.plainText ? (
              <CopySupportButton
                audit={{
                  action: "user_ai_summary_copied",
                  metadata: { userId },
                  targetUserId: userId,
                }}
                label="Copy summary"
                text={payload.plainText}
              />
            ) : null}
            <Button
              className="rounded-full border-white/10 bg-white/[0.08] text-white hover:bg-violet-300/15 hover:text-violet-50"
              disabled={isGenerating}
              onClick={() => void loadSummary(true)}
              type="button"
              variant="outline"
            >
              {isGenerating ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <RefreshCw className="size-3.5" />
              )}
              Regenerate
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4 p-5">
        {isLoading ? (
          <div className="flex items-center gap-3 rounded-[1.35rem] border border-white/10 bg-black/15 px-4 py-6 text-sm text-white/60">
            <Loader2 className="size-4 animate-spin" />
            Loading AI summary…
          </div>
        ) : null}

        {error ? (
          <div className="rounded-[1.35rem] border border-rose-200/15 bg-rose-300/10 px-4 py-3 text-sm text-rose-50">
            {error}
          </div>
        ) : null}

        {payload?.summary ? (
          <>
            <div className="rounded-[1.35rem] border border-violet-200/15 bg-violet-300/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-100/70">
                Headline
              </p>
              <p className="mt-2 text-base font-medium leading-7 text-white">
                {payload.summary.headline}
              </p>
              <p className="mt-3 text-xs text-white/45">
                Generated {new Date(payload.generatedAt).toLocaleString("en-IN")} by{" "}
                {payload.generatedByAdminEmail} · {payload.model}
                {payload.cached ? " · cached" : " · fresh"}
              </p>
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              {sectionEntries.map((entry) => (
                <SummarySectionCard
                  highlight={entry.highlight}
                  key={entry.key}
                  label={entry.label}
                  narrative={entry.narrative}
                  section={entry.section}
                />
              ))}
            </div>

            <article className="rounded-[1.35rem] border border-teal-200/20 bg-teal-300/[0.08] p-4">
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-100/75">
                {SECTION_LABELS.nextBestAction}
              </h3>
              <p className="mt-3 text-sm leading-6 text-white/82">
                {payload.summary.nextBestAction}
              </p>
            </article>

            {payload.context ? (
              <div className="rounded-[1.35rem] border border-white/10 bg-black/15">
                <button
                  className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-white/70"
                  onClick={() => setShowSources((current) => !current)}
                  type="button"
                >
                  Source context used for generation
                  <span className="text-xs text-white/40">{showSources ? "Hide" : "Show"}</span>
                </button>
                {showSources ? (
                  <pre className="max-h-80 overflow-auto border-t border-white/10 px-4 py-3 text-xs leading-5 text-white/55">
                    {JSON.stringify(payload.context, null, 2)}
                  </pre>
                ) : null}
              </div>
            ) : null}
          </>
        ) : null}
      </div>
    </section>
  );
}
