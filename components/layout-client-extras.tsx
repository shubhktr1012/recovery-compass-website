"use client";

import dynamic from "next/dynamic";

const BackToTop = dynamic(
  () => import("@/components/ui/back-to-top").then((mod) => mod.BackToTop),
  { ssr: false }
);

const PendingDietPlanNudge = dynamic(
  () => import("@/components/pending-diet-plan-nudge").then((mod) => mod.PendingDietPlanNudge),
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

export function LayoutClientExtras() {
  return (
    <>
      <MyPlanDrawer />
      <PendingDietPlanNudge />
      <BackToTop />
      <CookieBanner />
    </>
  );
}
