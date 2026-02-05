"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useVelocity, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

export function BackToTop() {
    const [isVisible, setIsVisible] = useState(false);

    // Scroll Physics for Compass Rotation
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, {
        damping: 50,
        stiffness: 400
    });

    // Map velocity to rotation (e.g., fast scroll down = needle tilts right, up = left)
    // Range: +/- 3000px/s velocity -> +/- 180 degrees rotation
    const rotation = useTransform(smoothVelocity, [-3000, 3000], [-180, 180]);

    useEffect(() => {
        const toggleVisibility = () => {
            // Show button when page is scrolled down 500px
            if (window.scrollY > 500) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={scrollToTop}
                    className={cn(
                        "fixed bottom-8 right-8 z-50 p-0 rounded-full shadow-lg",
                        "bg-white/90 backdrop-blur-md border border-white/20",
                        "text-[oklch(0.2475_0.0661_146.79)]", // Primary Deep Moss
                        "hover:bg-white hover:shadow-xl hover:border-white/40 transition-all duration-300",
                        "group flex items-center justify-center w-14 h-14"
                    )}
                    aria-label="Back to top"
                >
                    {/* Static Compass Ring & North Dot */}
                    <div className="absolute inset-0 rounded-full border border-current opacity-20" />

                    {/* Red North Dot (Fixed at 12 o'clock) */}
                    <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_4px_rgba(239,68,68,0.6)]" />

                    {/* Dynamic Needle */}
                    <motion.div
                        style={{ rotate: rotation }}
                        className="relative w-full h-full flex items-center justify-center"
                    >
                        {/* The Needle SVG */}
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-8 h-8 drop-shadow-sm"
                        >
                            {/* North Pointer (Darker/Filled) -> Points UP (0deg) by default */}
                            <path
                                d="M12 3L15 12H9L12 3Z"
                                className="fill-current"
                            />
                            {/* South Pointer (Lighter/Outlined) */}
                            <path
                                d="M12 21L9 12H15L12 21Z"
                                className="fill-current opacity-30"
                            />
                            {/* Center Pivot */}
                            <circle cx="12" cy="12" r="1.5" className="fill-white" />
                        </svg>
                    </motion.div>
                </motion.button>
            )}
        </AnimatePresence>
    );
}
