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
import { WaitlistDialog } from "@/components/waitlist-dialog";

export default function Home() {
  const [waitlistOpen, setWaitlistOpen] = useState(false);

  const openWaitlist = () => setWaitlistOpen(true);

  const scrollToPhilosophy = () => {
    document.getElementById("philosophy")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Waitlist Dialog */}
      <WaitlistDialog open={waitlistOpen} onOpenChange={setWaitlistOpen} />

      {/* Navigation */}
      <NavbarSticky onCtaClick={openWaitlist} />

      {/* Page Sections */}
      <main>
        <HeroOmega
          onPrimaryClick={openWaitlist}
          onSecondaryClick={scrollToPhilosophy}
        />



        <div id="philosophy">
          <PhilosophySection />
        </div>

        <ProblemSection />

        <SolutionSection />

        <ExploreProgramsSection />

        <CTASection />

        <FAQSection />

        <FooterVariantTwo onCtaClick={openWaitlist} />
      </main>
    </div>
  );
}
