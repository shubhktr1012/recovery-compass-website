import Link from "next/link";
import { Button } from "@/components/ui/button";

export function AccessDenied({
  message = "This account is not approved for admin access.",
}: {
  message?: string;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#06190d] px-6 text-white">
      <div className="max-w-md rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 text-center shadow-2xl shadow-black/20">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/45">
          Admin access
        </p>
        <h1 className="mt-4 text-3xl font-semibold">Access denied</h1>
        <p className="mt-3 text-sm leading-6 text-white/60">{message}</p>
        <Button asChild className="mt-6 rounded-full bg-white text-[#073512] hover:bg-white/90">
          <Link href="https://recoverycompass.co">Return to website</Link>
        </Button>
      </div>
    </main>
  );
}
