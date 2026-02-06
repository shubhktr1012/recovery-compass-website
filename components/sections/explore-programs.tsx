"use client";

import { motion } from "framer-motion";
import { Check, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const programs = [
    {
        id: "6-day-reset",
        tag: "Starting Point",
        title: "The 6-Day Reset",
        description: "A focused spring to reclaim your baseline and break autopilot habit loops.",
        price: "$19",
        highlights: [
            { label: "Day 1–2", text: "Urge Discovery & Mapping" },
            { label: "Day 3–4", text: "The 10-Minute Protocol" },
            { label: "Day 5–6", text: "Baseline Identity Reset" },
            { label: "Guarantee", text: "Money-Back protection" }
        ],
        cta: "Start Reset",
        color: "bg-[oklch(0.2475_0.0661_146.79)]"
    },
    {
        id: "90-day-foundation",
        tag: "Full Journey",
        title: "The 90-Day Foundation",
        description: "A complete roadmap to cement your identity and live without reference to smoking.",
        price: "$149",
        highlights: [
            { label: "Day 1–21", text: "Pattern Awareness & Shift" },
            { label: "Day 22–60", text: "Habit Architecture Design" },
            { label: "Day 61–90", text: "Mastery & Sustainable Ease" },
            { label: "Guarantee", text: "Results-Backed protection" }
        ],
        cta: "Explore Foundation",
        color: "bg-white"
    }
];

export function ExploreProgramsSection() {
    return (
        <section className="w-full bg-[#F9F9F9] py-16 overflow-visible">
            <div className="max-w-[1000px] mx-auto px-6 md:px-12">
                <div className="flex flex-col mb-12 md:mb-16 gap-4 text-left md:text-center md:items-center">
                    <div className="space-y-4">
                        <Badge
                            variant="secondary"
                            className="rounded-full px-4 py-1.5 text-xs font-medium tracking-wide border-none bg-[oklch(0.9484_0.0251_149.08)] text-[oklch(0.2475_0.0661_146.79)]"
                        >
                            OUR PROGRAMS
                        </Badge>
                        <h2 className="text-4xl md:text-5xl font-erode font-semibold leading-[1.1] text-black">
                            Navigate at your <br />
                            <span className="text-[oklch(0.2475_0.0661_146.79)] italic">own pace.</span>
                        </h2>
                    </div>
                    <p className="text-lg text-[oklch(0.2475_0.0661_146.79)]/60 font-satoshi max-w-sm leading-relaxed md:mx-auto">
                        Start with a short reset. Continue with <br className="hidden lg:block" />
                        long-term stability if you choose.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    {programs.map((program, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: idx * 0.2 }}
                            className={cn(
                                "relative group flex flex-col p-8 md:p-10 rounded-3xl overflow-hidden transition-all duration-500 border-none",
                                program.id === "6-day-reset"
                                    ? "bg-[oklch(0.2475_0.0661_146.79)] text-white"
                                    : "bg-[oklch(0.9484_0.0251_149.08)] text-[oklch(0.2475_0.0661_146.79)]"
                            )}
                        >
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between items-start">
                                        <span className={cn(
                                            "inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase",
                                            program.id === "6-day-reset"
                                                ? "bg-white/10 text-white/70"
                                                : "bg-[oklch(0.2475_0.0661_146.79)]/5 text-[oklch(0.2475_0.0661_146.79)]/40"
                                        )}>
                                            {program.tag}
                                        </span>
                                        {program.id === "6-day-reset" && <Zap className="size-6 text-white/20" aria-hidden="true" />}
                                    </div>
                                    <h3 className={cn(
                                        "text-2xl md:text-[28px] lg:text-3xl font-erode font-semibold leading-tight",
                                        program.id === "6-day-reset" ? "text-white" : "text-[oklch(0.2475_0.0661_146.79)]"
                                    )}>
                                        {program.title}
                                    </h3>
                                    <p className={cn(
                                        "text-base md:text-lg font-satoshi leading-relaxed",
                                        program.id === "6-day-reset" ? "text-white/70" : "text-[oklch(0.2475_0.0661_146.79)]/70"
                                    )}>
                                        {program.description}
                                    </p>
                                </div>

                                <div className="space-y-4 mb-10 flex-grow">
                                    <div className={cn(
                                        "h-px w-full mb-6",
                                        program.id === "6-day-reset" ? "bg-white/10" : "bg-[oklch(0.2475_0.0661_146.79)]/10"
                                    )} />
                                    {program.highlights.map((item, i) => (
                                        <div key={i} className="flex items-start gap-4 text-sm font-medium">
                                            <div className={cn(
                                                "flex-shrink-0 size-5 mt-0.5 rounded-full flex items-center justify-center",
                                                program.id === "6-day-reset" ? "bg-white/20" : "bg-[oklch(0.2475_0.0661_146.79)]/10"
                                            )}>
                                                <Check className={cn(
                                                    "size-3",
                                                    program.id === "6-day-reset" ? "text-white" : "text-[oklch(0.2475_0.0661_146.79)]"
                                                )} aria-hidden="true" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className={cn(
                                                    "text-[10px] font-black uppercase tracking-widest leading-none mb-1",
                                                    program.id === "6-day-reset" ? "text-white/40" : "text-[oklch(0.2475_0.0661_146.79)]/30"
                                                )}>
                                                    {item.label}
                                                </span>
                                                <span className={program.id === "6-day-reset" ? "text-white/90" : "text-[oklch(0.2475_0.0661_146.79)]/80"}>
                                                    {item.text}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex flex-col items-center mt-auto space-y-4">
                                    <div className={cn(
                                        "text-4xl font-sans font-bold",
                                        program.id === "6-day-reset" ? "text-white" : "text-[oklch(0.2475_0.0661_146.79)]"
                                    )}>
                                        {program.price}
                                    </div>
                                    <Button
                                        variant="default"
                                        className={cn(
                                            "w-fit px-10 h-12 rounded-full font-bold text-base border-none transition-all duration-300",
                                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                                            program.id === "6-day-reset"
                                                ? "bg-white text-[oklch(0.2475_0.0661_146.79)] hover:bg-white/90 shadow-lg focus-visible:ring-white"
                                                : "bg-[oklch(0.2475_0.0661_146.79)] text-white hover:bg-[oklch(0.2475_0.0661_146.79)]/90 shadow-lg focus-visible:ring-[oklch(0.2475_0.0661_146.79)]"
                                        )}
                                    >
                                        {program.cta}
                                    </Button>
                                </div>
                            </div>
                            {program.id === "6-day-reset" && (
                                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors duration-500" />
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
