"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong.";
}

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSessionReady, setIsSessionReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function hydrateRecoverySession() {
      const accessToken = searchParams.get("access_token");
      const refreshToken = searchParams.get("refresh_token");

      if (accessToken && refreshToken) {
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (!isMounted) {
          return;
        }

        if (sessionError) {
          setError(sessionError.message);
          setIsSessionReady(false);
          return;
        }
      }

      const { data } = await supabase.auth.getSession();
      if (!isMounted) {
        return;
      }

      setIsSessionReady(Boolean(data.session));
      if (!data.session) {
        setError("This reset link is invalid or expired. Please request a new one.");
      }
    }

    void hydrateRecoverySession();

    return () => {
      isMounted = false;
    };
  }, [searchParams]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (password.length < 8) {
      setError("Use at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    const { error: updateError } = await supabase.auth.updateUser({ password });

    setIsSubmitting(false);

    if (updateError) {
      setError(getErrorMessage(updateError));
      return;
    }

    setSuccess("Password updated. You can now sign in to the admin dashboard.");
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
          New password
        </label>
        <Input
          autoComplete="new-password"
          className="h-12 rounded-2xl border-white/10 bg-white/[0.08] text-white placeholder:text-white/30"
          disabled={!isSessionReady || isSubmitting}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="At least 8 characters"
          type="password"
          value={password}
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
          Confirm password
        </label>
        <Input
          autoComplete="new-password"
          className="h-12 rounded-2xl border-white/10 bg-white/[0.08] text-white placeholder:text-white/30"
          disabled={!isSessionReady || isSubmitting}
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder="Repeat new password"
          type="password"
          value={confirmPassword}
        />
      </div>
      {error ? (
        <p className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-100">
          {error}
        </p>
      ) : null}
      {success ? (
        <div className="space-y-3 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-3 text-sm text-emerald-50">
          <p>{success}</p>
          <Link
            className="inline-flex font-semibold underline underline-offset-4"
            href="https://admin.recoverycompass.co/admin"
          >
            Go to admin sign-in
          </Link>
        </div>
      ) : null}
      <Button
        className="h-12 w-full rounded-full bg-white text-[#073512] hover:bg-white/90"
        disabled={!isSessionReady || isSubmitting}
        type="submit"
      >
        {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
        Save new password
      </Button>
      <p className="text-center text-xs leading-5 text-white/40">
        If this link expired, request another reset email from the sign-in modal.
      </p>
    </form>
  );
}
