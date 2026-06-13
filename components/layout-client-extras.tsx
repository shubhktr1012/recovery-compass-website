"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { isProgramFinderEnabled } from "@/lib/features";

const BackToTop = dynamic(
  () => import("@/components/ui/back-to-top").then((mod) => mod.BackToTop),
  { ssr: false }
);

const PendingDietPlanNudge = dynamic(
  () => import("@/components/pending-diet-plan-nudge").then((mod) => mod.PendingDietPlanNudge),
  { ssr: false }
);

const PendingProgramFinderNudge = dynamic(
  () => import("@/components/pending-program-finder-nudge").then((mod) => mod.PendingProgramFinderNudge),
  { ssr: false }
);

const CookieBanner = dynamic(
  () => import("@/components/cookie-banner").then((mod) => mod.CookieBanner),
  { ssr: false }
);

const MyPlanDrawer = dynamic(
  () => import("@/components/my-plan-drawer").then((mod) => mod.MyPlanDrawer),
  { ssr: false }
);

export function LayoutClientExtras({ disabled = false }: { disabled?: boolean }) {
  const pathname = usePathname();
  const programFinderEnabled = isProgramFinderEnabled();
  const isAdminExperience =
    disabled ||
    pathname?.startsWith("/admin") ||
    (typeof window !== "undefined" &&
      window.location.hostname === "admin.recoverycompass.co");

  if (isAdminExperience) {
    return null;
  }

  return (
    <>
      <MyPlanDrawer />
      <PendingDietPlanNudge />
      {programFinderEnabled ? <PendingProgramFinderNudge /> : null}
      <BackToTop />
      <CookieBanner />
    </>
  );
}
