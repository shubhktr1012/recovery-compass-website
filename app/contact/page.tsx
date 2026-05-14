import { FooterVariantTwo } from "@/components/sections/footer-2";
import { NavbarSticky } from "@/components/navbar-sticky";
import type { Metadata } from "next";
import { SupportPageContent } from "@/components/sections/support-page-content";

export const metadata: Metadata = {
    title: "Contact Us",
    description: "Get in touch with the Recovery Compass Wellness support team. Reach us at support@recoverycompass.co - we typically reply within 24 hours.",
    keywords: ["Recovery Compass contact", "contact us", "wellness app help", "behavioral health app support"],
    alternates: {
        canonical: "/support",
    },
    openGraph: {
        title: "Contact Us | Recovery Compass Wellness",
        description: "Get in touch with the Recovery Compass Wellness support team. Reach us at support@recoverycompass.co - we typically reply within 24 hours.",
        url: "https://recoverycompass.co/contact",
    },
};

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-primary/20">
            <NavbarSticky />
            <SupportPageContent />
            <FooterVariantTwo />
        </div>
    );
}
