"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { DetoxLeadFlow } from "@/components/detox-lead-flow";

const COOLDOWN_DAYS = 30;

export function DetoxModalV2() {
    const [isOpen, setIsOpen] = useState(false);
    const hasTriggeredRef = useRef(false);

    useEffect(() => {
        const handleOpenEvent = () => {
            setIsOpen(true);
        };

        window.addEventListener("rc-open-detox-modal", handleOpenEvent);
        return () => window.removeEventListener("rc-open-detox-modal", handleOpenEvent);
    }, []);

    useEffect(() => {
        if (typeof window === "undefined" || window.location.pathname !== "/") {
            return;
        }

        const optInState = localStorage.getItem("rc:detox-opt-in");
        if (optInState === "claimed") {
            return;
        }

        if (optInState === "dismissed") {
            const dismissedAt = localStorage.getItem("rc:detox-dismissed-at");
            if (dismissedAt) {
                const elapsedMs = Date.now() - Number.parseInt(dismissedAt, 10);
                if (elapsedMs < COOLDOWN_DAYS * 24 * 60 * 60 * 1000) {
                    return;
                }
            }
        }

        const timer = window.setTimeout(() => {
            if (!hasTriggeredRef.current) {
                hasTriggeredRef.current = true;
                setIsOpen(true);
            }
        }, 5000);

        const handleMouseLeave = (event: MouseEvent) => {
            if (event.clientY < 10 && !hasTriggeredRef.current) {
                hasTriggeredRef.current = true;
                setIsOpen(true);
            }
        };

        document.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            window.clearTimeout(timer);
            document.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        if (localStorage.getItem("rc:detox-opt-in") !== "claimed") {
            localStorage.setItem("rc:detox-opt-in", "dismissed");
            localStorage.setItem("rc:detox-dismissed-at", Date.now().toString());
        }
    };

    return (
        <AnimatePresence>
            {isOpen ? (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-[oklch(0.2475_0.0661_146.79)]/40 backdrop-blur-md"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 16 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 16 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="relative z-10 w-full max-w-[820px] overflow-hidden rounded-[32px] bg-white text-[oklch(0.2475_0.0661_146.79)] shadow-2xl border border-[oklch(0.2475_0.0661_146.79)]/8"
                    >
                        <div className="absolute inset-x-0 top-0 h-[4px] bg-gradient-to-r from-[#0d4416] via-[#3D7A4A] to-[#EBF4EC]" />
                        <button
                            type="button"
                            onClick={handleClose}
                            className="absolute top-5 right-5 z-20 flex size-9 items-center justify-center rounded-full text-[oklch(0.2475_0.0661_146.79)]/30 transition-all hover:bg-[oklch(0.2475_0.0661_146.79)]/5 hover:text-[oklch(0.2475_0.0661_146.79)]/80"
                            aria-label="Close detox program modal"
                        >
                            <X className="size-4" />
                        </button>
                        <DetoxLeadFlow
                            source="homepage_modal"
                            onCloseAction={handleClose}
                            onClaimedAction={() => {
                                localStorage.setItem("rc:detox-opt-in", "claimed");
                            }}
                        />
                    </motion.div>
                </div>
            ) : null}
        </AnimatePresence>
    );
}
