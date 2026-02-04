"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const days = [
    { day: 1, label: "Arriving", desc: "Break autopilot" },
    { day: 2, label: "Noticing", desc: "Urges are sensations" },
    { day: 3, label: "Patterns", desc: "When and why" },
    { day: 4, label: "Triggers", desc: "Change one thing" },
    { day: 5, label: "Confidence", desc: "Protect momentum" },
    { day: 6, label: "Stability", desc: "The new normal" },
];

export function StructurePath() {
    const [activeDay, setActiveDay] = useState(1);

    // 14 Second Loop to match other sections
    useEffect(() => {
        const loop = async () => {
            while (true) {
                for (let i = 1; i <= 6; i++) {
                    setActiveDay(i);
                    // Distribute 14s roughly among 6 items
                    // Day 1 & 6 get slightly more "anchor" time
                    if (i === 1 || i === 6) {
                        await wait(2800);
                    } else {
                        await wait(2100);
                    }
                }
            }
        };
        loop();
    }, []);

    // Calculate rotation: 6 items = 60deg apart
    // Day 1 at Top (0deg from vertical ?? default 0 is usually 3 o'clock in math/svg)
    // Let's assume 0 is UP.
    // Index 0 (Day 1) -> 0 deg
    // Index 1 (Day 2) -> 60 deg
    const rotation = (activeDay - 1) * 60;

    return (
        <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden bg-transparent">

            {/* Main Compass Container */}
            <div className="relative w-[280px] h-[280px] flex items-center justify-center">

                {/* 1. Compass Ring */}
                <div className="absolute inset-0 rounded-full border border-white/10" />
                <div className="absolute inset-4 rounded-full border border-white/5" />

                {/* 2. Day Markers (Dots & Labels around the ring) */}
                {days.map((d, i) => {
                    const angle = i * 60;
                    const isActive = activeDay === d.day;
                    const isPast = activeDay > d.day;

                    // Position calculations (Radius 120px)
                    // 0 degrees is TOP.
                    // x = r * sin(angle)
                    // y = r * -cos(angle)
                    const r = 120;
                    const rad = (angle * Math.PI) / 180;
                    const x = r * Math.sin(rad);
                    const y = r * -Math.cos(rad);

                    return (
                        <motion.div
                            key={d.day}
                            className="absolute flex items-center justify-center"
                            style={{ x, y }}
                            animate={{ opacity: isActive ? 1 : 0.3, scale: isActive ? 1.1 : 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* Dot */}
                            <motion.div
                                className={`w-3 h-3 rounded-full ${isActive ? "bg-white box-shadow-glow" : "bg-white/20"}`}
                                layoutId={`dot-${d.day}`}
                            />

                            {/* Label always visible but dimmed */}
                            <div
                                className={`absolute whitespace-nowrap text-[10px] uppercase tracking-widest font-medium transition-all duration-500
                                    ${isActive ? "text-white opacity-100" : "text-white/30 opacity-0"}
                                `}
                                style={{
                                    // Offset label away from center based on angle
                                    transform: `translate(${Math.sin(rad) * 20}px, ${-Math.cos(rad) * 20}px)`
                                }}
                            >
                                {/* Only show label when active to avoid clutter? Or show simplified? 
                                    Using opacity-0 for inactive to keep it clean as requested.
                                */}
                                Day {d.day}
                            </div>
                        </motion.div>
                    );
                })}

                {/* 3. The Needle */}
                <motion.div
                    className="absolute w-full h-full flex items-center justify-center"
                    animate={{ rotate: rotation }}
                    transition={{
                        type: "spring",
                        stiffness: 100,
                        damping: 15,
                        mass: 1
                    }}
                >
                    {/* Needle Body */}
                    <div className="relative h-[160px] w-4 flex flex-col items-center">
                        {/* North End (Pointing) */}
                        <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[60px] border-b-white filter drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />

                        {/* Center Pivot */}
                        <div className="w-3 h-3 bg-white rounded-full -my-1.5 z-10" />

                        {/* South End (Counterweight) */}
                        <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[60px] border-t-white/10" />
                    </div>
                </motion.div>

                {/* Center "Focus" Display - Inside the Compass */}
                <div className="absolute flex flex-col items-center justify-center z-20 pointer-events-none">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeDay}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="flex flex-col items-center mt-32" // Pushed down below the needle center
                        >
                            <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-1">
                                Day {activeDay} Focus
                            </span>
                            <span className="text-sm font-medium tracking-wide text-white">
                                {days[activeDay - 1].label}
                            </span>
                        </motion.div>
                    </AnimatePresence>
                </div>

            </div>

        </div>
    );
}

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
