import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Mail, Timer } from "lucide-react";
import { NavbarSticky } from "@/components/navbar-sticky";
import { FooterVariantTwo } from "@/components/sections";

export const metadata: Metadata = {
    title: "Diet Plan Order Confirmed | Recovery Compass Wellness",
    robots: {
        index: false,
        follow: false,
    },
};

export default function DietPlanConfirmationPage() {
    return (
        <div className="min-h-screen bg-[#F5F5F7] text-[oklch(0.2475_0.0661_146.79)] font-satoshi">
            <NavbarSticky simple />
            <main className="px-6 py-16 md:px-12 md:py-24">
                <section className="mx-auto max-w-3xl rounded-[40px] border border-[oklch(0.2475_0.0661_146.79)]/8 bg-white p-8 shadow-2xl shadow-[oklch(0.2475_0.0661_146.79)]/[0.04] md:p-14">
                    <div className="mb-10 inline-flex size-20 items-center justify-center rounded-full bg-[#E3F2E5] ring-8 ring-[#E3F2E5]/50 text-[#06290C]">
                        <CheckCircle2 className="size-10" />
                    </div>
                    <p className="mb-4 text-[12px] font-bold uppercase tracking-[0.2em] text-[oklch(0.2475_0.0661_146.79)]/50">
                        Payment confirmed
                    </p>
                    <h1 className="mb-6 max-w-2xl font-erode text-4xl font-medium leading-[1.05] tracking-tight md:text-[3.5rem]">
                        Your personalised diet plan is being prepared.
                    </h1>
                    <p className="max-w-2xl text-base font-medium leading-relaxed text-[oklch(0.2475_0.0661_146.79)]/70 md:text-[1.125rem]">
                        We will email the branded PDF to the address you entered. Most plans arrive within a few minutes, and the delivery window is up to 30 minutes.
                    </p>

                    <div className="mt-12 grid gap-5 md:grid-cols-2">
                        <div className="rounded-[32px] bg-[#F5F5F7] border border-[oklch(0.2475_0.0661_146.79)]/5 p-7">
                            <Mail className="mb-5 size-6 text-[#06290C]" />
                            <h2 className="mb-2.5 text-[15px] font-bold">Check your inbox</h2>
                            <p className="text-[14px] font-medium leading-relaxed text-[oklch(0.2475_0.0661_146.79)]/60">
                                The PDF is sent as an attachment. Check spam or promotions if it does not appear.
                            </p>
                        </div>
                        <div className="rounded-[32px] bg-[#F5F5F7] border border-[oklch(0.2475_0.0661_146.79)]/5 p-7">
                            <Timer className="mb-5 size-6 text-[#06290C]" />
                            <h2 className="mb-2.5 text-[15px] font-bold">Generation happens in the background</h2>
                            <p className="text-[14px] font-medium leading-relaxed text-[oklch(0.2475_0.0661_146.79)]/60">
                                The plan is generated after checkout so you do not need to keep this page open.
                            </p>
                        </div>
                    </div>

                    <div className="mt-12">
                        <Link
                            href="/"
                            className="inline-flex h-[52px] items-center rounded-full bg-[oklch(0.2475_0.0661_146.79)] px-8 text-[15px] font-semibold text-white shadow-md shadow-[oklch(0.2475_0.0661_146.79)]/20 transition-all hover:bg-[oklch(0.2475_0.0661_146.79)]/90 active:scale-[0.98]"
                        >
                            Back to Recovery Compass
                        </Link>
                    </div>
                </section>
            </main>
            <FooterVariantTwo />
        </div>
    );
}
