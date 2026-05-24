import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { isAdminHost } from "@/lib/admin/auth";

export const metadata: Metadata = {
  robots: {
    follow: false,
    index: false,
  },
  title: "Admin | Recovery Compass",
};

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerStore = await headers();
  const host =
    headerStore.get("x-forwarded-host") ??
    headerStore.get("host") ??
    headerStore.get("x-vercel-forwarded-host");

  if (!isAdminHost(host)) {
    notFound();
  }

  return children;
}
