"use client";

import { useState } from "react";
import { PROGRAM_OPTIONS, type ProgramSlug } from "@/lib/program-access";

type GrantSuccess = {
  userId: string;
  email: string | null;
  displayName: string | null;
  programSlug: string;
  programLabel: string;
};

export function ProgramGrantForm({ isConfigured }: { isConfigured: boolean }) {
  const [adminSecret, setAdminSecret] = useState("");
  const [email, setEmail] = useState("");
  const [programSlug, setProgramSlug] = useState<ProgramSlug>(PROGRAM_OPTIONS[0].slug);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<GrantSuccess | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/internal/program-grants", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          adminSecret,
          email,
          programSlug,
        }),
      });

      const payload = (await response.json()) as
        | { success: true; granted: GrantSuccess }
        | { success: false; error: string };

      if (!response.ok || !payload.success) {
        setError(payload.success ? "Grant failed" : payload.error);
        return;
      }

      setSuccess(payload.granted);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Grant failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f4f1ea] px-6 py-12 text-[#06290C]">
      <div className="mx-auto max-w-2xl rounded-[32px] border border-black/10 bg-white p-8 shadow-[0_24px_80px_rgba(6,41,12,0.08)]">
        <div className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-black/55">
            Internal Ops
          </p>
          <h1 className="font-erode text-4xl leading-tight">Grant a program manually</h1>
          <p className="max-w-xl text-sm leading-6 text-black/65">
            This writes directly to the canonical <code>program_access</code> table in Supabase. Store
            purchases can keep flowing through RevenueCat separately.
          </p>
        </div>

        {!isConfigured ? (
          <div className="mt-8 rounded-3xl border border-amber-300 bg-amber-50 px-5 py-4 text-sm text-amber-900">
            Set <code>PROGRAM_GRANTS_ADMIN_SECRET</code> in the web app environment before using this page.
          </div>
        ) : null}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="admin-secret" className="text-sm font-medium text-black/75">
              Admin secret
            </label>
            <input
              id="admin-secret"
              type="password"
              value={adminSecret}
              onChange={(event) => setAdminSecret(event.target.value)}
              disabled={!isConfigured || isSubmitting}
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-base outline-none transition focus:border-[#06290C]"
              placeholder="Enter the shared internal secret"
              autoComplete="current-password"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="member-email" className="text-sm font-medium text-black/75">
              User email
            </label>
            <input
              id="member-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={!isConfigured || isSubmitting}
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-base outline-none transition focus:border-[#06290C]"
              placeholder="member@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="program-slug" className="text-sm font-medium text-black/75">
              Program
            </label>
            <select
              id="program-slug"
              value={programSlug}
              onChange={(event) => setProgramSlug(event.target.value as ProgramSlug)}
              disabled={!isConfigured || isSubmitting}
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-base outline-none transition focus:border-[#06290C]"
            >
              {PROGRAM_OPTIONS.map((program) => (
                <option key={program.slug} value={program.slug}>
                  {program.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={!isConfigured || isSubmitting}
            className="inline-flex min-w-44 items-center justify-center rounded-full bg-[#06290C] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#0b3a14] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Granting..." : "Grant Program"}
          </button>
        </form>

        {error ? (
          <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {success ? (
          <div className="mt-6 rounded-3xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-900">
            <p className="font-medium">Program granted successfully.</p>
            <p className="mt-1">
              {success.programLabel} was granted to {success.displayName || success.email || success.userId}.
            </p>
            <p className="mt-1 text-emerald-800/75">User ID: {success.userId}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
