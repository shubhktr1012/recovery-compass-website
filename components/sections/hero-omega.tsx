"use client";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getDownloadHref, isExternalDownloadPlatform } from "@/lib/constants";
import { useDownloadPlatform } from "@/lib/use-download-platform";
import type { HomepageCommunityMember } from "@/lib/homepage-community";

interface HeroOmegaProps {
    memberCount?: number | null;
    latestMembers?: HomepageCommunityMember[];
}

export function HeroOmega({
    memberCount = null,
    latestMembers = [],
}: HeroOmegaProps) {
    const platform = useDownloadPlatform();
    const downloadHref = getDownloadHref(platform);
    const isExternalLink = isExternalDownloadPlatform(platform);
    const communityLabel = memberCount && memberCount > 0
        ? `${new Intl.NumberFormat("en-US").format(memberCount)} members on Recovery Compass Wellness`
        : "Structured daily programs";

    return (
        <section className="relative flex flex-col justify-start bg-white pt-12 pb-8 text-[oklch(0.2475_0.0661_146.79)] md:pt-16 md:pb-10">
            {/* Content Container */}
            <div className="relative z-20 w-full max-w-[1200px] mx-auto px-6 md:px-12 lg:px-24 flex flex-col justify-start pt-0 pb-0">
                <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-y-6 lg:gap-x-12 items-center">

                    {/* Centered Content Block (Mobile First) */}
                    <div
                        className="lg:col-span-10 lg:col-start-2 flex flex-col items-center text-center space-y-5 md:space-y-6"
                    >

                        {/* Avatar Trust Bar - Centered */}
                        <div className="flex flex-row items-center justify-center gap-3">
                            <p className="text-sm md:text-base font-medium text-[oklch(0.2475_0.0661_146.79)]">
                                {communityLabel}
                            </p>
                            <div className="flex items-center">
                                {latestMembers.map((member, i) => (
                                    <div
                                        key={member.id}
                                        className="relative -ml-2 first:ml-0 z-0 hover:z-10 transition-transform duration-300 ease-out hover:-translate-y-1"
                                    >
                                        <Avatar className="w-7 h-7 border-2 border-[oklch(0.2475_0.0661_146.79)] cursor-pointer">
                                            <AvatarImage
                                                src={member.avatarUrl ?? undefined}
                                                alt={member.displayName || `Community member ${i + 1}`}
                                                className="object-cover"
                                            />
                                            <AvatarFallback className="bg-[oklch(0.2475_0.0661_146.79)] text-white text-[8px]">
                                                {member.initials}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Headline - Centered */}
                        <div className="max-w-[320px] md:max-w-[600px] lg:max-w-[560px] mx-auto space-y-5 md:space-y-6">
                            {/* Status Pill */}
                            <div className="inline-flex items-center gap-2 rounded-full border border-[oklch(0.2475_0.0661_146.79)]/10 bg-[oklch(0.2475_0.0661_146.79)]/5 px-3 py-1">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                                </span>
                                <span className="text-[10px] md:text-xs font-bold text-[oklch(0.2475_0.0661_146.79)]/80 tracking-wide uppercase">
                                    A Behavioral Guidance App <span className="hidden md:inline"> - Available Now on iOS &amp; Android</span>
                                    <span className="md:hidden"> - Available Now</span>
                                </span>
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-7xl font-erode font-medium tracking-tighter leading-[1.10] text-black">
                                Steady progress, <span className="whitespace-nowrap"><span className="italic text-[oklch(0.2475_0.0661_146.79)]">without</span> pressure.</span>
                            </h1>

                            <p className="text-base md:text-xl text-[oklch(0.2475_0.0661_146.79)]/70 leading-snug font-medium max-w-2xl mx-auto">
                                Recovery Compass turns difficult behavior change into structured daily programs: timed cards, practical routines, breathing practices, reflections, and progress tracking for smoking, sleep, energy, men&apos;s vitality, and biohacking.
                            </p>
                        </div>

                        {/* CTAs - Centered & Smart */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center w-full pt-2 md:pt-4">
                            {/* Smart Download CTA */}
                            <a
                                href={downloadHref}
                                {...(isExternalLink ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                                id="hero-download-cta"
                                className={cn(
                                    "inline-flex items-center gap-2.5 rounded-full px-5 py-2.5 transition-[background-color,box-shadow,transform] duration-200 ease-out active:scale-95",
                                    "bg-[oklch(0.2475_0.0661_146.79)] text-white hover:bg-[oklch(0.2475_0.0661_146.79)]/90 border border-transparent",
                                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.2475_0.0661_146.79)] focus-visible:ring-offset-2"
                                )}
                            >
                                {/* Platform-aware icon */}
                                {platform === "desktop" ? (
                                    <div className="flex items-center gap-1.5 mr-1">
                                        {/* Apple Logo */}
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 814 1000" className="w-4 h-4 shrink-0 fill-white relative z-10" aria-hidden="true">
                                            <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.5 135.4-317.3 268.5-317.3 71 0 130.1 46.4 175 46.4 42.3 0 109.1-49.1 185.6-49.1 29.8 0 108.2 2.6 168.4 79.3zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" />
                                        </svg>
                                        {/* Google Play Logo */}
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-[14px] h-[14px] shrink-0 fill-white relative z-0" aria-hidden="true">
                                            <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/>
                                        </svg>
                                    </div>
                                ) : platform === "android" ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-4 h-4 shrink-0 fill-white" aria-hidden="true">
                                        <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 814 1000" className="w-4 h-4 shrink-0 fill-white" aria-hidden="true">
                                        <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.5 135.4-317.3 268.5-317.3 71 0 130.1 46.4 175 46.4 42.3 0 109.1-49.1 185.6-49.1 29.8 0 108.2 2.6 168.4 79.3zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" />
                                    </svg>
                                )}
                                <span className="text-sm font-medium">
                                    {platform === "android" ? "Get it on Google Play"
                                        : platform === "ios" ? "Download on App Store"
                                            : "Download our app"}
                                </span>
                            </a>

                            {/* Explore Programs Secondary */}
                            <a
                                href="#programs"
                                className={cn(
                                    "inline-flex h-auto items-center justify-center rounded-full border px-5 py-2.5 text-sm font-medium transition-[background-color,border-color,color,transform] duration-200 ease-out active:scale-95",
                                    "border-[oklch(0.2475_0.0661_146.79)] bg-white text-[oklch(0.2475_0.0661_146.79)] hover:bg-[oklch(0.2475_0.0661_146.79)] hover:text-white",
                                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                                )}
                            >
                                Explore Programs
                            </a>
                        </div>
                    </div>
                </div>
            </div>

        </section >
    );
}
