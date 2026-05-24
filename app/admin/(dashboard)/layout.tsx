import { redirect } from "next/navigation";
import { AccessDenied } from "@/components/admin/AccessDenied";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminAccess } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const access = await getAdminAccess();

  if (!access.ok && access.reason === "unauthenticated") {
    redirect("/admin/sign-in");
  }

  if (!access.ok) {
    return <AccessDenied message={access.message} />;
  }

  return <AdminShell admin={access.admin}>{children}</AdminShell>;
}
