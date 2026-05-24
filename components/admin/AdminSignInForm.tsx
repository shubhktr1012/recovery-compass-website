"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AdminSignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsSubmitting(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    router.replace(searchParams.get("next") ?? "/overview");
    router.refresh();
  }

  async function handleGoogleSignIn() {
    setIsGoogleLoading(true);
    setError(null);

    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(
      searchParams.get("next") ?? "/overview"
    )}`;
    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });

    if (signInError) {
      setIsGoogleLoading(false);
      setError(signInError.message);
    }
  }

  return (
    <div className="mt-8 space-y-4">
      <Button
        className="h-12 w-full rounded-full border border-white/10 bg-white/[0.08] text-white hover:bg-white/[0.13]"
        disabled={isGoogleLoading || isSubmitting}
        onClick={handleGoogleSignIn}
        type="button"
        variant="outline"
      >
        {isGoogleLoading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <FcGoogle className="size-5" />
        )}
        Continue with Google
      </Button>

      <div className="flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-white/35">
        <span className="h-px flex-1 bg-white/10" />
        or use password
        <span className="h-px flex-1 bg-white/10" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
          Admin email
        </label>
        <Input
          autoComplete="email"
          className="h-12 rounded-2xl border-white/10 bg-white/[0.08] text-white placeholder:text-white/30"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="name@recoverycompass.co"
          type="email"
          value={email}
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
          Password
        </label>
        <Input
          autoComplete="current-password"
          className="h-12 rounded-2xl border-white/10 bg-white/[0.08] text-white placeholder:text-white/30"
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Supabase account password"
          type="password"
          value={password}
        />
      </div>
      {error ? (
        <p className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-100">
          {error}
        </p>
      ) : null}
      <Button
        className="h-12 w-full rounded-full bg-white text-[#073512] hover:bg-white/90"
        disabled={isSubmitting || isGoogleLoading}
        type="submit"
      >
        {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
        Sign in
      </Button>
      </form>
    </div>
  );
}
