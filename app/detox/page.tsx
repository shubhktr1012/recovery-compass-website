"use client";

import { ArrowRight, Leaf } from "lucide-react";
import Link from "next/link";
import { NavbarSticky } from "@/components/navbar-sticky";
import { FooterVariantTwo } from "@/components/sections";
import { getDownloadHref, isExternalDownloadPlatform } from "@/lib/constants";
import { useDownloadPlatform } from "@/lib/use-download-platform";

export default function DetoxLandingPage() {
    const platform = useDownloadPlatform();
    const downloadHref = getDownloadHref(platform);
    const isExternalLink = isExternalDownloadPlatform(platform);

    return (
        <div className="min-h-screen bg-[oklch(0.9484_0.0251_149.08)] text-[oklch(0.2475_0.0661_146.79)] font-satoshi flex flex-col">
            <NavbarSticky simple />

            <main className="flex-1 max-w-[920px] mx-auto px-6 md:px-12 py-16 md:py-24 w-full flex flex-col items-center justify-center">
                <div className="max-w-2xl text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[oklch(0.2475_0.0661_146.79)]/5 text-[oklch(0.2475_0.0661_146.79)] text-[11px] font-bold uppercase tracking-[0.2em] mb-4">
                        <Leaf className="size-3 text-[#3D7A4A] fill-current" />
                        Free in the app
                    </div>
                    <h1 className="font-erode text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05] mb-5">
                        Start the 6-Day Free Detox Program inside Recovery Compass.
                    </h1>
                    <p className="text-[15px] md:text-[17px] text-[oklch(0.2475_0.0661_146.79)]/62 font-medium leading-relaxed md:mx-auto md:max-w-xl">
                        Detox is now an app journey, not a website PDF. Download the app to start it for free, or access it as a bonus with any paid program.
                    </p>
                    <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                        <a
                            href={downloadHref}
                            {...(isExternalLink ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                            className="group inline-flex h-[52px] items-center justify-center gap-2 rounded-full bg-[oklch(0.2475_0.0661_146.79)] px-7 text-[15px] font-bold text-white shadow-lg shadow-[oklch(0.2475_0.0661_146.79)]/12 transition-[background-color,box-shadow,transform] duration-200 ease-out hover:bg-[oklch(0.2475_0.0661_146.79)]/92 hover:shadow-xl hover:shadow-[oklch(0.2475_0.0661_146.79)]/16 active:scale-[0.98]"
                        >
                            Download App to Start
                            <ArrowRight className="size-4 opacity-70 transition-transform group-hover:translate-x-0.5" />
                        </a>
                        <Link
                            href="/#programs"
                            className="inline-flex h-[52px] items-center justify-center rounded-full border border-[oklch(0.2475_0.0661_146.79)]/12 bg-white/55 px-7 text-[15px] font-bold text-[oklch(0.2475_0.0661_146.79)] transition-[background-color,border-color,transform] duration-200 ease-out hover:border-[oklch(0.2475_0.0661_146.79)]/22 hover:bg-white active:scale-[0.98]"
                        >
                            Explore Paid Programs
                        </Link>
                    </div>
                    <div className="mx-auto mt-10 grid max-w-2xl gap-3 text-left sm:grid-cols-3">
                        {[
                            "Free for new app users",
                            "Included with every paid program",
                            "Tracked as an in-app 6-day journey",
                        ].map((item) => (
                            <div
                                key={item}
                                className="rounded-2xl border border-[oklch(0.2475_0.0661_146.79)]/8 bg-white/55 p-4 text-[13px] font-bold leading-snug text-[oklch(0.2475_0.0661_146.79)]/70"
                            >
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <FooterVariantTwo />
        </div>
    );
}
