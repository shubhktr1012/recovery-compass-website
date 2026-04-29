"use client";

import { NavbarSticky } from "@/components/navbar-sticky";
import type { HomepageTestimonial } from "@/lib/testimonials";
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

interface HomePageClientProps {
  testimonials: HomepageTestimonial[];
}

export default function HomePageClient({ testimonials }: HomePageClientProps) {
  const scrollToPrograms = () => {
    document.getElementById("programs")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavbarSticky />
      <main>
        <HeroOmega testimonials={testimonials} onExploreClick={scrollToPrograms} />

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
