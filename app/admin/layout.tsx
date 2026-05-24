import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getHostFromHeaders, isAdminHost } from "@/lib/admin/host";

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
  const host = getHostFromHeaders(headerStore);

  if (!isAdminHost(host)) {
    notFound();
  }

  return children;
}
