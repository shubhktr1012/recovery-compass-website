"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

const MAX_WAIT_MS = 6000;
const POLL_INTERVAL_MS = 300;

function AuthCompleteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  const next = useMemo(() => {
    const target = searchParams.get("next") || "/";
    return target.startsWith("/") ? target : "/";
  }, [searchParams]);

  useEffect(() => {
    let cancelled = false;
    const startedAt = Date.now();

    const finishSignIn = async () => {
      while (!cancelled && Date.now() - startedAt < MAX_WAIT_MS) {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          console.error("[Auth Complete] getUser failed:", userError);
        }

        if (user) {
          window.location.replace(next);
          return;
        }

        await new Promise((resolve) => window.setTimeout(resolve, POLL_INTERVAL_MS));
      }

      if (!cancelled) {
        window.location.replace(next);
      }
    };

    void finishSignIn();

    return () => {
      cancelled = true;
    };
  }, [next, router]);

  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-[32px] border border-black/5 bg-white p-8 shadow-xl shadow-black/5 text-center">
        {error ? (
          <>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[oklch(0.2475_0.0661_146.79)]/45">
              Sign-in issue
            </p>
            <h1 className="mt-4 font-erode text-3xl tracking-tight text-[oklch(0.2475_0.0661_146.79)]">
              We lost your session on the way back.
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-zinc-600">{error}</p>
            <div className="mt-6 flex justify-center">
              <Button asChild className="rounded-full px-6">
                <Link href="/">Back to home</Link>
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[oklch(0.2475_0.0661_146.79)]/8 text-[oklch(0.2475_0.0661_146.79)]">
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            </div>
            <p className="mt-4 text-sm font-bold uppercase tracking-[0.18em] text-[oklch(0.2475_0.0661_146.79)]/45">
              Completing sign-in
            </p>
            <h1 className="mt-4 font-erode text-3xl tracking-tight text-[oklch(0.2475_0.0661_146.79)]">
              Just a moment
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-zinc-600">
              We're finishing your sign-in and bringing your session online.
            </p>
          </>
        )}
      </div>
    </main>
  );
}

function AuthCompleteFallback() {
  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-[32px] border border-black/5 bg-white p-8 shadow-xl shadow-black/5 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[oklch(0.2475_0.0661_146.79)]/8 text-[oklch(0.2475_0.0661_146.79)]">
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
        </div>
        <p className="mt-4 text-sm font-bold uppercase tracking-[0.18em] text-[oklch(0.2475_0.0661_146.79)]/45">
          Completing sign-in
        </p>
        <h1 className="mt-4 font-erode text-3xl tracking-tight text-[oklch(0.2475_0.0661_146.79)]">
          Just a moment
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-zinc-600">
          We&apos;re finishing your sign-in and bringing your session online.
        </p>
      </div>
    </main>
  );
}

export default function AuthCompletePage() {
  return (
    <Suspense fallback={<AuthCompleteFallback />}>
      <AuthCompleteContent />
    </Suspense>
  );
}
