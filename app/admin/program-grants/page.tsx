import type { Metadata } from "next";
import { ProgramGrantForm } from "@/components/admin/ProgramGrantForm";

export const metadata: Metadata = {
  title: "Program Grants | Recovery Compass",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProgramGrantsPage() {
  const isConfigured = Boolean(process.env.PROGRAM_GRANTS_ADMIN_SECRET);

  return <ProgramGrantForm isConfigured={isConfigured} />;
}
