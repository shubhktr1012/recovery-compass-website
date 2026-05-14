import { TermsContent } from "@/components/legal/terms-content";
import { FooterVariantTwo } from "@/components/sections/footer-2";
import { NavbarSticky } from "@/components/navbar-sticky";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms & Conditions",
    description: "Read the Terms & Conditions governing your use of Recovery Compass Wellness covering subscriptions, program access, limitations of liability, and your rights.",
    keywords: ["Recovery Compass terms", "wellness app terms of service", "Recovery Compass conditions", "app usage agreement"],
    alternates: {
        canonical: "/terms",
    },
    openGraph: {
        title: "Terms & Conditions | Recovery Compass Wellness",
        description: "Read the Terms & Conditions governing your use of Recovery Compass Wellness covering subscriptions, program access, limitations of liability, and your rights.",
        url: "https://recoverycompass.co/terms",
    },
};

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <NavbarSticky simple />
            <main className="flex-1 max-w-4xl mx-auto px-6 py-20 w-full">
                <TermsContent />
            </main>
            <FooterVariantTwo />
        </div>
    );
}
