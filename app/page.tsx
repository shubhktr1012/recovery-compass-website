import type { Metadata } from "next";
import { AnnouncementBanner } from "@/components/announcement-banner";
import { NavbarSticky } from "@/components/navbar-sticky";
import {
  HeroOmega,
  PhilosophySection,
  ProblemSection,
  SolutionSection,
  ExploreProgramsSection,
  CTASection,
  FAQSection,
  AppDownloadSection,
  FooterVariantTwo,
} from "@/components/sections";


export const metadata: Metadata = {
  title: "Recovery Compass App | Guided Habit Reset & Wellness",
  description:
    "Recovery Compass App offers guided programs for habit reset, better sleep, steadier energy, and calmer daily balance through practical daily support.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Recovery Compass App | Guided Habit Reset & Wellness",
    description:
      "Guided programs for habit reset, better sleep, steadier energy, and calmer daily balance through practical daily support.",
    url: "https://recoverycompass.co/",
  },
  twitter: {
    title: "Recovery Compass App | Guided Habit Reset & Wellness",
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
  sameAs: ["https://www.instagram.com/recovery_compass/?hl=en"],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Recovery Compass",
  url: "https://recoverycompass.co",
  description:
    "Guided support for habit reset, better sleep, steadier energy, and calmer daily routines.",
};

export default function Home() {
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
      <div className="min-h-screen bg-background text-foreground">
        <AnnouncementBanner />
        <NavbarSticky />
        <main>
          <HeroOmega />

          <div id="why-us" className="scroll-mt-28">
            <PhilosophySection />
          </div>

          <ProblemSection />

          <div id="features" className="scroll-mt-28">
            <SolutionSection />
          </div>

          <div id="programs" className="scroll-mt-28">
            <ExploreProgramsSection />
          </div>

          <AppDownloadSection />
          <FAQSection />
          <CTASection />
          <FooterVariantTwo />
        </main>
      </div>
    </>
  );
}
