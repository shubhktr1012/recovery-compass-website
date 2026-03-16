"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

import { Cigarette } from "lucide-react";

export function DataInsight() {
    const [phase, setPhase] = useState<"streak" | "slip" | "zoom" | "context">("streak");

    // 14s Loop Cycle
    useEffect(() => {
        const loop = async () => {
            while (true) {
                // 0s-4s: Streak Building
                setPhase("streak");
                await wait(2000);

                // 4s-6s: The Slip (Disruption)
                setPhase("slip");
                await wait(1000);

                // 6s-9s: Zoom Out (Transformation)
                setPhase("zoom");
                await wait(4000);

                // 9s-12s: Context (Insight)
                // 9s-14s: Context (Insight)
                setPhase("context");
                await wait(5000);
            }
        };
        loop();
    }, []);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden bg-transparent">

            <div className="relative w-full h-[250px] flex items-center justify-center">
                <AnimatePresence mode="wait">

                    {/* PHASE 1 & 2: THE CALENDAR STREAK */}
                    {(phase === "streak" || phase === "slip") && (
                        <motion.div
                            key="calendar"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.2, transition: { duration: 0.8, ease: "easeInOut" } }} // Shrink into a point
                            className="relative flex flex-col items-center"
                        >
                            {/* The "Card" */}
                            <motion.div
                                className={`w-36 h-40 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 backdrop-blur-sm transition-colors duration-300
                                    ${phase === "slip" ? "bg-white/10 border-[#F59E0B]" : "bg-white/5 border-white/20"}
                                `}
                                animate={phase === "slip" ? { x: [0, -5, 5, -5, 5, 0], rotate: [0, -2, 2, 0] } : {}}
                                transition={{ duration: 0.4 }}
                            >
                                <span className={`text-xs uppercase tracking-widest font-medium ${phase === "slip" ? "text-[#F59E0B]" : "text-white/50"}`}>
                                    {phase === "slip" ? "Streak Lost" : "Day Streak"}
                                </span>

                                <span className={`text-6xl font-bold tracking-tighter ${phase === "slip" ? "text-[#F59E0B]" : "text-white"}`}>
                                    {phase === "slip" ? "0" : "14"}
                                </span>

                                {/* Status Icon */}
                                {phase === "slip" ? (
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-[#F59E0B]">
                                        {/* Broken Cigarette / Slip Icon - Replaced with Lucide Cigarette */}
                                        <Cigarette size={32} strokeWidth={2} />
                                    </motion.div>

                                ) : (
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-white">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                    </motion.div>
                                )}
                            </motion.div>
                        </motion.div>
                    )}

                    {/* PHASE 3 & 4: THE JOURNEY (GRAPH) */}
                    {(phase === "zoom" || phase === "context") && (
                        <motion.div
                            key="graph"
                            className="absolute inset-0 w-full h-full flex items-center justify-center"
                        >
                            <svg width="360" height="200" viewBox="0 0 360 200" className="overflow-visible">

                                {/* 1. The Line drawing itself */}
                                <motion.path
                                    d="M40,160 C80,150 120,80 160,90 C190,100 210,150 240,160 C270,170 300,70 340,50"
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 1 }}
                                    transition={{ duration: 1.2, ease: "easeOut" }}
                                />

                                {/* 2. Past Points (The "History") */}
                                {[
                                    { cx: 40, cy: 160 }, { cx: 100, cy: 110 }, { cx: 160, cy: 90 }, // Past good days
                                    { cx: 240, cy: 160, isSlip: true }, // The "Streak Lost" moment (matches card position roughly)
                                    { cx: 300, cy: 90 }, { cx: 340, cy: 50 } // Future recovery
                                ].map((p, i) => (
                                    <motion.circle
                                        key={i}
                                        cx={p.cx}
                                        cy={p.cy}
                                        r={p.isSlip ? 6 : 3}
                                        fill={p.isSlip ? "#F59E0B" : "white"}
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.2 + (i * 0.1) }}
                                    />
                                ))}

                                {/* 3. Context Tooltip appearing on the Slip */}
                                {phase === "context" && (
                                    <motion.g
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <foreignObject x="190" y="180" width="100" height="50">
                                            <div className="flex flex-col items-center">
                                                <div className="bg-white/10 backdrop-blur-md border border-white/20 px-2 py-1.5 rounded text-center shadow-lg">
                                                    <span className="text-[10px] uppercase text-white font-medium whitespace-nowrap">
                                                        Trigger: Stress
                                                    </span>
                                                </div>
                                                <div className="w-[1px] h-3 bg-white/20 -mt-6 mb-0" />
                                            </div>
                                        </foreignObject>
                                    </motion.g>
                                )}
                            </svg>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

        </div >
    );
}

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
