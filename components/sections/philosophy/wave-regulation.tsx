"use client";

import { motion } from "framer-motion";

export function WaveRegulation() {
    // Animation Phase Config (Total ~14s)
    // 1. Chaos (0-3s): High amplitude, jagged
    // 2. Holding (3-7s): Amplitude decreases, curves smooth out
    // 3. Settling (7-11s): Near flat, gentle
    // 4. Reset (11-12s): Quick morph back to start (handled by loop)

    // Standardized Path Definitions: All must use exactly 4 Cubic Beziers (C) per wave segment + V + H to close.
    // This ensures smooth morphing between states without "abnormal" triangulation artifacts.
    // Segments: 0-100, 100-200, 200-300, 300-400

    const chaosPath1 = "M0,160 C30,80 70,240 100,160 C130,80 170,240 200,160 C230,80 270,240 300,160 C330,80 370,240 400,160 V300 H0 Z";
    const chaosPath2 = "M0,160 C30,240 70,80 100,160 C130,240 170,80 200,160 C230,240 270,80 300,160 C330,240 370,80 400,160 V300 H0 Z";

    const calmPath1 = "M0,170 C30,160 70,180 100,170 C130,160 170,180 200,170 C230,160 270,180 300,170 C330,160 370,180 400,170 V300 H0 Z";
    const calmPath2 = "M0,170 C30,180 70,160 100,170 C130,180 170,160 200,170 C230,180 270,160 300,170 C330,180 370,160 400,170 V300 H0 Z";

    const flatPath = "M0,175 C30,175 70,175 100,175 C130,175 170,175 200,175 C230,175 270,175 300,175 C330,175 370,175 400,175 V300 H0 Z";

    return (
        <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden bg-transparent">
            {/* The Container - "Holding Space" */}
            <div className="relative w-[300px] h-[300px] flex items-end justify-center">

                {/* Visual Container Outline */}
                <div className="absolute inset-0 border-2 border-white/30 rounded-[3rem] z-20 pointer-events-none" />

                {/* Masking Container for Liquid */}
                <div className="absolute inset-0 rounded-[3rem] overflow-hidden bg-[oklch(0.2475_0.0661_146.79)] z-10">

                    {/* Liquid Layer 1 (Back) */}
                    <motion.svg
                        viewBox="0 0 400 300"
                        preserveAspectRatio="none"
                        className="absolute bottom-0 w-[150%] h-full -left-[25%]"
                    >
                        <motion.path
                            fill="white"
                            fillOpacity="0.3"
                            animate={{
                                d: [chaosPath1, chaosPath2, calmPath1, flatPath, chaosPath1]
                            }}
                            transition={{
                                duration: 8,
                                ease: "easeInOut",
                                repeat: Infinity,
                                times: [0, 0.2, 0.5, 0.8, 1] // Chaos -> Calm -> Flat -> Reset
                            }}
                        />
                    </motion.svg>

                    {/* Liquid Layer 2 (Front) */}
                    <motion.svg
                        viewBox="0 0 400 300"
                        preserveAspectRatio="none"
                        className="absolute bottom-0 w-[150%] h-full -left-[25%]"
                    >
                        <motion.path
                            fill="white"
                            fillOpacity="0.6"
                            animate={{
                                d: [chaosPath2, chaosPath1, calmPath2, flatPath, chaosPath2]
                            }}
                            transition={{
                                duration: 8,
                                ease: "easeInOut",
                                repeat: Infinity,
                                times: [0, 0.2, 0.5, 0.8, 1]
                            }}
                        />
                    </motion.svg>

                    {/* Subtle Reflection/Shimmer on Surface (Phase 3 only) */}
                    <motion.div
                        className="absolute top-[45%] left-0 right-0 h-1 bg-white/20 blur-sm"
                        animate={{ opacity: [0, 0, 0.5, 0] }}
                        transition={{ duration: 8, times: [0, 0.5, 0.7, 1], repeat: Infinity }}
                    />
                </div>
            </div>

        </div>
    );
}
