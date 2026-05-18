'use client'

import { motion, useInView } from "framer-motion";
import { Check, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/lib/context/cart-context";
import { useUser } from "@/lib/context/user-context";

type ProgramHighlight = {
    label: string;
    text: string;
};

type ProgramArticle = {
    subtitle: string;
    whoIsItFor: string;
    curriculumOverview: string;
    dailyRhythm: string;
};

export type Program = {
    id: string;
    tag: string;
    title: string;
    cardDescription: string;
    article: ProgramArticle;
    facts: string[];
    metaValue: string;
    metaLabel: string;
    highlights: ProgramHighlight[];
    accent: "dark" | "light";
};

export const categoryPrograms: Record<string, Program[]> = {
    "Break Habits": [
        {
            id: "6-day-compass-reset",
            tag: "Decision & Reset",
            title: "6-Day Control",
            cardDescription: "Break autopilot, make smoking inconvenient and conscious, and regain control through interruption instead of perfection.",
            article: {
                subtitle: "The bridge between intention and action.",
                whoIsItFor: "Designed for those who feel trapped in an automatic, unconscious smoking pattern and need a structured, low-pressure way to prove to themselves that they are in control.",
                curriculumOverview: "Six days of progressive behavioral disruption using urge delay, trigger removal, routine changes, grounding, and reflection.",
                dailyRhythm: "Each day gives one clear interruption task, one trigger-level action, and one reflection so the habit becomes conscious before it becomes negotiable."
            },
            facts: ["6 days", "2 phases", "10-12 min/day"],
            metaValue: "₹599",
            metaLabel: "Launch price",
            highlights: [
                { label: "Core Rule", text: "Delay every urge by 10 minutes" },
                { label: "Reset", text: "Throw away cigarettes, lighters, and ashtrays" },
                { label: "Disruption", text: "Change one trigger routine to break the loop" },
                { label: "Urge Protocol", text: "Grounding and light movement while the timer runs" },
            ],
            accent: "dark",
        },
        {
            id: "90-day-smoke-free-journey",
            tag: "Daily Guided Modules",
            title: "90-Day Smoking Reset",
            cardDescription: "A 90-day reset for pattern recognition, emotional steadiness, low-pressure journaling, and long-term smoking recovery.",
            article: {
                subtitle: "Rewiring the deeply ingrained neural pathways.",
                whoIsItFor: "For those ready to commit to long-term behavioral change, seeking daily guidance to help stabilize their nervous system during the crucial 3-month rewiring phase.",
                curriculumOverview: "Daily guided modules focused on pattern recognition, resilience building, optional low-pressure journaling, and long-term stabilization.",
                dailyRhythm: "Each day combines a short guided practice, a pattern-awareness prompt, and a journal cue to keep the reset steady over 90 days."
            },
            facts: ["90 days", "4 phases", "About 7 min/day", "Audio-led"],
            metaValue: "₹5,999",
            metaLabel: "Launch price",
            highlights: [
                { label: "Daily Focus", text: "Notice patterns without trying to change everything at once" },
                { label: "Guided Exercise", text: "Short 2–4 minute daily practice" },
                { label: "Journal", text: "Optional prompts for reflection without pressure" },
                { label: "Long-Term Shift", text: "Pattern-level awareness, resilience, and sustained confidence" },
            ],
            accent: "light",
        },
    ],
    "Restore Balance": [
        {
            id: "21-day-deep-sleep-reset",
            tag: "Reset the Body Clock",
            title: "21-Day Deep Sleep Reset",
            cardDescription: "A 21-day sleep protocol that rebuilds morning light, caffeine cut-off, breathing, downshift, and sleep-prep cues.",
            article: {
                subtitle: "Calming the hyperactive nervous system.",
                whoIsItFor: "For those caught in the frustrating cycle of waking up exhausted, feeling wired all day, and lying awake at night.",
                curriculumOverview: "Sunlight protocols, caffeine timing, physiological sigh techniques, evening downshifts, and guided sleep audio.",
                dailyRhythm: "Each day builds sleep pressure from morning light and movement, then narrows the evening toward breathing, wind-down, and sleep preparation."
            },
            facts: ["21 days", "3 phases", "13-21 min/day", "Includes sleep audio"],
            metaValue: "₹2,599",
            metaLabel: "Launch price",
            highlights: [
                { label: "Morning Signal", text: "Sunlight exposure within 30 minutes of waking" },
                { label: "Breathing", text: "Hydration plus 10 cycles of physiological sigh" },
                { label: "Sleep Pressure", text: "Light morning movement to make the body naturally tired at night" },
                { label: "Night Routine", text: "No caffeine after 2 PM and guided sleep meditation before bed" },
            ],
            accent: "dark",
        },
        {
            id: "14-day-energy-restore",
            tag: "Energy Reset Foundations",
            title: "14-Day Energy Restore",
            cardDescription: "A 14-day physical rhythm reset for hydration, sunlight, cold activation, movement, pressure points, and evening reflection.",
            article: {
                subtitle: "Reclaiming your natural momentum.",
                whoIsItFor: "For individuals feeling chronically sluggish, dealing with mid-afternoon slumps, or struggling to find the physical motivation to accomplish daily goals.",
                curriculumOverview: "Hydration, light exposure, cold activation, full-body movement, pressure-point work, and evening reflection.",
                dailyRhythm: "Each day starts with water and light, adds manageable activation, and closes with recovery cues that make energy more predictable."
            },
            facts: ["14 days", "2 phases", "13-19 min/day", "Movement-led"],
            metaValue: "₹1,499",
            metaLabel: "Launch price",
            highlights: [
                { label: "Foundation", text: "500 ml water within 10 minutes of waking" },
                { label: "Circadian Reset", text: "10–15 minutes of morning sunlight" },
                { label: "Activation", text: "10 minutes of movement plus a light walk" },
                { label: "Recovery", text: "Deep breathing before bed and a fixed sleep time" },
            ],
            accent: "light",
        },
    ],
    "Build Vitality": [
        {
            id: "mens-vitality-reset-program",
            tag: "Reset & Activation",
            title: "30-Day Men's Vitality Reset",
            cardDescription: "Break automatic habits, calm performance anxiety, and activate the muscles that support blood flow and sexual strength.",
            article: {
                subtitle: "Physical activation and psychological calm.",
                whoIsItFor: "Men seeking to overcome performance anxiety, break negative compulsive habits, and restore physical confidence through natural regulation.",
                curriculumOverview: "Pelvic strength work, glute bridges, squats, brisk walking, 4-2-6 breathing, and recovery-focused night routines.",
                dailyRhythm: "Each day pairs a physical activation block with a breathing reset and recovery cue, so confidence is trained through repeatable actions."
            },
            facts: ["30 days", "3 phases", "12-20 min/day", "Breathing + strength"],
            metaValue: "₹4,999",
            metaLabel: "Launch price",
            highlights: [
                { label: "Urge Control", text: "Use a breathing reset when the urge appears and let it pass in 5-10 minutes" },
                { label: "Performance Anxiety", text: "4-2-6 breathing to activate the relaxation response" },
                { label: "Vitality Exercise", text: "Pelvic strength, glute bridges, squats, and a brisk walk" },
                { label: "Recovery", text: "Night routine to support hormones and physical recovery" },
            ],
            accent: "dark",
        },
        {
            id: "radiance-journey",
            tag: "Rejuvenation Journey",
            title: "90-Day Biohacking Reset",
            cardDescription: "A 90-day longevity protocol for relaxed walking, facial activation, regulation practices, sleep prep, and recovery routines.",
            article: {
                subtitle: "Cellular renewal through rhythm and blood flow.",
                whoIsItFor: "For those looking to move beyond superficial skincare treatments into deep, systemic lifestyle restoration for lasting vitality and appearance.",
                curriculumOverview: "Relaxed walking, facial activation, nervous-system regulation, sleep preparation, and recovery routines.",
                dailyRhythm: "Each day combines circulation, facial work, regulation, and sleep preparation so the protocol stays physical, visible, and repeatable."
            },
            facts: ["90 days", "4 phases", "25-30 min/day", "Facial + walking routines"],
            metaValue: "₹6,999",
            metaLabel: "Launch price",
            highlights: [
                { label: "Circulation", text: "20-minute relaxed walk to improve blood flow and cellular energy" },
                { label: "Face Exercise", text: "Daily facial muscle activation to support firmness and lift" },
                { label: "Regulation", text: "Guided calming practice to relax the nervous system and lower cortisol" },
                { label: "Sleep Preparation", text: "Consistent sleep routine to support hormone balance and repair" },
            ],
            accent: "light",
        },
    ],
};

export const allPrograms = Object.values(categoryPrograms).flat();

const categories = ["Break Habits", "Restore Balance", "Build Vitality"];
const CATEGORY_VISIBLE_MS = 20000;



export function ExploreProgramsSection() {
    const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    
    const activeCategory = categories[activeCategoryIndex];
    const visiblePrograms = categoryPrograms[activeCategory] ?? categoryPrograms[categories[0]];

    useEffect(() => {
        if (isPaused) return;
        const timeoutId = window.setTimeout(() => {
            setActiveCategoryIndex((currentIndex) => (currentIndex + 1) % categories.length);
        }, CATEGORY_VISIBLE_MS);

        return () => window.clearTimeout(timeoutId);
    }, [activeCategoryIndex, isPaused]);

    return (
        <section id="programs" className="w-full bg-[#F9F9F9] py-16 md:py-24 overflow-visible">
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
                            Choose the program <br />
                            <span className="italic text-[oklch(0.2475_0.0661_146.79)]">that fits.</span>
                        </h2>
                    </div>
                    <p className="text-lg text-[oklch(0.2475_0.0661_146.79)]/60 font-satoshi max-w-sm leading-relaxed md:mx-auto">
                        Compare the structure, time, and daily rhythm before you choose.
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-medium text-[oklch(0.2475_0.0661_146.79)]/70 md:mt-5 md:justify-center md:text-base">
                        {categories.map((category) => (
                            <button
                                key={category}
                                type="button"
                                onClick={() => {
                                    setActiveCategoryIndex(categories.indexOf(category));
                                    setIsPaused(true); // User took manual control, stop auto-cycling
                                }}
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

                <div 
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    {visiblePrograms.map((program, idx) => (
                        <ProgramCard 
                            key={`${activeCategory}-${program.id}`} 
                            program={program} 
                            index={idx} 
                            onDrawerStateChange={(isOpen) => {
                                if (isOpen) setIsPaused(true);
                            }}
                        />
                    ))}
                </div>

                {/* Free Video Consultation CTA */}
                <div className="mt-16 text-center">
                    <p className="text-lg md:text-xl font-satoshi font-normal text-[oklch(0.2475_0.0661_146.79)]/70">
                        Not sure which program is right for you? <a
                            href="https://calendly.com/anjan-recoverycompass/30min"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-[oklch(0.2475_0.0661_146.79)] underline underline-offset-4 hover:text-[oklch(0.2475_0.0661_146.79)]/80 transition-colors"
                        >
                            Book a free consultation.
                        </a>
                    </p>
                </div>
            </div>
        </section>
    );
}

function ProgramCard({ program, index, onDrawerStateChange }: { program: Program; index: number; onDrawerStateChange?: (isOpen: boolean) => void }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });
    const [hasAppeared, setHasAppeared] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    
    // Notify parent when drawer state changes so it doesn't cycle and kill the UI
    useEffect(() => {
        if (onDrawerStateChange) {
            onDrawerStateChange(isDrawerOpen);
        }
    }, [isDrawerOpen, onDrawerStateChange]);
    const isDark = program.accent === "dark";
    const { addItem, removeItem, isItemInCart } = useCart();
    const { ownedPrograms } = useUser();
    
    const inCart = isItemInCart(program.id);
    const isOwned = ownedPrograms.includes(program.id);

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
                        {program.cardDescription}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {program.facts.map((fact) => (
                            <span
                                key={fact}
                                className={cn(
                                    "rounded-full px-3 py-1 text-[11px] font-bold tracking-wide",
                                    isDark
                                        ? "bg-white/10 text-white/70"
                                        : "bg-white/70 text-[oklch(0.2475_0.0661_146.79)]/60"
                                )}
                            >
                                {fact}
                            </span>
                        ))}
                    </div>
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
                    
                    <div className="flex flex-col items-center w-full gap-3 mt-2">
                        {isOwned ? (
                            <Button
                                disabled
                                className={cn(
                                    "w-full md:w-fit px-10 h-12 rounded-full font-bold text-base border-none transition-all duration-300 opacity-100",
                                    isDark ? "bg-white/10 text-white/50" : "bg-[oklch(0.2475_0.0661_146.79)]/10 text-[oklch(0.2475_0.0661_146.79)]/50"
                                )}
                            >
                                <Check className="size-4 mr-2" /> Owned
                            </Button>
                        ) : (
                            <Button
                                variant="default"
                                onClick={() => {
                                    if (inCart) {
                                        removeItem(program.id);
                                    } else {
                                        addItem({
                                            id: program.id,
                                            title: program.title,
                                            price: program.metaValue === "TBD" ? null : parseInt(program.metaValue.replace(/[^0-9]/g, '')),
                                            tag: program.tag
                                        });
                                    }
                                }}
                                className={cn(
                                    "w-full md:w-fit px-10 h-12 rounded-full font-bold text-base border-none transition-all duration-300",
                                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                                    inCart 
                                        ? isDark ? "bg-white/10 text-white flex gap-2 items-center hover:bg-white/20" : "bg-[oklch(0.2475_0.0661_146.79)]/10 text-[oklch(0.2475_0.0661_146.79)] flex gap-2 items-center hover:bg-[oklch(0.2475_0.0661_146.79)]/20"
                                        : isDark ? "bg-white text-[oklch(0.2475_0.0661_146.79)] hover:bg-white/90 shadow-lg focus-visible:ring-white"
                                               : "bg-[oklch(0.2475_0.0661_146.79)] text-white hover:bg-[oklch(0.2475_0.0661_146.79)]/90 shadow-lg focus-visible:ring-[oklch(0.2475_0.0661_146.79)]"
                                )}
                            >
                                {inCart ? (
                                    <>
                                        <Check className="size-4" /> Added to Plan
                                    </>
                                ) : (
                                    "Add to Plan"
                                )}
                            </Button>
                        )}
                        <button
                            onClick={() => setIsDrawerOpen(true)}
                            className={cn(
                                "text-sm underline underline-offset-4 font-medium transition-opacity hover:opacity-100",
                                isDark ? "text-white/60 hover:text-white" : "text-[oklch(0.2475_0.0661_146.79)]/60 hover:text-[oklch(0.2475_0.0661_146.79)]"
                            )}
                        >
                            Know More
                        </button>
                    </div>
                </div>
            </div>
            {isDark && (
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors duration-500 pointer-events-none" />
            )}

            {/* Program Info Drawer */}
            <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <SheetContent side="right" className="w-full sm:max-w-lg bg-[oklch(0.9484_0.0251_149.08)] text-[oklch(0.2475_0.0661_146.79)] border-l border-[oklch(0.2475_0.0661_146.79)]/10 p-0 flex flex-col gap-0 shadow-2xl h-full max-h-screen overflow-hidden">
                    <div className="flex-1 overflow-y-auto px-6 md:px-10 pb-32 overscroll-contain" data-lenis-prevent="true">
                        <SheetHeader className="mt-12 mb-8 text-left space-y-4">
                            <span className="inline-block px-4 py-1.5 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase bg-[oklch(0.2475_0.0661_146.79)]/10 text-[oklch(0.2475_0.0661_146.79)]/80 w-fit">
                                {program.tag}
                            </span>
                            <SheetTitle className="font-erode text-4xl md:text-5xl text-[oklch(0.2475_0.0661_146.79)] tracking-tight leading-[1.05]">
                                {program.title}
                            </SheetTitle>
                            <div className="flex items-end gap-3 mt-4">
                                <div className="text-3xl font-sans font-bold">
                                    {program.metaValue}
                                </div>
                                <span className="text-sm font-medium opacity-60 mb-1">{program.metaLabel}</span>
                            </div>
                        </SheetHeader>

                        <div className="w-full h-px bg-[oklch(0.2475_0.0661_146.79)]/10 my-8" />

                        <div className="space-y-12 font-satoshi">
                            {/* Subtitle / Hook */}
                            <div className="space-y-4">
                                <p className="text-[oklch(0.2475_0.0661_146.79)] font-medium text-xl leading-relaxed italic font-erode">
                                    &ldquo;{program.article.subtitle}&rdquo;
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {program.facts.map((fact) => (
                                        <span
                                            key={fact}
                                            className="rounded-full bg-white/70 px-3 py-1 text-[11px] font-bold tracking-wide text-[oklch(0.2475_0.0661_146.79)]/60"
                                        >
                                            {fact}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Who is it for */}
                            <div className="space-y-4 border-l-2 border-[oklch(0.2475_0.0661_146.79)]/20 pl-4 my-8">
                                <h4 className="font-bold text-sm tracking-widest uppercase opacity-50 mb-2">Who is this for?</h4>
                                <p className="text-[oklch(0.2475_0.0661_146.79)]/90 leading-relaxed font-medium">
                                    {program.article.whoIsItFor}
                                </p>
                            </div>

                            {/* Curriculum Overview */}
                            <div className="space-y-6">
                                <h4 className="font-bold text-sm tracking-widest uppercase opacity-50 mb-3">Inside the program</h4>
                                <p className="text-[oklch(0.2475_0.0661_146.79)]/80 leading-relaxed text-base mb-6">
                                    {program.article.curriculumOverview}
                                </p>
                                <p className="text-[oklch(0.2475_0.0661_146.79)]/90 leading-relaxed text-base font-medium">
                                    {program.article.dailyRhythm}
                                </p>
                                
                                <div className="space-y-3">
                                    {program.highlights.map((item, i) => (
                                        <div key={i} className="flex gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-[oklch(0.2475_0.0661_146.79)]/5">
                                            <div className="flex-shrink-0 size-6 mt-0.5 rounded-full bg-[oklch(0.2475_0.0661_146.79)]/10 flex items-center justify-center">
                                                <Check className="size-3 text-[oklch(0.2475_0.0661_146.79)]" />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] font-black uppercase tracking-widest leading-none text-[oklch(0.2475_0.0661_146.79)]/50">
                                                    {item.label}
                                                </span>
                                                <span className="text-[oklch(0.2475_0.0661_146.79)]/90 font-medium text-sm leading-snug">
                                                    {item.text}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sticky Bottom Action Bar */}
                    <div className="absolute flex flex-col items-center justify-center bottom-0 w-full p-6 bg-gradient-to-t from-[oklch(0.9484_0.0251_149.08)] via-[oklch(0.9484_0.0251_149.08)] to-transparent pt-12 border-t border-transparent">
                        {isOwned ? (
                            <Button
                                disabled
                                className="w-full h-14 rounded-full font-bold text-lg border-none opacity-50 bg-[oklch(0.2475_0.0661_146.79)] text-white"
                            >
                                <Check className="size-5 mr-2" /> Program Owned
                            </Button>
                        ) : (
                            <Button
                                variant="default"
                                onClick={() => {
                                    addItem({
                                        id: program.id,
                                        title: program.title,
                                        price: program.metaValue === "TBD" ? null : parseInt(program.metaValue.replace(/[^0-9]/g, '')),
                                        tag: program.tag
                                    });
                                    setIsDrawerOpen(false);
                                }}
                                className="w-full h-14 rounded-full font-bold text-lg border-none transition-transform hover:scale-[0.98] active:scale-95 bg-[oklch(0.2475_0.0661_146.79)] text-white shadow-xl"
                            >
                                Add to My Plan
                            </Button>
                        )}
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}
