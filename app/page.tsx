"use client";

import { useState } from "react";
import { NavbarSticky } from "@/components/navbar-sticky";
import {
  HeroOmega,
  PhilosophySection,
  ProblemSection,
  SolutionSection,
  ExploreProgramsSection,
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
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <NavbarSticky />

      {/* Page Sections */}
      <main>
        <HeroOmega
          onSecondaryClick={scrollToPhilosophy}
        />



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

        <CTASection />

        <FAQSection />

        <FooterVariantTwo />
      </main>
    </div>
  );
}
