"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Loader2, RefreshCw, Sparkles } from "lucide-react";
import { SummarySnapshotSection } from "@/components/admin/SummarySnapshotSection";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CopySupportButton } from "@/components/admin/CopySupportButton";
import type { AdminUserSummary } from "@/lib/admin/user-summary-schema";
import { isAdminUserSummaryV3 } from "@/lib/admin/user-summary-schema";

type SummaryPayload = {
  cached: boolean;
  context?: Record<string, unknown>;
  contextVersion: number;
  generatedAt: string;
  generatedByAdminEmail: string;
  model: string;
  plainText: string;
  stale?: boolean;
  summary: AdminUserSummary | Record<string, unknown>;
};

const SNAPSHOT_SECTIONS: Array<{
  highlight?: boolean;
  key: keyof AdminUserSummary["snapshot"];
  title: string;
}> = [
  { key: "overview", title: "Overview" },
  { key: "programOwnership", title: "Program ownership" },
  { key: "appUsageAndActivity", highlight: true, title: "App usage & activity" },
  { key: "purchasesAndRevenue", title: "Purchases & revenue" },
  { key: "dietAndAddOns", title: "Diet & add-ons" },
  { key: "profileAndIntent", title: "Profile & intent" },
  { key: "communication", title: "Communication" },
];

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

  const summary = useMemo(() => {
    if (!payload?.summary || !isAdminUserSummaryV3(payload.summary)) {
      return null;
    }

    return payload.summary;
  }, [payload]);

  return (
    <Card className="overflow-hidden border-white/10 bg-[radial-gradient(circle_at_0%_0%,rgba(167,139,250,0.14),transparent_34%),rgba(255,255,255,0.045)] text-white shadow-none">
      <CardHeader className="border-b border-white/10">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-violet-100">
              <Sparkles className="size-5" />
              <CardTitle className="text-lg font-semibold text-white">AI user summary</CardTitle>
            </div>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-white/58">
              Fixed snapshot rows from Supabase, plus Gemini insights for outreach. Cached until
              you regenerate.
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
      </CardHeader>

      <CardContent className="space-y-4 p-5">
        {isLoading ? (
          <div className="flex items-center gap-3 rounded-[1.35rem] border border-white/10 bg-black/15 px-4 py-6 text-sm text-white/60">
            <Loader2 className="size-4 animate-spin" />
            Loading AI summary…
          </div>
        ) : null}

        {error ? (
          <Alert className="border-rose-200/15 bg-rose-300/10 text-rose-50">
            <AlertTitle>Summary failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        {summary ? (
          <>
            <Card className="border-violet-200/15 bg-violet-300/10 text-white shadow-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-100/70">
                  Headline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base font-medium leading-7 text-white">
                  {summary.insights.headline}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge className="bg-white/10 text-white hover:bg-white/10" variant="outline">
                    {payload?.model}
                  </Badge>
                  <Badge className="bg-white/10 text-white hover:bg-white/10" variant="outline">
                    {payload?.cached ? "Cached" : "Fresh"}
                  </Badge>
                  {payload?.generatedAt ? (
                    <Badge className="bg-white/10 text-white hover:bg-white/10" variant="outline">
                      {new Date(payload.generatedAt).toLocaleString("en-IN")}
                    </Badge>
                  ) : null}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 xl:grid-cols-2">
              {SNAPSHOT_SECTIONS.map((section) => (
                <SummarySnapshotSection
                  highlight={section.highlight}
                  key={section.key}
                  rows={summary.snapshot[section.key]}
                  title={section.title}
                />
              ))}
            </div>

            <Separator className="bg-white/10" />

            <Card className="border-teal-200/20 bg-teal-300/[0.08] text-white shadow-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-100/75">
                  Sales & outreach
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-white/70">
                  <span className="font-medium text-white/45">Tone: </span>
                  {summary.insights.recommendedTone}
                </p>
                <ul className="space-y-2 text-sm leading-6 text-white/82">
                  {summary.insights.salesTalkingPoints.map((point) => (
                    <li className="flex gap-2" key={point}>
                      <span className="text-white/30">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {summary.insights.risks.length > 0 ? (
              <div className="space-y-2">
                {summary.insights.risks.map((risk) => (
                  <Alert
                    className="border-amber-200/15 bg-amber-300/10 text-amber-50"
                    key={risk}
                  >
                    <AlertTitle className="text-amber-100">Risk</AlertTitle>
                    <AlertDescription className="text-amber-50/90">{risk}</AlertDescription>
                  </Alert>
                ))}
              </div>
            ) : null}

            <Card className="border-teal-200/20 bg-teal-300/[0.08] text-white shadow-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-100/75">
                  Next best action
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-white/82">
                  {summary.insights.nextBestAction}
                </p>
              </CardContent>
            </Card>

            {payload?.context ? (
              <Card className="border-white/10 bg-black/15 text-white shadow-none">
                <button
                  className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-white/70"
                  onClick={() => setShowSources((current) => !current)}
                  type="button"
                >
                  Source context used for generation
                  <span className="text-xs text-white/40">{showSources ? "Hide" : "Show"}</span>
                </button>
                {showSources ? (
                  <CardContent className="border-t border-white/10 px-0 pb-0 pt-0">
                    <pre className="max-h-80 overflow-auto px-4 py-3 text-xs leading-5 text-white/55">
                      {JSON.stringify(payload.context, null, 2)}
                    </pre>
                  </CardContent>
                ) : null}
              </Card>
            ) : null}
          </>
        ) : payload && !summary ? (
          <Alert className="border-amber-200/15 bg-amber-300/10 text-amber-50">
            <AlertTitle>Summary format outdated</AlertTitle>
            <AlertDescription>
              Tap Regenerate to rebuild this summary in the new fixed-row format.
            </AlertDescription>
          </Alert>
        ) : null}
      </CardContent>
    </Card>
  );
}
