"use client";

import { NavbarSticky } from "@/components/navbar-sticky";
import { Navbar } from "@/components/navbar";
import { HeroVariantTrust } from "@/components/sections/hero-variant-trust";
import {
  PhilosophySection,
  ProblemSection,
  SolutionSection,
  ExploreProgramsSection,
  TestimonialsSection,
  CTASection,
  FAQSection,
  FooterVariantTwo,
} from "@/components/sections";

export default function Home() {
  const scrollToPhilosophy = () => {
    document.getElementById("why-us")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToWaitlist = () => {
    document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="relative bg-background w-full">
      <NavbarSticky />

      <HeroVariantTrust
        onPrimaryClick={scrollToWaitlist}
        onSecondaryClick={scrollToPhilosophy}
      />

      <div id="why-us">
        <PhilosophySection />
      </div>

      <ProblemSection />

      <SolutionSection />

      <ExploreProgramsSection />

      <TestimonialsSection />

      <div id="waitlist">
        <CTASection />
      </div>

      <FAQSection />

      <FooterVariantTwo />
    </main>
  );
}
