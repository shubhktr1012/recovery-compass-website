"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TestimonialMarquee } from "./testimonials/testimonial-marquee";

interface HeroOmegaProps {
    onPrimaryClick?: () => void; // Deprecated
    onSecondaryClick?: () => void;
}
export function HeroOmega({ onSecondaryClick }: HeroOmegaProps) {
    const scrollToWaitlist = () => {
        document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" });
    };
    return (
        <section className="relative flex flex-col justify-start pt-12 pb-16 overflow-hidden bg-white text-[oklch(0.2475_0.0661_146.79)]">
            {/* Content Container */}
            <div className="relative z-20 w-full max-w-[1200px] mx-auto px-6 md:px-12 lg:px-24 flex flex-col justify-start pt-4 pb-12">
                <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-y-8 lg:gap-x-12 items-center">

                    {/* Centered Content Block (Mobile First) */}
                    <div className="lg:col-span-10 lg:col-start-2 flex flex-col items-center text-center space-y-6">

                        {/* Avatar Trust Bar - Centered */}
                        <div className="flex flex-row items-center justify-center gap-3">
                            <p className="text-base font-medium text-[oklch(0.2475_0.0661_146.79)]">
                                Join 2,140+ beyond the urge
                            </p>
                            <div className="flex -space-x-2">
                                {[
                                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64",
                                    "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=64&h=64",
                                    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&h=64",
                                    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=64&h=64"
                                ].map((src, i) => (
                                    <img
                                        key={i}
                                        src={src}
                                        alt="Community member"
                                        className="relative w-7 h-7 rounded-full border-2 border-[oklch(0.2475_0.0661_146.79)] object-cover"
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Headline - Centered */}
                        <div className="max-w-[280px] md:max-w-[350px] lg:max-w-[520px] mx-auto space-y-6">
                            <h1 className="text-4xl md:text-5xl lg:text-7xl font-erode font-semibold tracking-tight leading-[1.05] text-black">
                                A smarter way to <span className="text-[oklch(0.2475_0.0661_146.79)] italic">quit smoking.</span>
                            </h1>

                            {/* Subheadline - Centered */}
                            <p className="text-lg md:text-xl text-[oklch(0.2475_0.0661_146.79)]/70 leading-snug font-medium max-w-2xl mx-auto">
                                Navigate nicotine cravings, calm your nervous system, and build a smoke-free life. Stop fighting biology with willpower.
                            </p>
                        </div>

                        {/* CTAs - Centered & Customized */}
                        <div className="flex flex-row gap-3 justify-center w-full pt-4">
                            <Button
                                className={cn(
                                    "rounded-full px-5 py-2.5 text-sm font-medium transition-all active:scale-95",
                                    "bg-[oklch(0.2475_0.0661_146.79)] text-white hover:bg-[oklch(0.2475_0.0661_146.79)]/90 border border-transparent h-auto"
                                )}
                                onClick={scrollToWaitlist}
                            >
                                Join the Waitlist
                            </Button>
                            <Button
                                className={cn(
                                    "rounded-full px-5 py-2.5 text-sm font-medium transition-all active:scale-95",
                                    "bg-white text-[oklch(0.2475_0.0661_146.79)] border border-[oklch(0.2475_0.0661_146.79)] hover:bg-[oklch(0.2475_0.0661_146.79)] hover:text-white h-auto"
                                )}
                                onClick={onSecondaryClick}
                            >
                                Explore Programs
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Testimonial Strip - Sitting organically below the content container */}
            <div className="relative z-10 w-full mt-6 overflow-hidden">
                <TestimonialMarquee className="py-0" />
            </div>

        </section>
    );
}
