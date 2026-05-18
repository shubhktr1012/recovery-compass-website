import { FooterVariantTwo } from "@/components/sections/footer-2";
import { NavbarSticky } from "@/components/navbar-sticky";
import type { Metadata } from "next";
import { SupportPageContent } from "@/components/sections/support-page-content";

export const metadata: Metadata = {
    title: "Contact & Support",
    description: "Contact Recovery Compass for account, billing, technical, or program-selection questions. We typically reply within 24 hours.",
    keywords: ["Recovery Compass support", "contact Recovery Compass", "wellness program help", "program selection support"],
    alternates: {
        canonical: "/support",
    },
    openGraph: {
        title: "Contact & Support | Recovery Compass Wellness",
        description: "Contact Recovery Compass for account, billing, technical, or program-selection questions.",
        url: "https://recoverycompass.co/support",
    },
};

export default function SupportPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-primary/20">
            <NavbarSticky />
            <SupportPageContent />
            <FooterVariantTwo />
        </div>
    );
}
