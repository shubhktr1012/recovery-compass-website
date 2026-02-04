"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

import { Cigarette } from "lucide-react";

export function NeuralPattern() {
    const [phase, setPhase] = useState<"old_default" | "shift" | "rewiring" | "new_default">("old_default");

    // 14 Second Loop
    useEffect(() => {
        const loop = async () => {
            while (true) {
                // Phase 1: Established Pattern (Old Path) - 0s to 3s
                setPhase("old_default");
                await wait(2000);

                // Phase 2: The Shift Begins (Hesitation) - 3s to 6s
                setPhase("shift");
                await wait(2000);

                // Phase 3: Rewiring (New Path strengthens) - 6s to 9s
                setPhase("rewiring");
                await wait(4000);

                // Phase 4: New Default (New Path dominant) - 9s to 14s
                setPhase("new_default");
                await wait(6000);
            }
        };
        loop();
    }, []);

    // Path Definitions
    // Trigger (Top Center): 200, 40
    // Craving (Left): 80, 220
    // Calm (Right): 320, 220
    const oldPath = "M200,40 C200,100 80,100 80,220";
    const newPath = "M200,40 C200,100 320,100 320,220";

    return (
        <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden bg-transparent">

            <svg width="400" height="300" viewBox="0 0 400 300" className="w-[90%] h-auto overflow-visible">

                {/* --- PATHS --- */}

                {/* Old Path (Left) - Fades Out */}
                <motion.path
                    d={oldPath}
                    fill="none"
                    stroke="white"
                    strokeLinecap="round"
                    initial={false}
                    animate={{
                        opacity: (phase === "old_default" || phase === "shift") ? 0.6 : 0.1,
                        strokeWidth: (phase === "old_default" || phase === "shift") ? 3 : 1,
                        strokeDasharray: (phase === "rewiring" || phase === "new_default") ? "4 8" : "0 0"
                    }}
                    transition={{ duration: 1.5 }}
                />

                {/* New Path (Right) - Fades In */}
                <motion.path
                    d={newPath}
                    fill="none"
                    stroke="white"
                    strokeLinecap="round"
                    initial={false}
                    animate={{
                        opacity: (phase === "rewiring" || phase === "new_default") ? 0.8 : 0.1,
                        strokeWidth: (phase === "rewiring" || phase === "new_default") ? 3 : 1,
                        strokeDasharray: (phase === "old_default") ? "4 8" : "0 0"
                    }}
                    transition={{ duration: 1.5 }}
                />

                {/* --- TRAVELING SIGNALS --- */}

                {/* --- TRAVELING SIGNALS --- */}

                {/* Old Path Signals - Always running, fades out */}
                <motion.g
                    initial={{ opacity: 1 }}
                    animate={{ opacity: (phase === "old_default" || phase === "shift") ? 1 : 0, transition: { duration: 1 } }}
                >
                    <circle
                        r="3"
                        fill="white"
                        className="drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                    >
                        <animateMotion
                            dur="2s"
                            repeatCount="indefinite"
                            path={oldPath}
                        />
                    </circle>
                </motion.g>

                {/* New Path Signals - Always running, fades in */}
                <motion.g
                    initial={{ opacity: 0 }}
                    animate={{ opacity: (phase === "shift" || phase === "rewiring" || phase === "new_default") ? 1 : 0, transition: { duration: 1 } }}
                >
                    <circle
                        r="3"
                        fill="white"
                        className="drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                    >
                        <animateMotion
                            dur="2s"
                            repeatCount="indefinite"
                            path={newPath} // Note: This uses standard duration, simpler than trying to time hesitation
                        />
                    </circle>

                    {/* Secondary Signal (Traffic increases) */}
                    <motion.circle
                        r="2"
                        fill="white"
                        opacity="0.6"
                        animate={{ opacity: (phase === "rewiring" || phase === "new_default") ? 0.6 : 0, transition: { duration: 1 } }}
                    >
                        <animateMotion
                            begin="1s"
                            dur="2s"
                            repeatCount="indefinite"
                            path={newPath}
                        />
                    </motion.circle>
                </motion.g>


                {/* --- NODES --- */}

                {/* Trigger Node (Top) - Cigarette Icon */}
                {/* Trigger Node (Top) - Cigarette Icon */}
                <motion.g transform="translate(200, 40)">
                    {/* Icon Container */}
                    <foreignObject x="-12" y="-12" width="24" height="24">
                        <div className="flex items-center justify-center w-full h-full text-white">
                            <Cigarette size={20} className="opacity-90" strokeWidth={1.5} />
                        </div>
                    </foreignObject>

                    {/* Smoke Wisp Animation */}
                    <motion.path
                        d="M10 -15 C 10 -20, 15 -25, 10 -30"
                        stroke="white"
                        strokeWidth="1.5"
                        fill="none"
                        opacity="0.6"
                        initial={{ pathLength: 0, opacity: 0, y: 5 }}
                        animate={{
                            pathLength: [0, 1, 1],
                            opacity: (phase === "rewiring" || phase === "new_default") ? 0 : [0, 0.6, 0], // Hide smoke when crossed out
                            y: [5, 0, -5]
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                            repeatDelay: 0.5
                        }}
                    />

                    {/* Secondary Smoke Wisp (Delayed) */}
                    <motion.path
                        d="M12 -12 C 14 -18, 8 -24, 12 -32"
                        stroke="white"
                        strokeWidth="1"
                        fill="none"
                        opacity="0.4"
                        initial={{ pathLength: 0, opacity: 0, y: 5 }}
                        animate={{
                            pathLength: [0, 1, 1],
                            opacity: (phase === "rewiring" || phase === "new_default") ? 0 : [0, 0.4, 0], // Hide smoke when crossed out
                            y: [5, -2, -8]
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 1.5
                        }}
                    />

                    {/* Cross / Ban Overlay */}
                    <motion.g
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{
                            opacity: (phase === "rewiring" || phase === "new_default") ? 1 : 0,
                            scale: (phase === "rewiring" || phase === "new_default") ? 1 : 0.5
                        }}
                        transition={{ duration: 0.5 }}
                    >
                        <line x1="-8" y1="-8" x2="8" y2="8" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                        <line x1="8" y1="-8" x2="-8" y2="8" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                    </motion.g>

                    <circle cx="0" cy="0" r="18" stroke="white" strokeWidth="1" strokeOpacity="0.2" fill="none" />
                    <text x="0" y="35" textAnchor="middle" className="text-[10px] uppercase font-medium fill-white/50 tracking-widest">Trigger</text>
                </motion.g>

                {/* Craving Node (Left) */}
                <motion.g
                    transform="translate(80, 220)"
                    animate={{ opacity: (phase === "old_default" || phase === "shift") ? 1 : 0.3 }}
                    transition={{ duration: 1 }}
                >
                    <circle r="5" fill="white" />
                    <text y="25" textAnchor="middle" className="text-[10px] uppercase font-medium fill-white/60 tracking-widest">Craving</text>
                </motion.g>

                {/* Calm Node (Right) */}
                <motion.g
                    transform="translate(320, 220)"
                    animate={{ opacity: (phase === "rewiring" || phase === "new_default") ? 1 : 0.3 }}
                    transition={{ duration: 1 }}
                >
                    <motion.circle
                        r="5"
                        fill="white"
                        animate={{ scale: (phase === "new_default") ? [1, 1.2, 1] : 1 }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                    {/* Glow effect when active */}
                    {(phase === "rewiring" || phase === "new_default") && (
                        <motion.circle
                            r="15"
                            stroke="white"
                            strokeWidth="1"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: [0, 0.4, 0], scale: [0.8, 1.5, 2] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                    )}
                    <text y="25" textAnchor="middle" className="text-[10px] uppercase font-medium fill-white/80 tracking-widest">Calm</text>
                </motion.g>

            </svg>

        </div>
    );
}

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
