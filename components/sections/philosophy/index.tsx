"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

// Visuals
import { NeuralPattern } from "./neural-pattern";
import { WaveRegulation } from "./wave-regulation";
import { DataInsight } from "./data-insight";
import { StructurePath } from "./structure-path";

const features = [
    {
        id: "neuroplasticity",
        title: "Better than willpower.",
        description: "Willpower runs out. We use neuroplasticity science to help you rewire how your brain reacts to nicotine triggers naturally.",
        Visual: NeuralPattern,
        duration: 14000,
    },
    {
        id: "regulation",
        title: "Regulate, don't resist.",
        description: "You can't fight a nicotine craving. We give you tools to calm your nervous system so the urge loses its power.",
        Visual: WaveRegulation,
        duration: 8000, // Matched to requested 8s internal cycle
    },
    {
        id: "data",
        title: "Progress, not perfection.",
        description: "Build emotional resilience through non-judgmental tracking. Smoking isn't a failure—it's data to learn from.",
        Visual: DataInsight,
        duration: 12000,
    },
    {
        id: "structure",
        title: "Calm, daily clarity.",
        description: "Routine restructuring and behavioral flexibility. A guided path from breaking the loop to building a new identity.",
        Visual: StructurePath,
        duration: 14000,
    }
];

export function PhilosophySection() {
    const [activeIndex, setActiveIndex] = useState(0);

    // Auto-cycle logic
    useEffect(() => {
        const timer = setTimeout(() => {
            setActiveIndex((current) => (current + 1) % features.length);
        }, features[activeIndex].duration);

        return () => clearTimeout(timer);
    }, [activeIndex]);

    return (
        <section className="py-16 md:py-24 px-6 md:px-12 max-w-[1200px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-start">

                {/* Left Column: Content Navigation */}
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <motion.div
                        className="space-y-4 mb-12 md:mb-24 lg:mb-48"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    >
                        <Badge
                            variant="secondary"
                            className="rounded-full px-4 py-1.5 text-xs font-medium tracking-wide border-none bg-[oklch(0.9484_0.0251_149.08)] text-[oklch(0.2475_0.0661_146.79)] hover:bg-[oklch(0.9484_0.0251_149.08)]"
                        >
                            PHILOSOPHY
                        </Badge>
                        <h2 className="text-4xl md:text-5xl font-erode font-medium tracking-tighter leading-[1.1] text-black">
                            Why choose <br />
                            <span className="italic text-[oklch(0.2475_0.0661_146.79)]">Recovery Compass?</span>
                        </h2>
                    </motion.div>

                    {/* Feature List */}
                    <div className="space-y-8 flex-grow">
                        {features.map((feature, index) => {
                            const isActive = activeIndex === index;

                            return (
                                <div
                                    key={feature.id}
                                    className={cn(
                                        "relative pb-3 cursor-pointer transition-opacity duration-500",
                                        isActive ? "opacity-100" : "opacity-40 hover:opacity-70"
                                    )}
                                    onClick={() => setActiveIndex(index)}
                                >
                                    {/* Active Indicator Line (Progress) */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="active-indicator"
                                            className="absolute left-0 right-0 bottom-0 h-[2px] bg-[oklch(0.2475_0.0661_146.79)]/20 rounded-full overflow-hidden"
                                        >
                                            <motion.div
                                                className="h-full bg-[oklch(0.2475_0.0661_146.79)] origin-left"
                                                initial={{ width: "0%" }}
                                                animate={{ width: "100%" }}
                                                transition={{ duration: feature.duration / 1000, ease: "linear" }}
                                            />
                                        </motion.div>
                                    )}

                                    {/* Static Line for inactive */}
                                    {!isActive && (
                                        <div className="absolute left-0 right-0 bottom-0 h-[2px] bg-[oklch(0.2475_0.0661_146.79)]/10 rounded-full" />
                                    )}

                                    <div className="flex items-center h-full">
                                        <h3 className="text-xl md:text-2xl lg:text-3xl font-medium text-[oklch(0.2475_0.0661_146.79)] font-sans">
                                            {feature.title}
                                        </h3>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right Column: Visual Canvas & Description Bundle */}
                <motion.div
                    className="flex flex-col min-h-[500px] md:min-h-[600px] lg:min-h-[700px] w-full rounded-3xl overflow-hidden bg-[oklch(0.2475_0.0661_146.79)] border border-[oklch(0.2475_0.0661_146.79)]/5"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                >
                    {/* Top: Visual Animation Area */}
                    <div className="relative flex-grow w-full min-h-[350px] md:min-h-[400px] lg:min-h-[450px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeIndex}
                                className="absolute inset-0 w-full h-full"
                                initial={{ opacity: 0, x: 0 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 100 }}
                                transition={{ duration: 0.6, ease: "easeInOut" }}
                            >
                                {/* Render the Active Visual Component */}
                                {(() => {
                                    const VisualComponent = features[activeIndex].Visual;
                                    return <VisualComponent />;
                                })()}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Bottom: Description Area (Inside Canvas) */}
                    <div className="pb-12 px-8 pt-4">
                        <AnimatePresence mode="wait">
                            <motion.p
                                key={activeIndex}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.4 }}
                                className="text-lg text-white/90 font-satoshi leading-relaxed text-center max-w-lg mx-auto font-light w-full"
                            >
                                {features[activeIndex].description}
                            </motion.p>
                        </AnimatePresence>
                    </div>
                </motion.div>

            </div>
        </section>
    );
}
