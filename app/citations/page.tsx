import { CitationsContent } from "../../components/legal/citations-content";
import { FooterVariantTwo } from "@/components/sections/footer-2";
import { NavbarSticky } from "@/components/navbar-sticky";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Citations & Research Sources",
    description: "Recovery Compass App is built on evidence. Browse our cited sources from WHO, NIH, Mayo Clinic, NHS, and other authoritative health institutions.",
    keywords: ["Recovery Compass citations", "wellness app research", "health program evidence", "nicotine cessation research", "pelvic floor citations"],
};

export default function CitationsPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <NavbarSticky simple />
            <main className="flex-1 max-w-4xl mx-auto px-6 py-20 w-full">
                <CitationsContent />
            </main>
            <FooterVariantTwo />
        </div>
    );
}
