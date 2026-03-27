'use client'

import { motion, useInView } from "framer-motion";
import { Check, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

type ProgramHighlight = {
    label: string;
    text: string;
};

type Program = {
    id: string;
    tag: string;
    title: string;
    description: string;
    metaValue: string;
    metaLabel: string;
    highlights: ProgramHighlight[];
    cta: string;
    accent: "dark" | "light";
};

const categoryPrograms: Record<string, Program[]> = {
    "Break Habits": [
        {
            id: "6-day-compass-reset",
            tag: "Decision & Reset",
            title: "6-Day Control",
            description: "Break autopilot, make smoking inconvenient and conscious, and regain control through interruption instead of perfection.",
            metaValue: "₹599",
            metaLabel: "Launch price",
            highlights: [
                { label: "Core Rule", text: "Delay every urge by 10 minutes" },
                { label: "Reset", text: "Throw away cigarettes, lighters, and ashtrays" },
                { label: "Disruption", text: "Change one trigger routine to break the loop" },
                { label: "Urge Protocol", text: "Grounding and light movement while the timer runs" },
            ],
            cta: "Get Early Access",
            accent: "dark",
        },
        {
            id: "90-day-smoke-free-journey",
            tag: "Daily Guided Modules",
            title: "90-Day Quit Smoking",
            description: "A longer journey designed to support lasting change by strengthening awareness, resilience, and consistency over time.",
            metaValue: "₹6,549",
            metaLabel: "Launch price",
            highlights: [
                { label: "Daily Focus", text: "Notice patterns without trying to change everything at once" },
                { label: "Guided Exercise", text: "Short 2–4 minute daily practice" },
                { label: "Journal", text: "Optional prompts for reflection without pressure" },
                { label: "Long-Term Shift", text: "Pattern-level awareness, resilience, and sustained confidence" },
            ],
            cta: "Get Early Access",
            accent: "light",
        },
    ],
    "Restore Balance": [
        {
            id: "14-day-sleep-reset",
            tag: "Reset the Body Clock",
            title: "Sleep Disorder Reset",
            description: "Reset the body clock and nervous system so the brain begins recognizing the signals for sleep again.",
            metaValue: "TBD",
            metaLabel: "Price to be announced",
            highlights: [
                { label: "Morning Signal", text: "Sunlight exposure within 30 minutes of waking" },
                { label: "Calm", text: "Hydration plus 10 cycles of physiological sigh" },
                { label: "Sleep Pressure", text: "Light morning movement to make the body naturally tired at night" },
                { label: "Night Routine", text: "No caffeine after 2 PM and guided sleep meditation before bed" },
            ],
            cta: "Get Early Access",
            accent: "dark",
        },
        {
            id: "21-day-energy-reset",
            tag: "Energy Reset Foundations",
            title: "Energy & Vitality",
            description: "Restore daily energy and mental clarity by rebuilding the body’s natural rhythm through simple daily missions.",
            metaValue: "TBD",
            metaLabel: "Price to be announced",
            highlights: [
                { label: "Foundation", text: "500 ml water within 10 minutes of waking" },
                { label: "Circadian Reset", text: "10–15 minutes of morning sunlight" },
                { label: "Activation", text: "10 minutes of movement plus a light walk" },
                { label: "Recovery", text: "Deep breathing before bed and a fixed sleep time" },
            ],
            cta: "Get Early Access",
            accent: "light",
        },
    ],
    "Build Vitality": [
        {
            id: "mens-vitality-reset-program",
            tag: "Reset & Activation",
            title: "Male Sexual Health",
            description: "Break automatic habits, calm performance anxiety, and activate the muscles that support blood flow and sexual strength.",
            metaValue: "TBD",
            metaLabel: "Price to be announced",
            highlights: [
                { label: "Urge Control", text: "Use CALM when the urge appears and let it pass in 5–10 minutes" },
                { label: "Performance Anxiety", text: "4-2-6 breathing to activate the relaxation response" },
                { label: "Vitality Exercise", text: "Pelvic strength, glute bridges, squats, and a brisk walk" },
                { label: "Recovery", text: "Night routine to support hormones and physical recovery" },
            ],
            cta: "Get Early Access",
            accent: "dark",
        },
        {
            id: "radiance-journey",
            tag: "Rejuvenation Journey",
            title: "Age Reversal",
            description: "Activate the body’s natural rejuvenation process by improving circulation, stimulating facial muscles, and calming the nervous system.",
            metaValue: "TBD",
            metaLabel: "Price to be announced",
            highlights: [
                { label: "Circulation", text: "20-minute relaxed walk to improve blood flow and cellular energy" },
                { label: "Face Exercise", text: "Daily facial muscle activation to support firmness and lift" },
                { label: "Calm", text: "Guided calm session to relax the nervous system and lower cortisol" },
                { label: "Sleep Preparation", text: "Consistent sleep routine to support hormone balance and repair" },
            ],
            cta: "Get Early Access",
            accent: "light",
        },
    ],
};

const categories = ["Break Habits", "Restore Balance", "Build Vitality"];
const CATEGORY_VISIBLE_MS = 20000;



export function ExploreProgramsSection() {
    const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
    const activeCategory = categories[activeCategoryIndex];
    const visiblePrograms = categoryPrograms[activeCategory] ?? categoryPrograms[categories[0]];

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            setActiveCategoryIndex((currentIndex) => (currentIndex + 1) % categories.length);
        }, CATEGORY_VISIBLE_MS);

        return () => window.clearTimeout(timeoutId);
    }, [activeCategoryIndex]);

    return (
        <section className="w-full bg-[#F9F9F9] py-16 md:py-24 overflow-visible">
            <div className="max-w-[1000px] mx-auto px-6 md:px-12">
                <div className="flex flex-col mb-8 md:mb-10 gap-4 text-left md:text-center md:items-center">
                    <div className="space-y-4">
                        <Badge
                            variant="secondary"
                            className="rounded-full px-4 py-1.5 text-xs font-medium tracking-wide border-none bg-[oklch(0.9484_0.0251_149.08)] text-[oklch(0.2475_0.0661_146.79)]"
                        >
                            OUR PROGRAMS
                        </Badge>
                        <h2 className="text-4xl md:text-5xl font-erode font-medium tracking-tighter leading-[1.10] text-black">
                            A plan for your <br />
                            <span className="italic text-[oklch(0.2475_0.0661_146.79)]">personal needs.</span>
                        </h2>
                    </div>
                    <p className="text-lg text-[oklch(0.2475_0.0661_146.79)]/60 font-satoshi max-w-sm leading-relaxed md:mx-auto">
                        Start with a short reset. Continue with <br className="hidden lg:block" />
                        long-term stability if you choose.
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-medium text-[oklch(0.2475_0.0661_146.79)]/70 md:mt-5 md:justify-center md:text-base">
                        {categories.map((category) => (
                            <button
                                key={category}
                                type="button"
                                onClick={() => setActiveCategoryIndex(categories.indexOf(category))}
                                className={cn(
                                    "relative cursor-pointer font-satoshi pb-2 transition-colors",
                                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.2475_0.0661_146.79)] focus-visible:ring-offset-2 rounded-sm",
                                    category === activeCategory
                                        ? "text-[oklch(0.2475_0.0661_146.79)]"
                                        : "text-[oklch(0.2475_0.0661_146.79)]/55"
                                )}
                            >
                                {category}
                                <span className="absolute inset-x-0 bottom-0 h-px bg-[oklch(0.2475_0.0661_146.79)]/20" />
                                {category === activeCategory ? (
                                    <motion.span
                                        key={category}
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: 1 }}
                                        transition={{ duration: CATEGORY_VISIBLE_MS / 1000, ease: "linear" }}
                                        className="absolute inset-x-0 bottom-0 h-px origin-left bg-[oklch(0.2475_0.0661_146.79)]/80"
                                        style={{ transformOrigin: "left center" }}
                                    />
                                ) : null}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    {visiblePrograms.map((program, idx) => (
                        <ProgramCard key={`${activeCategory}-${program.id}`} program={program} index={idx} />
                    ))}
                </div>

                {/* Free Video Consultation CTA - Commented out until live */}
                {/* 
                <div className="mt-16 text-center">
                    <p className="text-lg md:text-xl font-satoshi font-normal text-[oklch(0.2475_0.0661_146.79)]/70">
                        Not sure which path is right for you? <a
                            href="https://calendly.com/your-link"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-[oklch(0.2475_0.0661_146.79)] underline underline-offset-4 hover:text-[oklch(0.2475_0.0661_146.79)]/80 transition-colors"
                        >
                            Book a free video consultation.
                        </a>
                    </p>
                </div>
                */}
            </div>
        </section>
    );
}

function ProgramCard({ program, index }: { program: Program; index: number }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });
    const [hasAppeared, setHasAppeared] = useState(false);
    const isDark = program.accent === "dark";

    useEffect(() => {
        if (isInView) {
            setTimeout(() => setHasAppeared(true), 0);
        }
    }, [isInView]);

    return (
        <div
            ref={ref}
            className={cn(
                "relative group flex flex-col p-8 md:p-10 rounded-3xl overflow-hidden border-none transition-all duration-[800ms] ease-out",
                hasAppeared ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
                isDark
                    ? "bg-[oklch(0.2475_0.0661_146.79)] text-white"
                    : "bg-[oklch(0.9484_0.0251_149.08)] text-[oklch(0.2475_0.0661_146.79)]"
            )}
            style={{ transitionDelay: `${index * 200}ms` }}
        >
            <div className="relative z-10 flex flex-col h-full">
                <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-start">
                        <span className={cn(
                            "inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase",
                            isDark
                                ? "bg-white/10 text-white/70"
                                : "bg-[oklch(0.2475_0.0661_146.79)]/5 text-[oklch(0.2475_0.0661_146.79)]/40"
                        )}>
                            {program.tag}
                        </span>
                        {isDark && <Zap className="size-6 text-white/20" aria-hidden="true" />}
                    </div>
                    <h3 className={cn(
                        "text-2xl md:text-[28px] lg:text-3xl font-erode font-medium tracking-tighter leading-[1.10]",
                        isDark ? "text-white" : "text-[oklch(0.2475_0.0661_146.79)]"
                    )}>
                        {program.title}
                    </h3>
                    <p className={cn(
                        "text-base md:text-lg font-satoshi leading-relaxed",
                        isDark ? "text-white/70" : "text-[oklch(0.2475_0.0661_146.79)]/70"
                    )}>
                        {program.description}
                    </p>
                </div>

                <div className="space-y-4 mb-10 flex-grow">
                    <div className={cn(
                        "h-px w-full mb-6",
                        isDark ? "bg-white/10" : "bg-[oklch(0.2475_0.0661_146.79)]/10"
                    )} />
                    {program.highlights.map((item, i) => (
                        <div key={i} className="flex items-start gap-4 text-sm font-medium">
                            <div className={cn(
                                "flex-shrink-0 size-5 mt-0.5 rounded-full flex items-center justify-center",
                                isDark ? "bg-white/20" : "bg-[oklch(0.2475_0.0661_146.79)]/10"
                            )}>
                                <Check className={cn(
                                    "size-3",
                                    isDark ? "text-white" : "text-[oklch(0.2475_0.0661_146.79)]"
                                )} aria-hidden="true" />
                            </div>
                            <div className="flex flex-col">
                                <span className={cn(
                                    "text-[10px] font-black uppercase tracking-widest leading-none mb-1",
                                    isDark ? "text-white/40" : "text-[oklch(0.2475_0.0661_146.79)]/30"
                                )}>
                                    {item.label}
                                </span>
                                <span className={isDark ? "text-white/90" : "text-[oklch(0.2475_0.0661_146.79)]/80"}>
                                    {item.text}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col items-center mt-auto space-y-4">
                    <div className="flex flex-col items-center gap-1">
                        <div className={cn(
                            "text-4xl font-sans font-bold",
                            isDark ? "text-white" : "text-[oklch(0.2475_0.0661_146.79)]"
                        )}>
                            {program.metaValue}
                        </div>
                        <p className={cn(
                            "text-xs font-satoshi",
                            isDark ? "text-white/60" : "text-[oklch(0.2475_0.0661_146.79)]/60"
                        )}>
                            {program.metaLabel}
                        </p>
                    </div>
                    <Button
                        variant="default"
                        className={cn(
                            "w-fit px-10 h-12 rounded-full font-bold text-base border-none transition-all duration-300",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                            isDark
                                ? "bg-white text-[oklch(0.2475_0.0661_146.79)] hover:bg-white/90 shadow-lg focus-visible:ring-white"
                                : "bg-[oklch(0.2475_0.0661_146.79)] text-white hover:bg-[oklch(0.2475_0.0661_146.79)]/90 shadow-lg focus-visible:ring-[oklch(0.2475_0.0661_146.79)]"
                        )}
                    >
                        {program.cta}
                    </Button>
                </div>
            </div>
            {isDark && (
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors duration-500" />
            )}
        </div>
    );
}
