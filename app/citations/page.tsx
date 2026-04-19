"use client";

import { CitationsContent } from "../../components/legal/citations-content";
import { FooterVariantTwo } from "@/components/sections/footer-2";
import { NavbarSticky } from "@/components/navbar-sticky";

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
