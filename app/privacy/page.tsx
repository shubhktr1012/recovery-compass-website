import { PrivacyContent } from "@/components/legal/privacy-content";
import { FooterVariantTwo } from "@/components/sections/footer-2";
import { NavbarSticky } from "@/components/navbar-sticky";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy | Recovery Compass App",
    description: "Learn how Recovery Compass App collects, uses, and protects your personal data. We are committed to full transparency about your privacy rights.",
    keywords: ["Recovery Compass privacy policy", "wellness app privacy", "health app data policy", "Recovery Compass data"],
    alternates: {
        canonical: "/privacy",
    },
    openGraph: {
        title: "Privacy Policy | Recovery Compass App",
        description: "Learn how Recovery Compass App collects, uses, and protects your personal data. We are committed to full transparency about your privacy rights.",
        url: "https://recoverycompass.co/privacy",
    },
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <NavbarSticky simple />
            <main className="flex-1 max-w-4xl mx-auto px-6 py-20 w-full">
                <PrivacyContent />
            </main>
            <FooterVariantTwo />
        </div>
    );
}
