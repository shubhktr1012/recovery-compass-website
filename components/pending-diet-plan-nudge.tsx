"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ClipboardList, X } from "lucide-react";
import { useCart } from "@/lib/context/cart-context";
import { useUser } from "@/lib/context/user-context";

type PendingClaimResponse = {
    pending?: boolean;
    href?: string;
    message?: string;
};

const HIDDEN_ROUTE_PREFIXES = ["/diet-plan", "/checkout"];

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

export function PendingDietPlanNudge() {
    const router = useRouter();
    const pathname = usePathname();
    const { user, isLoading } = useUser();
    const { isCartOpen } = useCart();
    const [href, setHref] = useState<string | null>(null);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const hideForRoute = shouldHideOnRoute(pathname);
    const userId = user?.id ?? null;

    useEffect(() => {
        if (hideForRoute || isLoading || !userId) {
            setHref(null);
            return;
        }

        const controller = new AbortController();
        let isMounted = true;

        async function loadPendingClaim() {
            try {
                const response = await fetch("/api/diet-plan/pending-claim", {
                    signal: controller.signal,
                    cache: "no-store",
                });

                if (response.status === 401) {
                    if (isMounted) {
                        setHref(null);
                    }
                    return;
                }

                if (!response.ok) {
                    const body = await response.json().catch(() => null) as PendingClaimResponse | null;
                    throw new Error(body?.message || "Failed to check pending diet plan questionnaire.");
                }

                const payload = await response.json() as PendingClaimResponse;
                if (isMounted) {
                    setHref(payload.pending && typeof payload.href === "string" ? payload.href : null);
                }
            } catch (error) {
                if (!controller.signal.aborted) {
                    console.warn("[DietPlan] Pending questionnaire nudge unavailable:", error);
                }
                if (isMounted) {
                    setHref(null);
                }
            }
        }

        void loadPendingClaim();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [hideForRoute, isLoading, userId]);

    const handleOpen = () => {
        if (href) {
            router.push(href);
        }
    };

    const shouldRender = !hideForRoute && !isCartOpen && Boolean(userId && href);

    return (
        <AnimatePresence mode="wait">
            {/* ── Collapsed Pill ── */}
            {shouldRender && isCollapsed && (
                <motion.button
                    key="collapsed-diet-nudge"
                    type="button"
                    initial={{ opacity: 0, y: 20, scale: 0.85 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    transition={springTransition}
                    onClick={handleOpen}
                    className="fixed bottom-[4.75rem] right-4 z-[55] flex items-center gap-2 rounded-full bg-[oklch(0.2475_0.0661_146.79)] pl-3.5 pr-3 py-2.5 text-white shadow-[0_8px_30px_-4px_rgba(6,41,12,0.25)] md:bottom-[7rem] md:right-8"
                    aria-label="Continue pending diet profile"
                >
                    <ClipboardList className="size-3.5 opacity-70" />
                    <span className="text-[12px] font-bold tracking-wide">Diet Plan</span>
                    <ArrowRight className="size-3.5 opacity-50" />
                </motion.button>
            )}

            {/* ── Expanded Card ── */}
            {shouldRender && !isCollapsed && (
                <motion.div
                    key="expanded-diet-nudge"
                    initial={{ opacity: 0, y: 30, scale: 0.92 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 16, scale: 0.94 }}
                    transition={{ duration: 0.5, ease: smoothEase }}
                    className="fixed bottom-[4.75rem] right-4 z-[55] w-[calc(100vw-2rem)] max-w-[320px] md:bottom-[7rem] md:right-8"
                >
                    <div className="relative overflow-hidden rounded-[22px] bg-white shadow-[0_20px_60px_-12px_rgba(6,41,12,0.18),0_0_0_1px_rgba(6,41,12,0.04)]">
                        {/* Top accent — static, subtle */}
                        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[oklch(0.2475_0.0661_146.79)]/30 to-transparent" />

                        <div className="p-5 pr-4 pt-5">
                            <div className="flex items-start gap-3.5">
                                <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-[14px] bg-[oklch(0.2475_0.0661_146.79)]/[0.06] text-[oklch(0.2475_0.0661_146.79)]">
                                    <ClipboardList className="size-[18px]" strokeWidth={1.8} />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[oklch(0.2475_0.0661_146.79)]/35 mb-1">
                                        Your diet plan
                                    </p>
                                    <p className="font-erode text-[17px] font-semibold leading-snug text-[oklch(0.2475_0.0661_146.79)]">
                                        Complete your diet profile
                                    </p>
                                    <p className="mt-1.5 text-[12px] font-medium leading-relaxed text-[oklch(0.2475_0.0661_146.79)]/45">
                                        Fill out a short questionnaire so we can build your personalised plan.
                                    </p>
                                </div>

                                {/* Close / collapse */}
                                <button
                                    type="button"
                                    onClick={() => setIsCollapsed(true)}
                                    className="shrink-0 mt-0.5 size-7 rounded-full flex items-center justify-center text-[oklch(0.2475_0.0661_146.79)]/25 transition-all hover:bg-[oklch(0.2475_0.0661_146.79)]/[0.04] hover:text-[oklch(0.2475_0.0661_146.79)]/60"
                                    aria-label="Collapse diet plan reminder"
                                >
                                    <X className="size-3.5" />
                                </button>
                            </div>

                            {/* CTA */}
                            <motion.button
                                type="button"
                                onClick={handleOpen}
                                whileHover={{ scale: 0.99 }}
                                whileTap={{ scale: 0.97 }}
                                className="mt-5 flex w-full items-center justify-center gap-2 rounded-[14px] bg-[oklch(0.2475_0.0661_146.79)] px-4 py-3 text-[14px] font-bold text-white shadow-lg shadow-[oklch(0.2475_0.0661_146.79)]/15 transition-shadow hover:shadow-xl hover:shadow-[oklch(0.2475_0.0661_146.79)]/25"
                            >
                                Continue Questionnaire
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
