"use client";

import * as React from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavbarProps {
    onCtaClick?: () => void;
}

export function Navbar({ onCtaClick }: NavbarProps) {
    const { scrollY } = useScroll();
    const [isCompact, setIsCompact] = React.useState(false);

    useMotionValueEvent(scrollY, "change", (latest) => {
        const threshold = typeof window !== "undefined" ? window.innerHeight / 4 : 200;
        setIsCompact(latest > threshold);
    });

    return (
        <motion.header
            className="fixed top-4 left-0 right-0 z-50 flex justify-center px-8"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <motion.div
                className={cn(
                    "relative flex items-center justify-between gap-4 rounded-full px-3 py-2",
                    // Styling: Amalfi Primary with subtle transparency
                    "bg-[var(--primary)]/95 backdrop-blur-md shadow-lg",
                    // Width constraint - Mobile: full, Desktop: Dynamic
                    "w-full border border-white/10",
                    isCompact ? "md:max-w-[600px]" : "md:max-w-[1200px]"
                )}
                layout
                transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30
                }}
            >
                {/* Left: Brand */}
                <div className="flex items-center gap-2 text-white">
                    <Image
                        src="/rc-logo-citrus-zest.svg"
                        alt="Recovery Compass"
                        width={24}
                        height={24}
                        className="size-6"
                    />
                    <span className="font-erode text-xl font-medium tracking-tighter text-white hidden md:inline-block">
                        Recovery Compass
                    </span>
                </div>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Right: Nav Links + CTA */}
                <div className="flex items-center gap-6">
                    {/* Nav Links (hidden when compact) */}
                    {!isCompact && (
                        <nav className="hidden md:flex items-center gap-6">
                            {["Why Us?", "Features", "Programs"].map((link) => (
                                <a
                                    key={link}
                                    href={`#${link.toLowerCase().replace(" ", "-").replace("?", "")}`}
                                    className="text-sm font-medium text-white/80 hover:text-[var(--accent)] transition-colors"
                                >
                                    {link}
                                </a>
                            ))}
                        </nav>
                    )}

                    {/* CTA Button */}
                    <Button
                        onClick={onCtaClick}
                        className={cn(
                            "rounded-full px-5 text-base font-medium transition-all active:scale-95",
                            "bg-white text-[var(--primary)] hover:bg-white/90 border-2 border-transparent hover:border-[var(--accent)]",
                            "shadow-none h-10"
                        )}
                    >
                        <span className="hidden sm:inline">Join the Waitlist</span>
                        <span className="sm:hidden">Join</span>
                    </Button>
                </div>
            </motion.div>
        </motion.header>
    );
}
