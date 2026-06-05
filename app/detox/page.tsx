"use client";

import { Leaf } from "lucide-react";
import { DetoxLeadFlow } from "@/components/detox-lead-flow";
import { NavbarSticky } from "@/components/navbar-sticky";
import { FooterVariantTwo } from "@/components/sections";

export default function DetoxLandingPage() {
    return (
        <div className="min-h-screen bg-[oklch(0.9484_0.0251_149.08)] text-[oklch(0.2475_0.0661_146.79)] font-satoshi flex flex-col">
            <NavbarSticky simple />

            <main className="flex-1 max-w-[1200px] mx-auto px-6 md:px-12 py-16 md:py-24 w-full flex flex-col items-center">
                <div className="max-w-xl text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[oklch(0.2475_0.0661_146.79)]/5 text-[oklch(0.2475_0.0661_146.79)] text-[11px] font-bold uppercase tracking-[0.2em] mb-4">
                        <Leaf className="size-3 text-[#3D7A4A] fill-current" />
                        Free Program
                    </div>
                    <h1 className="font-erode text-4xl md:text-5xl font-semibold tracking-tight leading-[1.1] mb-5">
                        Your Personalized 6-Day Detox Program
                    </h1>
                    <p className="text-[15px] md:text-[16.5px] text-[oklch(0.2475_0.0661_146.79)]/60 font-medium leading-relaxed">
                        Reset your nervous system, gut, hydration, and energy. Enter your details first, then customize the PDF around your wellness focus.
                    </p>
                </div>

                <div className="w-full max-w-[560px] bg-white rounded-[32px] shadow-xl shadow-[oklch(0.2475_0.0661_146.79)]/5 border border-[oklch(0.2475_0.0661_146.79)]/8 relative overflow-hidden">
                    <div className="absolute inset-x-0 top-0 h-[4px] bg-gradient-to-r from-[#0d4416] via-[#3D7A4A] to-[#EBF4EC]" />
                    <DetoxLeadFlow source="landing_page" />
                </div>
            </main>

            <FooterVariantTwo />
        </div>
    );
}
