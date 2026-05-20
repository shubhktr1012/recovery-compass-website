"use client";

import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ClipboardList, X } from "lucide-react";
import { useCart } from "@/lib/context/cart-context";
import { useUser } from "@/lib/context/user-context";
import { useState } from "react";

const HIDDEN_ROUTE_PREFIXES = ["/program-finder", "/checkout", "/diet-plan"];

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

export function PendingProgramFinderNudge() {
    const router = useRouter();
    const pathname = usePathname();
    const { isCartOpen } = useCart();
    const { user, profile, ownedPrograms, hasActiveProgram } = useUser();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const hideForRoute = shouldHideOnRoute(pathname);
    const hasPurchasedAccess = hasActiveProgram || ownedPrograms.length > 0;
    const shouldRender = Boolean(
        user &&
        profile &&
        !profile.onboarding_complete &&
        hasPurchasedAccess &&
        !hideForRoute &&
        !isCartOpen
    );
    const returnTo = pathname && pathname !== "/program-finder" ? pathname : "/";
    const programFinderHref = `/program-finder?returnTo=${encodeURIComponent(returnTo)}`;

    const handleOpen = () => {
        router.push(programFinderHref);
    };

    return (
        <AnimatePresence mode="wait">
            {shouldRender && isCollapsed && (
                <motion.button
                    key="collapsed-program-finder-nudge"
                    type="button"
                    initial={{ opacity: 0, y: 20, scale: 0.85 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    transition={springTransition}
                    onClick={handleOpen}
                    className="fixed bottom-[8.25rem] right-4 z-[54] flex items-center gap-2 rounded-full bg-white pl-3.5 pr-3 py-2.5 text-[oklch(0.2475_0.0661_146.79)] shadow-[0_8px_30px_-4px_rgba(6,41,12,0.18)] ring-1 ring-[oklch(0.2475_0.0661_146.79)]/8 md:bottom-[10.5rem] md:right-8"
                    aria-label="Finish Program Finder"
                >
                    <ClipboardList className="size-3.5 opacity-60" />
                    <span className="text-[12px] font-bold tracking-wide">Program Finder</span>
                    <ArrowRight className="size-3.5 opacity-45" />
                </motion.button>
            )}

            {shouldRender && !isCollapsed && (
                <motion.div
                    key="expanded-program-finder-nudge"
                    initial={{ opacity: 0, y: 30, scale: 0.92 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 16, scale: 0.94 }}
                    transition={{ duration: 0.5, ease: smoothEase }}
                    className="fixed bottom-[8.25rem] right-4 z-[54] w-[calc(100vw-2rem)] max-w-[320px] md:bottom-[10.5rem] md:right-8"
                >
                    <div className="relative overflow-hidden rounded-[22px] bg-white shadow-[0_20px_60px_-12px_rgba(6,41,12,0.16),0_0_0_1px_rgba(6,41,12,0.04)]">
                        <div className="p-5 pr-4 pt-5">
                            <div className="flex items-start gap-3.5">
                                <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-[14px] bg-[oklch(0.2475_0.0661_146.79)]/[0.06] text-[oklch(0.2475_0.0661_146.79)]">
                                    <ClipboardList className="size-[18px]" strokeWidth={1.8} />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[oklch(0.2475_0.0661_146.79)]/35 mb-1">
                                        Before Day 1
                                    </p>
                                    <p className="font-erode text-[17px] font-semibold leading-snug text-[oklch(0.2475_0.0661_146.79)]">
                                        Finish Program Finder
                                    </p>
                                    <p className="mt-1.5 text-[12px] font-medium leading-relaxed text-[oklch(0.2475_0.0661_146.79)]/45">
                                        Complete your profile so setup can use the right recommendation.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setIsCollapsed(true)}
                                    className="shrink-0 mt-0.5 size-7 rounded-full flex items-center justify-center text-[oklch(0.2475_0.0661_146.79)]/25 transition-all hover:bg-[oklch(0.2475_0.0661_146.79)]/[0.04] hover:text-[oklch(0.2475_0.0661_146.79)]/60"
                                    aria-label="Collapse Program Finder reminder"
                                >
                                    <X className="size-3.5" />
                                </button>
                            </div>

                            <motion.button
                                type="button"
                                onClick={handleOpen}
                                whileHover={{ scale: 0.99 }}
                                whileTap={{ scale: 0.97 }}
                                className="mt-5 flex w-full items-center justify-center gap-2 rounded-[14px] bg-[oklch(0.2475_0.0661_146.79)] px-4 py-3 text-[14px] font-bold text-white shadow-lg shadow-[oklch(0.2475_0.0661_146.79)]/15 transition-shadow hover:shadow-xl hover:shadow-[oklch(0.2475_0.0661_146.79)]/25"
                            >
                                Finish Profile
                                <ArrowRight className="size-4" />
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
