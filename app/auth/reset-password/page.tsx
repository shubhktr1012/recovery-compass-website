import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const dynamic = "force-dynamic";

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#06190d] px-6 text-white">
      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 shadow-2xl shadow-black/20">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/45">
          Recovery Compass
        </p>
        <h1 className="mt-4 text-3xl font-semibold">Reset your password</h1>
        <p className="mt-3 text-sm leading-6 text-white/60">
          Enter a new password for this account. After it is saved, use the same
          email and password to sign in to the admin dashboard.
        </p>
        <Suspense
          fallback={
            <div className="mt-8 h-40 animate-pulse rounded-3xl bg-white/[0.06]" />
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </div>
    </main>
  );
}
