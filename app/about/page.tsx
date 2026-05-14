import type { Metadata } from "next";
import { NavbarSticky } from "@/components/navbar-sticky";
import { FooterVariantTwo } from "@/components/sections/footer-2";
import { AboutPageContent } from "@/components/sections/about-page-content";

export const metadata: Metadata = {
    title: "About Us",
    description: "Recovery Compass Wellness helps you quit smoking, improve sexual health, and build lasting habits with science-backed programs from WHO and Mayo Clinic.",
    keywords: [
        "about Recovery Compass",
        "Recovery Compass Wellness",
        "wellness habit change app",
        "quit smoking app",
        "pelvic floor training app",
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
