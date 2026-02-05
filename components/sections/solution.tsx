"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";

// Feature data for cards
const features = [
    {
        index: "01",
        label: "Insight",
        headline: "Pattern Awareness",
        description: "You can't fight what you can't see. We visualize your rhythms so you can predict triggers before they become urges.",
        bullets: [
            { title: "Daily mood, stress & urge check-ins", desc: "Quick, optional logs that reveal your patterns over time." },
            { title: "Trigger mapping", desc: "See when and why urges appear, not just how many." },
            { title: "Weekly insights", desc: "Progress without judgment or comparison." },
            { title: "Pattern awareness without overthinking", desc: "Just notice. No pressure." },
        ],
        imageSrc: "/pointer-1.png",
    },
    {
        index: "02",
        label: "Regulation",
        headline: "Audio Coaching",
        description: "Press play on panic. Guided somatic sessions that calm your nervous system in minutes—no meditation experience required.",
        bullets: [
            { title: "Calm Yourself breathing guides", desc: "4-6 breathing technique to signal safety to your body." },
            { title: "5-4-3-2-1 grounding", desc: "Pulls you out of habit memory into the present moment." },
            { title: "Progressive muscle relaxation", desc: "Tense and release to tell your body \"I don't need to react.\"" },
            { title: "Works during intense urges", desc: "Designed for real moments, not ideal conditions." },
        ],
        imageSrc: "/pointer-2.png",
    },
    {
        index: "03",
        label: "Community",
        headline: "The Panic Button",
        description: "Real-time support for the moments when the pull feels strongest. One tap. Immediate calm.",
        bullets: [
            { title: "10-minute delay timer", desc: "Say \"I'm not deciding now\" and watch the urge peak and fall." },
            { title: "Urge Now protocol", desc: "Structured steps: Breathe → Ground → Move → Wait." },
            { title: "No willpower needed", desc: "Most urges fade within 7-10 minutes. Waiting works." },
            { title: "Works for smoking and alcohol urges", desc: "Same nervous system, same solution." },
        ],
        imageSrc: "/pointer-3(1).png",
    },
];

// Mobile Feature Card Component
function FeatureCard({ feature }: { feature: typeof features[0] }) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="rounded-3xl bg-secondary overflow-hidden">
            {/* Image - Top Half */}
            <div className="p-3 pb-0">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-secondary/50">
                    <Image
                        src={feature.imageSrc}
                        alt={feature.headline}
                        fill
                        className="object-cover"
                    />
                </div>
            </div>

            {/* Content - Bottom Half */}
            <div className="p-6 pt-5">
                {/* Badge */}
                <span className="font-geist-mono text-primary/60 text-xs tracking-widest uppercase mb-3 block">
                    {feature.index} — {feature.label}
                </span>

                {/* Headline */}
                <h3 className="text-2xl md:text-3xl font-erode text-primary mb-3 leading-tight">
                    {feature.headline}
                </h3>

                {/* Description */}
                <p className="text-sm md:text-base text-primary/70 font-satoshi leading-relaxed mb-4">
                    {feature.description}
                </p>

                {/* View More Button */}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center gap-2 text-sm font-satoshi text-primary/80 hover:text-primary transition-colors"
                >
                    <span>{isExpanded ? "View Less" : "View More"}</span>
                    <motion.span
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        ↓
                    </motion.span>
                </button>

                {/* Expandable Bullet Points */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.ul
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-4 space-y-3 overflow-hidden"
                        >
                            {feature.bullets.map((bullet, idx) => (
                                <li key={idx} className="flex items-start gap-3 text-sm text-primary/70 font-satoshi">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 shrink-0" />
                                    <span>
                                        <strong className="text-primary/90">{bullet.title}</strong> — {bullet.desc}
                                    </span>
                                </li>
                            ))}
                        </motion.ul>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

export function SolutionSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: containerRef });

    // Smooth scroll progress for softer landings
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    // -- Animation Sequence (SEQUENTIAL - No Overlap) --

    // PHASE 1: Intro -> Slide 1 (0% - 40%)
    // -------------------------------------
    // Step 1: Subheadline Exit (0% - 10%)
    const introSubheadY = useTransform(smoothProgress, [0, 0.10], ["0vh", "50vh"]);
    const introSubheadOpacity = useTransform(smoothProgress, [0, 0.08], [1, 0]);

    // Step 2: Slide 1 Image Entry (10% - 20%)
    const slide1ImageX = useTransform(smoothProgress, [0.10, 0.20], ["120%", "0%"]);

    // Step 3: Intro Headline Exit (20% - 30%)
    const introHeadlineY = useTransform(smoothProgress, [0.20, 0.30], ["0vh", "-50vh"]);
    const introHeadlineOpacity = useTransform(smoothProgress, [0.20, 0.28], [1, 0]);

    // Step 4: Slide 1 Headline Entry (30% - 40%)
    const slide1HeadlineEntryY = useTransform(smoothProgress, [0.30, 0.40], ["50vh", "0vh"]);
    const slide1HeadlineEntryOpacity = useTransform(smoothProgress, [0.30, 0.38], [0, 1]);

    // PHASE 2: Slide 1 -> Slide 2 (40% - 65%)
    // ---------------------------------------
    // Step 5: Slide 1 Image Exit (40% - 47%)
    const slide1ImageOpacity = useTransform(smoothProgress, [0.40, 0.47], [1, 0]);

    // Step 6: Slide 2 Image Entry (47% - 54%)
    const slide2ImageX = useTransform(smoothProgress, [0.47, 0.54], ["120%", "0%"]);

    // Step 7: Slide 1 Headline Exit (54% - 61%)
    const slide1HeadlineExitY = useTransform(smoothProgress, [0.54, 0.61], ["0vh", "-50vh"]);
    const slide1HeadlineExitOpacity = useTransform(smoothProgress, [0.54, 0.59], [1, 0]);

    // Combined Slide 1 Headline transforms
    const slide1HeadlineCombinedY = useTransform(smoothProgress, (val) => {
        if (val < 0.54) return slide1HeadlineEntryY.get();
        return slide1HeadlineExitY.get();
    });
    const slide1HeadlineOpacity = useTransform(smoothProgress, (val) => {
        if (val < 0.30) return 0;
        if (val < 0.40) return slide1HeadlineEntryOpacity.get();
        if (val < 0.54) return 1;
        if (val < 0.61) return slide1HeadlineExitOpacity.get();
        return 0;
    });

    // Step 8: Slide 2 Headline Entry (61% - 68%)
    const slide2HeadlineEntryY = useTransform(smoothProgress, [0.61, 0.68], ["50vh", "0vh"]);
    const slide2HeadlineEntryOpacity = useTransform(smoothProgress, [0.61, 0.66], [0, 1]);

    // PHASE 3: Slide 2 -> Slide 3 (68% - 93%)
    // ---------------------------------------
    // Step 9: Slide 2 Image Exit (68% - 75%)
    const slide2ImageOpacity = useTransform(smoothProgress, [0.68, 0.75], [1, 0]);

    // Step 10: Slide 3 Image Entry (75% - 82%)
    const slide3ImageX = useTransform(smoothProgress, [0.75, 0.82], ["120%", "0%"]);

    // Step 11: Slide 2 Headline Exit (82% - 89%)
    const slide2HeadlineExitY = useTransform(smoothProgress, [0.82, 0.89], ["0vh", "-50vh"]);
    const slide2HeadlineExitOpacity = useTransform(smoothProgress, [0.82, 0.87], [1, 0]);

    // Combined Slide 2 Headline transforms
    const slide2HeadlineCombinedY = useTransform(smoothProgress, (val) => {
        if (val < 0.82) return slide2HeadlineEntryY.get();
        return slide2HeadlineExitY.get();
    });
    const slide2HeadlineOpacity = useTransform(smoothProgress, (val) => {
        if (val < 0.61) return 0;
        if (val < 0.68) return slide2HeadlineEntryOpacity.get();
        if (val < 0.82) return 1;
        if (val < 0.89) return slide2HeadlineExitOpacity.get();
        return 0;
    });

    // Step 12: Slide 3 Headline Entry (89% - 96%)
    const slide3HeadlineY = useTransform(smoothProgress, [0.89, 0.96], ["50vh", "0vh"]);
    const slide3HeadlineOpacity = useTransform(smoothProgress, [0.89, 0.96], [0, 1]);


    return (
        <>
            {/* ============ MOBILE/TABLET VIEW (below lg) ============ */}
            <section className="lg:hidden bg-primary px-4 py-16 md:px-8 md:py-20">
                {/* Mobile Intro */}
                <div className="max-w-2xl mx-auto text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-secondary/30 bg-secondary/5 text-secondary text-xs uppercase tracking-widest font-satoshi mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                        The Solution
                    </div>
                    <h2 className="text-4xl md:text-5xl font-erode font-medium text-secondary mb-4 leading-tight">
                        The Recovery Toolkit
                    </h2>
                    <p className="text-base md:text-lg text-secondary/70 font-satoshi">
                        A calm, structured approach to navigating urges and building steady change.
                    </p>
                </div>

                {/* Mobile Feature Cards */}
                <div className="max-w-md mx-auto space-y-6">
                    {features.map((feature) => (
                        <FeatureCard key={feature.index} feature={feature} />
                    ))}
                </div>
            </section>

            {/* ============ DESKTOP VIEW (lg and above) ============ */}
            {/* Height increased to 700vh to accommodate 3 slides + intro */}
            <div ref={containerRef} className="hidden lg:block relative h-[700vh] bg-primary">

                {/* Sticky Viewport */}
                <div className="sticky top-24 h-[calc(100vh-6rem)] w-full overflow-hidden flex flex-col items-center justify-center">

                    {/* --- SHARED LAYOUT GRID --- */}
                    <div className="absolute inset-0 z-0 flex flex-col md:flex-row p-8 lg:p-12 xl:p-24 overflow-hidden">

                        {/* LEFT COLUMN: Headlines */}
                        <div className="flex-1 relative flex flex-col justify-start items-start text-left">
                            {/* Intro Headline (Exits UP) */}
                            <motion.div
                                style={{ y: introHeadlineY, opacity: introHeadlineOpacity, zIndex: 10, position: "relative" }}
                            >
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-secondary/30 bg-secondary/5 text-secondary text-xs uppercase tracking-widest font-satoshi mb-6">
                                    <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                                    The Solution
                                </div>
                                <h2 className="text-5xl md:text-5xl lg:text-6xl font-erode font-medium text-secondary mb-8 max-w-4xl leading-[0.9]">
                                    The Recovery <br /> Toolkit
                                </h2>
                                {/* Scroll Cue */}
                                <div className="flex items-center gap-4 text-secondary/60">
                                    <span className="text-xs uppercase tracking-widest font-geist-mono">Scroll to explore</span>
                                    <motion.div
                                        animate={{ x: [0, 8, 0] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                        className="h-px w-12 bg-gradient-to-r from-secondary to-transparent"
                                    />
                                </div>
                            </motion.div>

                            {/* Slide 1 Headline (Enters UP -> Exits UP) */}
                            <motion.div
                                style={{ y: slide1HeadlineCombinedY, opacity: slide1HeadlineOpacity }}
                                className="absolute top-0 left-0 w-full"
                            >
                                <div className="max-w-lg text-left">
                                    <span className="font-geist-mono text-secondary/50 text-sm tracking-widest uppercase mb-4 block">
                                        01 — Insight
                                    </span>
                                    <h3 className="text-4xl md:text-5xl 2xl:text-6xl font-erode text-secondary mb-4 lg:mb-3 xl:mb-6 leading-tight">
                                        Pattern <br /> Awareness
                                    </h3>
                                    <p className="text-base lg:text-sm xl:text-xl text-secondary/80 font-satoshi leading-relaxed mb-4 lg:mb-3 xl:mb-6">
                                        You can't fight what you can't see. We visualize your rhythms so you can predict triggers before they become urges.
                                    </p>
                                    <ul className="hidden xl:block space-y-3 mb-8">
                                        <li className="flex items-start gap-3 text-sm md:text-base 2xl:text-lg text-secondary/70 font-satoshi">
                                            <span className="w-1.5 h-1.5 rounded-full bg-secondary/50 mt-2 shrink-0" />
                                            <span><strong className="text-secondary/90">Daily mood, stress & urge check-ins</strong> — Quick, optional logs that reveal your patterns over time.</span>
                                        </li>
                                        <li className="flex items-start gap-3 text-sm md:text-base 2xl:text-lg text-secondary/70 font-satoshi">
                                            <span className="w-1.5 h-1.5 rounded-full bg-secondary/50 mt-2 shrink-0" />
                                            <span><strong className="text-secondary/90">Trigger mapping</strong> — See when and why urges appear, not just how many.</span>
                                        </li>
                                        <li className="flex items-start gap-3 text-sm md:text-base 2xl:text-lg text-secondary/70 font-satoshi">
                                            <span className="w-1.5 h-1.5 rounded-full bg-secondary/50 mt-2 shrink-0" />
                                            <span><strong className="text-secondary/90">Weekly insights</strong> — Progress without judgment or comparison.</span>
                                        </li>
                                        <li className="flex items-start gap-3 text-sm md:text-base 2xl:text-lg text-secondary/70 font-satoshi">
                                            <span className="w-1.5 h-1.5 rounded-full bg-secondary/50 mt-2 shrink-0" />
                                            <span><strong className="text-secondary/90">Pattern awareness without overthinking</strong> — Just notice. No pressure.</span>
                                        </li>
                                    </ul>
                                    <div className="h-px w-24 bg-secondary/30" />
                                </div>
                            </motion.div>

                            {/* Slide 2 Headline (Enters UP -> Exits UP) */}
                            <motion.div
                                style={{ y: slide2HeadlineCombinedY, opacity: slide2HeadlineOpacity }}
                                className="absolute top-0 left-0 w-full"
                            >
                                <div className="max-w-lg text-left">
                                    <span className="font-geist-mono text-secondary/50 text-sm tracking-widest uppercase mb-4 block">
                                        02 — Regulation
                                    </span>
                                    <h3 className="text-4xl md:text-5xl 2xl:text-6xl font-erode text-secondary mb-4 lg:mb-3 xl:mb-6 leading-tight">
                                        Audio <br /> Coaching
                                    </h3>
                                    <p className="text-base lg:text-sm xl:text-xl text-secondary/80 font-satoshi leading-relaxed mb-4 lg:mb-3 xl:mb-6">
                                        Press play on panic. Guided somatic sessions that calm your nervous system in minutes—no meditation experience required.
                                    </p>
                                    <ul className="hidden xl:block space-y-3 mb-8">
                                        <li className="flex items-start gap-3 text-sm md:text-base 2xl:text-lg text-secondary/70 font-satoshi">
                                            <span className="w-1.5 h-1.5 rounded-full bg-secondary/50 mt-2 shrink-0" />
                                            <span><strong className="text-secondary/90">Calm Yourself breathing guides</strong> — 4-6 breathing technique to signal safety to your body.</span>
                                        </li>
                                        <li className="flex items-start gap-3 text-sm md:text-base 2xl:text-lg text-secondary/70 font-satoshi">
                                            <span className="w-1.5 h-1.5 rounded-full bg-secondary/50 mt-2 shrink-0" />
                                            <span><strong className="text-secondary/90">5-4-3-2-1 grounding</strong> — Pulls you out of habit memory into the present moment.</span>
                                        </li>
                                        <li className="flex items-start gap-3 text-sm md:text-base 2xl:text-lg text-secondary/70 font-satoshi">
                                            <span className="w-1.5 h-1.5 rounded-full bg-secondary/50 mt-2 shrink-0" />
                                            <span><strong className="text-secondary/90">Progressive muscle relaxation</strong> — Tense and release to tell your body "I don't need to react."</span>
                                        </li>
                                        <li className="flex items-start gap-3 text-sm md:text-base 2xl:text-lg text-secondary/70 font-satoshi">
                                            <span className="w-1.5 h-1.5 rounded-full bg-secondary/50 mt-2 shrink-0" />
                                            <span><strong className="text-secondary/90">Works during intense urges</strong> — Designed for real moments, not ideal conditions.</span>
                                        </li>
                                    </ul>
                                    <div className="h-px w-24 bg-secondary/30" />
                                </div>
                            </motion.div>

                            {/* Slide 3 Headline (Enters UP) */}
                            <motion.div
                                style={{ y: slide3HeadlineY, opacity: slide3HeadlineOpacity }}
                                className="absolute top-0 left-0 w-full"
                            >
                                <div className="max-w-lg text-left">
                                    <span className="font-geist-mono text-secondary/50 text-sm tracking-widest uppercase mb-4 block">
                                        03 — Community
                                    </span>
                                    <h3 className="text-4xl md:text-5xl 2xl:text-6xl font-erode text-secondary mb-4 lg:mb-3 xl:mb-6 leading-tight">
                                        The Panic <br /> Button
                                    </h3>
                                    <p className="text-base lg:text-sm xl:text-xl text-secondary/80 font-satoshi leading-relaxed mb-4 lg:mb-3 xl:mb-6">
                                        Real-time support for the moments when the pull feels strongest. One tap. Immediate calm.
                                    </p>
                                    <ul className="hidden xl:block space-y-3 mb-8">
                                        <li className="flex items-start gap-3 text-sm md:text-base 2xl:text-lg text-secondary/70 font-satoshi">
                                            <span className="w-1.5 h-1.5 rounded-full bg-secondary/50 mt-2 shrink-0" />
                                            <span><strong className="text-secondary/90">10-minute delay timer</strong> — Say "I'm not deciding now" and watch the urge peak and fall.</span>
                                        </li>
                                        <li className="flex items-start gap-3 text-sm md:text-base 2xl:text-lg text-secondary/70 font-satoshi">
                                            <span className="w-1.5 h-1.5 rounded-full bg-secondary/50 mt-2 shrink-0" />
                                            <span><strong className="text-secondary/90">Urge Now protocol</strong> — Structured steps: Breathe → Ground → Move → Wait.</span>
                                        </li>
                                        <li className="flex items-start gap-3 text-sm md:text-base 2xl:text-lg text-secondary/70 font-satoshi">
                                            <span className="w-1.5 h-1.5 rounded-full bg-secondary/50 mt-2 shrink-0" />
                                            <span><strong className="text-secondary/90">No willpower needed</strong> — Most urges fade within 7-10 minutes. Waiting works.</span>
                                        </li>
                                        <li className="flex items-start gap-3 text-sm md:text-base 2xl:text-lg text-secondary/70 font-satoshi">
                                            <span className="w-1.5 h-1.5 rounded-full bg-secondary/50 mt-2 shrink-0" />
                                            <span><strong className="text-secondary/90">Works for smoking and alcohol urges</strong> — Same nervous system, same solution.</span>
                                        </li>
                                    </ul>
                                    <div className="h-px w-24 bg-secondary/30" />
                                </div>
                            </motion.div>
                        </div>

                        {/* VERTICAL DIVIDER (Fixed) */}
                        <div className="hidden md:block w-px bg-secondary/30 mx-8 self-stretch z-20" />

                        {/* RIGHT COLUMN: Subheadlines & Images */}
                        <div className="flex-1 relative flex flex-col justify-center items-center">

                            {/* Intro Subheadline (Exits DOWN) - Positioned absolutely bottom-left of right col */}
                            <motion.div
                                style={{ y: introSubheadY, opacity: introSubheadOpacity }}
                                className="absolute bottom-16 left-0 right-0 z-10"
                            >
                                <p className="text-xl md:text-2xl text-secondary/80 font-satoshi max-w-xl leading-relaxed">
                                    More than a subscription - it's a complete toolkit for navigating urges, calming your nervous system, and building steady change through structured daily programs.
                                </p>
                            </motion.div>

                            {/* Shared Image Container - Fixed size, centered */}
                            <div className="relative w-[95%] aspect-square">

                                {/* Slide 1 Image (Enters RIGHT -> Fades Out) */}
                                <motion.div
                                    style={{ x: slide1ImageX, opacity: slide1ImageOpacity }}
                                    className="absolute inset-0 z-20 bg-black/5 overflow-hidden shadow-2xl rounded-sm"
                                >
                                    <Image
                                        src="/pointer-1.png"
                                        alt="Pattern Awareness"
                                        fill
                                        className="object-cover"
                                    />
                                </motion.div>

                                {/* Slide 2 Image (Enters RIGHT -> Fades Out) */}
                                <motion.div
                                    style={{ x: slide2ImageX, opacity: slide2ImageOpacity }}
                                    className="absolute inset-0 z-30 bg-black/5 overflow-hidden shadow-2xl rounded-sm"
                                >
                                    <Image
                                        src="/pointer-2.png"
                                        alt="Audio Coaching Interface"
                                        fill
                                        className="object-cover"
                                    />
                                </motion.div>

                                {/* Slide 3 Image (Enters RIGHT) - Placeholder */}
                                <motion.div
                                    style={{ x: slide3ImageX }}
                                    className="absolute inset-0 z-40 bg-black/5 overflow-hidden shadow-2xl rounded-sm"
                                >
                                    <Image
                                        src="/pointer-3(1).png"
                                        alt="Peer Support Community"
                                        fill
                                        className="object-cover"
                                    />
                                </motion.div>

                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}
