import type { Metadata } from "next";
import HomePageClient from "@/app/home-page-client";
import { getFeaturedHomepageTestimonials } from "@/lib/testimonials";

export const metadata: Metadata = {
  title: "Recovery Compass | Guided Habit Reset, Sleep, and Energy Support",
  description:
    "Recovery Compass offers guided programs for habit reset, better sleep, steadier energy, and calmer daily balance through practical daily support.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Recovery Compass | Guided Habit Reset, Sleep, and Energy Support",
    description:
      "Guided programs for habit reset, better sleep, steadier energy, and calmer daily balance through practical daily support.",
    url: "https://recoverycompass.co/",
  },
  twitter: {
    title: "Recovery Compass | Guided Habit Reset, Sleep, and Energy Support",
    description:
      "Guided programs for habit reset, better sleep, steadier energy, and calmer daily balance.",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Recovery Compass",
  url: "https://recoverycompass.co",
  logo: "https://recoverycompass.co/rc-logo-white.svg",
  sameAs: [],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Recovery Compass",
  url: "https://recoverycompass.co",
  description:
    "Guided support for habit reset, better sleep, steadier energy, and calmer daily routines.",
};

export default async function Home() {
  const testimonials = await getFeaturedHomepageTestimonials();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <HomePageClient testimonials={testimonials} />
    </>
  );
}
