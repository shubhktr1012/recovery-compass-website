import type { Metadata } from "next";
import { NavbarSticky } from "@/components/navbar-sticky";
import { FooterVariantTwo } from "@/components/sections/footer-2";
import { AboutPageContent } from "@/components/sections/about-page-content";

export const metadata: Metadata = {
    title: "About Us",
    description: "Recovery Compass offers structured daily programs for smoking reset, sleep, energy, men's vitality, and biohacking.",
    keywords: [
        "about Recovery Compass",
        "Recovery Compass Wellness",
        "structured wellness programs",
        "smoking reset program",
        "men's vitality program",
        "evidence-based wellness",
        "behavioral health app India",
    ],
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <NavbarSticky simple />
            <AboutPageContent />
            <FooterVariantTwo />
        </div>
    );
}
