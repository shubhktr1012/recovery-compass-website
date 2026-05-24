import { redirect } from "next/navigation";
import { AdminSignInForm } from "@/components/admin/AdminSignInForm";
import { getAdminAccess } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

export default async function AdminSignInPage() {
  const access = await getAdminAccess();
  if (access.ok) {
    redirect("/overview");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#06190d] px-6 text-white">
      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 shadow-2xl shadow-black/20">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/45">
          Recovery Compass admin
        </p>
        <h1 className="mt-4 text-3xl font-semibold">Sign in</h1>
        <p className="mt-3 text-sm leading-6 text-white/60">
          Use Google or password sign-in with an approved admin email. The
          dashboard is read-only in this first release slice.
        </p>
        <AdminSignInForm />
      </div>
    </main>
  );
}
