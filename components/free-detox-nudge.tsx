"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Leaf, X } from "lucide-react";
import { useCart } from "@/lib/context/cart-context";

const HIDDEN_ROUTE_PREFIXES = ["/checkout", "/diet-plan"];

function shouldHideOnRoute(pathname: string | null) {
    if (!pathname) {
        return false;
    }
    return HIDDEN_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

const springTransition = {
    type: "spring" as const,
    stiffness: 400,
    damping: 30,
    mass: 0.8,
};

const smoothEase = [0.22, 1, 0.36, 1] as const;

type NudgeWindow = Window & {
    rcActiveNudges?: Record<string, boolean>;
};

export function FreeDetoxNudge() {
    const pathname = usePathname();
    const { isCartOpen } = useCart();

    const [isCollapsed, setIsCollapsed] = useState(false);
    const [hasClaimed, setHasClaimed] = useState(false);
    const [activeSlotsCount, setActiveSlotsCount] = useState(0);

    const hideForRoute = shouldHideOnRoute(pathname);

    // Collision detection & claim state checking
    useEffect(() => {
        if (typeof window === "undefined") return;

        const updateState = () => {
            setHasClaimed(localStorage.getItem("rc:detox-opt-in") === "claimed");

            // Calculate active nudges count
            const activeMap = (window as NudgeWindow).rcActiveNudges || {};
            let count = 0;
            if (activeMap["diet-plan"]) count++;
            if (activeMap["program-finder"]) count++;
            setActiveSlotsCount(count);
        };

        window.addEventListener("rc-nudge-active", updateState);
        window.addEventListener("rc-detox-claimed", updateState);

        // Initial check
        updateState();

        return () => {
            window.removeEventListener("rc-nudge-active", updateState);
            window.removeEventListener("rc-detox-claimed", updateState);
        };
    }, []);

    const handleOpenModal = () => {
        window.dispatchEvent(new CustomEvent("rc-open-detox-modal"));
    };

    const shouldRender = !hideForRoute && !isCartOpen && !hasClaimed;

    if (!shouldRender) return null;

    // Calculate dynamic bottom position based on other active nudges
    // Slot 0 (bottom): bottom-[4.75rem] md:bottom-[7rem]
    // Slot 1 (middle): bottom-[8.25rem] md:bottom-[10.5rem]
    // Slot 2 (top): bottom-[11.75rem] md:bottom-[14rem]
    let bottomClass = "bottom-[4.75rem] md:bottom-[7rem]";
    if (activeSlotsCount === 1) {
        bottomClass = "bottom-[8.25rem] md:bottom-[10.5rem]";
    } else if (activeSlotsCount >= 2) {
        bottomClass = "bottom-[11.75rem] md:bottom-[14rem]";
    }

    return (
        <AnimatePresence mode="wait">
            {/* ── Collapsed Pill ── */}
            {isCollapsed ? (
                <motion.button
                    key="collapsed-detox-nudge"
                    type="button"
                    initial={{ opacity: 0, y: 20, scale: 0.85 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    transition={springTransition}
                    onClick={handleOpenModal}
                    className={`fixed ${bottomClass} right-4 z-[53] flex items-center gap-2 rounded-full bg-[#06290C] pl-3.5 pr-3 py-2.5 text-white shadow-[0_8px_30px_-4px_rgba(6,41,12,0.25)] md:right-8 transition-all duration-300`}
                    aria-label="Get Free Detox Program"
                >
                    <Leaf className="size-3.5 text-[#a8c8ac] fill-current" />
                    <span className="text-[12px] font-bold tracking-wide">Free Detox Program</span>
                    <ArrowRight className="size-3.5 opacity-50" />
                </motion.button>
            ) : (
                /* ── Expanded Card ── */
                <motion.div
                    key="expanded-detox-nudge"
                    initial={{ opacity: 0, y: 30, scale: 0.92 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 16, scale: 0.94 }}
                    transition={{ duration: 0.5, ease: smoothEase }}
                    className={`fixed ${bottomClass} right-4 z-[53] w-[calc(100vw-2rem)] max-w-[320px] md:right-8 transition-all duration-300`}
                >
                    <div className="relative overflow-hidden rounded-[22px] bg-white shadow-[0_20px_60px_-12px_rgba(6,41,12,0.18),0_0_0_1px_rgba(6,41,12,0.04)]">
                        {/* Top accent — static, subtle forest green */}
                        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#06290C]/30 to-transparent" />

                        <div className="p-5 pr-4 pt-5">
                            <div className="flex items-start gap-3.5">
                                <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-[14px] bg-[#06290C]/[0.06] text-[#06290C]">
                                    <Leaf className="size-[18px] text-[#3D7A4A] fill-current" />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#06290C]/35 mb-1">
                                        Free Program
                                    </p>
                                    <p className="font-erode text-[17px] font-semibold leading-snug text-[#06290C]">
                                        Free Detox Program
                                    </p>
                                    <p className="mt-1.5 text-[12px] font-medium leading-relaxed text-[#06290C]/45">
                                        Reset your nervous system, gut, hydration, and energy. Click to download.
                                    </p>
                                </div>

                                {/* Close / collapse */}
                                <button
                                    type="button"
                                    onClick={() => setIsCollapsed(true)}
                                    className="shrink-0 mt-0.5 size-7 rounded-full flex items-center justify-center text-[#06290C]/25 transition-all hover:bg-[#06290C]/[0.04] hover:text-[#06290C]/60"
                                    aria-label="Collapse free detox reminder"
                                >
                                    <X className="size-3.5" />
                                </button>
                            </div>

                            {/* CTA */}
                            <motion.button
                                type="button"
                                onClick={handleOpenModal}
                                whileHover={{ scale: 0.99 }}
                                whileTap={{ scale: 0.97 }}
                                className="mt-5 flex w-full items-center justify-center gap-2 rounded-[14px] bg-[#06290C] px-4 py-3 text-[14px] font-bold text-white shadow-lg shadow-[#06290C]/15 transition-shadow hover:shadow-xl hover:shadow-[#06290C]/25"
                            >
                                Claim Free Detox
                                <motion.span
                                    animate={{ x: [0, 3, 0] }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                >
                                    <ArrowRight className="size-4" />
                                </motion.span>
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
