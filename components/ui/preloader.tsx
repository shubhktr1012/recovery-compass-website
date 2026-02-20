"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export function Preloader() {
    const [loading, setLoading] = useState(true);
    const [isInstant, setIsInstant] = useState(false);

    useEffect(() => {
        // specific check for session storage to prevent preloader from showing on every refresh
        const hasSeenPreloader = sessionStorage.getItem("has_seen_preloader");

        if (hasSeenPreloader) {
            // Avoid setting state synchronously inside effect body to prevent cascading renders
            // Use setTimeout to defer it to the next tick as a simple workaround
            setTimeout(() => {
                setIsInstant(true);
                setLoading(false);
            }, 0);
            return;
        }

        // Total animation time:
        // Breathe In: 2s
        // Exhale & Reveal: 1.5s
        // Hold briefly: 0.5s (optional)
        // Dissolve: 0.8s
        // Total approx: ~4-5s

        // We can just rely on the animation sequence to finish, 
        // or set a timeout to remove the component from DOM.
        // Let's hold it for enough time to complete the sequence.
        const timer = setTimeout(() => {
            setLoading(false);
            sessionStorage.setItem("has_seen_preloader", "true");
        }, 4500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {loading && (
                <motion.div
                    key="preloader"
                    // Exit animation: Dissolve/Blur out
                    exit={{ opacity: 0, filter: isInstant ? "none" : "blur(10px)" }}
                    transition={{ duration: isInstant ? 0 : 0.8, ease: "easeInOut" }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-primary [.skip-preloader_&]:!hidden"
                >
                    <div className="relative flex items-center justify-center">
                        {/* Logo Icon */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{
                                scale: [0.8, 1.4, 1],
                                opacity: [0, 1, 1],
                            }}
                            transition={{
                                duration: 3.5,
                                times: [0, 0.6, 1],
                                ease: [0.76, 0, 0.24, 1],
                            }}
                            className="relative z-20 w-16 h-16 md:w-20 md:h-20 flex items-center justify-center"
                        >
                            <Image
                                src="/rc-logo-white.svg"
                                alt=""
                                fill
                                className="object-contain"
                                priority
                            />
                        </motion.div>

                        {/* Text Reveal Container */}
                        <motion.div
                            className="overflow-hidden flex items-center"
                            initial={{ width: 0, opacity: 0 }}
                            animate={{
                                width: "auto",
                                opacity: 1,
                            }}
                            transition={{
                                delay: 2.1,
                                duration: 1.4,
                                ease: [0.76, 0, 0.24, 1],
                            }}
                        >
                            <h1 className="pl-4 text-3xl md:text-4xl text-white font-erode font-medium whitespace-nowrap leading-none pt-1">
                                Recovery Compass
                            </h1>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
