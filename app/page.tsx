import type { Metadata } from "next";
import { AnnouncementBanner } from "@/components/announcement-banner";
import { NavbarSticky } from "@/components/navbar-sticky";
import { getHomepageCommunityData } from "@/lib/homepage-community";
import {
  HeroOmega,
  PhilosophySection,
  ProblemSection,
  ExploreProgramsSection,
  CTASection,
  FAQSection,
  AppDownloadSection,
  FooterVariantTwo,
} from "@/components/sections";


export const metadata: Metadata = {
  title: "Recovery Compass Wellness | Guided Habit Reset & Wellness",
  description:
    "Recovery Compass Wellness offers structured daily programs for habit reset, sleep, energy, men's vitality, and biohacking.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Recovery Compass Wellness | Guided Habit Reset & Wellness",
    description:
      "Structured daily programs for habit reset, sleep, energy, men's vitality, and biohacking.",
    url: "https://recoverycompass.co/",
  },
  twitter: {
    title: "Recovery Compass Wellness | Guided Habit Reset & Wellness",
    description:
      "Structured daily programs for habit reset, sleep, energy, men's vitality, and biohacking.",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Recovery Compass Wellness",
  url: "https://recoverycompass.co",
  logo: "https://recoverycompass.co/rc-logo-white.svg",
  sameAs: ["https://www.instagram.com/recovery_compass/?hl=en"],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Recovery Compass Wellness",
  url: "https://recoverycompass.co",
  description:
    "Structured daily programs for habit reset, sleep, energy, men's vitality, and biohacking.",
};

export default async function Home() {
  const communityData = await getHomepageCommunityData();

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
          <HeroOmega
            memberCount={communityData.memberCount}
            latestMembers={communityData.latestMembers}
          />

          <div id="why-us" className="scroll-mt-28">
            <PhilosophySection />
          </div>

          <ProblemSection />
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
