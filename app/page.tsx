"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import {
  HeroSection,
  PhilosophySection,
  ProblemSection,
  SolutionSection,
  JourneySection,
  ExploreProgramsSection,
  FAQSection,
  FooterSection,
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
      <Navbar onCtaClick={openWaitlist} />

      {/* Page Sections */}
      <main>
        <HeroSection
          onPrimaryClick={openWaitlist}
          onSecondaryClick={scrollToPhilosophy}
        />

        <div id="philosophy">
          <PhilosophySection />
        </div>

        <ProblemSection />

        <SolutionSection />

        <ExploreProgramsSection />

        <JourneySection />

        <FAQSection />

        <FooterSection onCtaClick={openWaitlist} />
      </main>
    </div>
  );
}
