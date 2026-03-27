"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import Image from "next/image";

import { ArrowDown } from "lucide-react";

type Feature = {
    index: string;
    label: string;
    headline: string;
    desktopLines: [string, string?];
    description: string;
    bullets: {
        title: string;
        desc: string;
    }[];
    imageSrc: string;
    imageAlt: string;
};

const sectionIntro = {
    badge: "How It Works",
    title: "Recovery Compass keeps the process simple.",
    mobileBody: "Choose the support that fits your goal, follow calm daily guidance, and build a healthier rhythm without pressure.",
    desktopLead: "From check-ins to guided routines, every part of the app is designed to help you understand yourself more clearly, respond more calmly, and stay consistent for longer.",
    scrollCue: "Keep scrolling to explore",
};

const features: Feature[] = [
    {
        index: "01",
        label: "Awareness",
        headline: "See What Shapes Your Day",
        desktopLines: ["See What", "Shapes Your Day"],
        description: "Brief check-ins surface the routines, triggers, and energy shifts influencing your day, so support feels timely instead of generic.",
        bullets: [
            { title: "Daily check-ins", desc: "Quick reflections on sleep, stress, energy, and habits." },
            { title: "Trigger mapping", desc: "Understand what tends to pull you off course." },
            { title: "Trend snapshots", desc: "Notice recurring patterns without obsessing over data." },
            { title: "Gentle reflection", desc: "Observe progress with clarity instead of judgment." },
        ],
        imageSrc: "/pointer-1.png",
        imageAlt: "Daily awareness and check-in interface",
    },
    {
        index: "02",
        label: "Regulation",
        headline: "Return to Calm",
        desktopLines: ["Return", "to Calm"],
        description: "Guided audio, breathwork, and grounding routines help settle the body when stress is high, sleep is off, or the day feels noisy.",
        bullets: [
            { title: "Audio sessions", desc: "Short guided support for tense or unsteady moments." },
            { title: "Breathing patterns", desc: "Regulate first, then decide what comes next." },
            { title: "Grounding routines", desc: "Shift attention from spiraling thoughts back to the present." },
            { title: "Restorative pauses", desc: "Support that fits real life, not perfect conditions." },
        ],
        imageSrc: "/pointer-2.png",
        imageAlt: "Guided regulation and grounding audio tools",
    },
    {
        index: "03",
        label: "Momentum",
        headline: "Build a Better Rhythm",
        desktopLines: ["Build a", "Better Rhythm"],
        description: "Each programme turns change into a manageable daily rhythm, so healthier choices feel repeatable instead of overwhelming.",
        bullets: [
            { title: "Daily actions", desc: "Simple steps that fit around real schedules." },
            { title: "Routine anchors", desc: "Gentle cues for mornings, evenings, and difficult moments." },
            { title: "Flexible progress", desc: "One missed day does not cancel momentum." },
            { title: "Confidence through repetition", desc: "Self-trust grows by returning, not by being perfect." },
        ],
        imageSrc: "/pointer-3(1).png",
        imageAlt: "Structured daily support and routines",
    },
];

function FeatureBullets({
    bullets,
    className,
    itemClassName,
    strongClassName,
}: {
    bullets: Feature["bullets"];
    className: string;
    itemClassName: string;
    strongClassName: string;
}) {
    return (
        <ul className={className}>
            {bullets.map((bullet) => (
                <li key={bullet.title} className={itemClassName}>
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-60" />
                    <span>
                        <strong className={strongClassName}>{bullet.title}</strong> — {bullet.desc}
                    </span>
                </li>
            ))}
        </ul>
    );
}

function FeatureCard({ feature }: { feature: Feature }) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="overflow-hidden rounded-3xl bg-secondary">
            <div className="p-3 pb-0">
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-secondary/50">
                    <Image
                        src={feature.imageSrc}
                        alt={feature.imageAlt}
                        fill
                        className="object-cover"
                    />
                </div>
            </div>

            <div className="p-6 pt-5">
                <span className="mb-3 block text-xs uppercase tracking-widest text-primary/60 font-geist-mono">
                    {feature.index} — {feature.label}
                </span>

                <h3 className="mb-3 text-2xl font-erode font-medium leading-[1.10] tracking-tighter text-primary md:text-3xl">
                    {feature.headline}
                </h3>

                <p className="mb-4 text-sm font-satoshi leading-relaxed text-primary/70 md:text-base">
                    {feature.description}
                </p>

                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center gap-2 text-sm font-satoshi text-primary/80 transition-colors hover:text-primary"
                >
                    <span>{isExpanded ? "View Less" : "View More"}</span>
                    <motion.span
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        ↓
                    </motion.span>
                </button>

                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                        >
                            <FeatureBullets
                                bullets={feature.bullets}
                                className="mt-4 space-y-3"
                                itemClassName="flex items-start gap-3 text-sm font-satoshi text-primary/70"
                                strongClassName="text-primary/90"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

export function SolutionSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: containerRef });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });

    const introSubheadY = useTransform(smoothProgress, [0, 0.10], ["0vh", "50vh"]);
    const introSubheadOpacity = useTransform(smoothProgress, [0, 0.08], [1, 0]);

    const slide1ImageX = useTransform(smoothProgress, [0.10, 0.20], ["120%", "0%"]);
    const introHeadlineY = useTransform(smoothProgress, [0.20, 0.30], ["0vh", "-50vh"]);
    const introHeadlineOpacity = useTransform(smoothProgress, [0.20, 0.28], [1, 0]);
    const slide1HeadlineEntryY = useTransform(smoothProgress, [0.30, 0.40], ["50vh", "0vh"]);
    const slide1HeadlineEntryOpacity = useTransform(smoothProgress, [0.30, 0.38], [0, 1]);

    const slide1ImageOpacity = useTransform(smoothProgress, [0.40, 0.47], [1, 0]);
    const slide2ImageX = useTransform(smoothProgress, [0.47, 0.54], ["120%", "0%"]);
    const slide1HeadlineExitY = useTransform(smoothProgress, [0.54, 0.61], ["0vh", "-50vh"]);
    const slide1HeadlineExitOpacity = useTransform(smoothProgress, [0.54, 0.59], [1, 0]);

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

    const slide2HeadlineEntryY = useTransform(smoothProgress, [0.61, 0.68], ["50vh", "0vh"]);
    const slide2HeadlineEntryOpacity = useTransform(smoothProgress, [0.61, 0.66], [0, 1]);

    const slide2ImageOpacity = useTransform(smoothProgress, [0.68, 0.75], [1, 0]);
    const slide3ImageX = useTransform(smoothProgress, [0.75, 0.82], ["120%", "0%"]);
    const slide2HeadlineExitY = useTransform(smoothProgress, [0.82, 0.89], ["0vh", "-50vh"]);
    const slide2HeadlineExitOpacity = useTransform(smoothProgress, [0.82, 0.87], [1, 0]);

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

    const slide3HeadlineY = useTransform(smoothProgress, [0.89, 0.96], ["50vh", "0vh"]);
    const slide3HeadlineOpacity = useTransform(smoothProgress, [0.89, 0.96], [0, 1]);

    const headlineAnimations = [
        { y: slide1HeadlineCombinedY, opacity: slide1HeadlineOpacity },
        { y: slide2HeadlineCombinedY, opacity: slide2HeadlineOpacity },
        { y: slide3HeadlineY, opacity: slide3HeadlineOpacity },
    ];

    const imageAnimations = [
        { x: slide1ImageX, opacity: slide1ImageOpacity },
        { x: slide2ImageX, opacity: slide2ImageOpacity },
        { x: slide3ImageX },
    ];

    const imageLayers = ["z-20", "z-30", "z-40"];

    return (
        <>
            <section className="bg-primary px-4 py-16 md:px-8 md:py-24 lg:hidden">
                <div className="mx-auto mb-12 max-w-2xl text-center">
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/5 px-3 py-1 text-xs uppercase tracking-widest text-secondary font-satoshi">
                        <span className="h-1.5 w-1.5 rounded-full bg-secondary animate-pulse" />
                        {sectionIntro.badge}
                    </div>
                    <h2 className="mb-4 text-4xl font-erode font-medium leading-[1.10] tracking-tighter text-secondary md:text-5xl">
                        {sectionIntro.title}
                    </h2>
                    <p className="text-base font-satoshi text-secondary/70 md:text-lg">
                        {sectionIntro.mobileBody}
                    </p>
                </div>

                <div className="mx-auto max-w-md space-y-6">
                    {features.map((feature) => (
                        <FeatureCard key={feature.index} feature={feature} />
                    ))}
                </div>
            </section>

            <div ref={containerRef} className="relative hidden h-[700vh] bg-primary lg:block">
                <div className="sticky top-24 flex h-[calc(100vh-6rem)] w-full items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 z-0 flex flex-col items-center overflow-hidden p-8 md:flex-row lg:p-12 xl:p-24">
                        <div className="relative flex h-[clamp(28rem,72vh,44rem)] flex-1 flex-col items-start justify-start text-left">
                            <motion.div
                                style={{ y: introHeadlineY, opacity: introHeadlineOpacity, zIndex: 10, position: "relative" }}
                            >
                                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/5 px-3 py-1 text-xs uppercase tracking-widest text-secondary font-satoshi">
                                    <span className="h-1.5 w-1.5 rounded-full bg-secondary animate-pulse" />
                                    {sectionIntro.badge}
                                </div>
                                <h2 className="mb-8 max-w-4xl text-5xl font-erode font-medium leading-[1.10] tracking-tighter text-secondary md:text-5xl lg:text-6xl">
                                    {sectionIntro.title}
                                </h2>
                                <div className="flex items-center gap-2 text-secondary/60">
                                    <span className="text-xs uppercase tracking-widest font-geist-mono">
                                        {sectionIntro.scrollCue}
                                    </span>
                                    <ArrowDown className="h-3 w-3 animate-bounce" />
                                </div>
                            </motion.div>

                            {features.map((feature, index) => (
                                <motion.div
                                    key={feature.index}
                                    style={headlineAnimations[index]}
                                    className="absolute left-0 top-0 w-full"
                                >
                                    <div className="max-w-lg text-left">
                                        <span className="mb-4 block text-sm uppercase tracking-widest text-secondary/50 font-geist-mono">
                                            {feature.index} — {feature.label}
                                        </span>
                                        <h3 className="mb-4 text-4xl font-erode font-medium leading-[1.10] tracking-tighter text-secondary md:text-5xl 2xl:text-6xl lg:mb-3 xl:mb-6">
                                            <span className="block">{feature.desktopLines[0]}</span>
                                            {feature.desktopLines[1] ? <span className="block">{feature.desktopLines[1]}</span> : null}
                                        </h3>
                                        <p className="mb-4 text-base font-satoshi leading-relaxed text-secondary/80 lg:text-sm lg:mb-3 xl:mb-6 xl:text-xl">
                                            {feature.description}
                                        </p>
                                        <FeatureBullets
                                            bullets={feature.bullets}
                                            className="mb-8 hidden space-y-3 lg:block"
                                            itemClassName="flex items-start gap-3 text-sm font-satoshi text-secondary/70 md:text-base 2xl:text-lg"
                                            strongClassName="text-secondary/90"
                                        />
                                        <div className="h-px w-24 bg-secondary/30" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="z-20 mx-8 hidden h-[clamp(28rem,72vh,44rem)] w-px self-center bg-secondary/30 md:block" />

                        <div className="relative flex h-[clamp(28rem,72vh,44rem)] flex-1 flex-col items-center justify-center">
                            <motion.div
                                style={{ y: introSubheadY, opacity: introSubheadOpacity }}
                                className="absolute bottom-16 left-0 right-0 z-10"
                            >
                                <p className="max-w-xl text-xl font-satoshi leading-relaxed text-secondary/80 md:text-2xl">
                                    {sectionIntro.desktopLead}
                                </p>
                            </motion.div>

                            <div className="relative h-full w-[95%]">
                                {features.map((feature, index) => (
                                    <motion.div
                                        key={feature.index}
                                        style={imageAnimations[index]}
                                        className={`absolute inset-0 overflow-hidden rounded-sm bg-black/5 shadow-2xl ${imageLayers[index]}`}
                                    >
                                        <Image
                                            src={feature.imageSrc}
                                            alt={feature.imageAlt}
                                            fill
                                            className="object-cover"
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
