"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
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

    router.replace(searchParams.get("next") ?? "/admin/overview");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
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
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
        Sign in
      </Button>
    </form>
  );
}
