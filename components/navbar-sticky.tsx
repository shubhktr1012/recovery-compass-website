"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavbarStickyProps {
    onCtaClick?: () => void; // Deprecated, but kept for compatibility during refactor
}

export function NavbarSticky({ }: NavbarStickyProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [isScrolled, setIsScrolled] = React.useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsScrolled(latest > 50);
    });

    React.useEffect(() => {
        setIsScrolled(window.scrollY > 50);
    }, []);

    const scrollToWaitlist = () => {
        document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" });
    };

    // When menu is open, we want solid bg regardless of scroll
    const isTransparent = !isScrolled && !isOpen;

    return (
        <motion.header
            className={cn(
                "fixed top-0 z-50 w-full transition-all duration-300",
                isTransparent ? "bg-transparent" : "bg-white"
            )}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
        >
            <div className="flex items-center justify-between px-6 md:px-12 py-4 max-w-[1200px] mx-auto">

                {/* Brand */}
                <div className="flex items-center gap-2 transition-colors duration-300">
                    <Image
                        src={isTransparent ? "/rc-logo-white.svg" : "/rc-logo-dark-green.svg"}
                        alt="Recovery Compass"
                        width={32}
                        height={32}
                        className="size-8"
                    />
                    <span className={cn(
                        "text-xl font-semibold tracking-tighter transition-colors duration-300",
                        isTransparent ? "text-white" : "text-[oklch(0.2475_0.0661_146.79)]"
                    )}>
                        Recovery Compass
                    </span>
                    <span className={cn(
                        "ml-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded-full border",
                        isTransparent
                            ? "border-white/30 text-white/80"
                            : "border-[oklch(0.2475_0.0661_146.79)]/30 text-[oklch(0.2475_0.0661_146.79)]/60"
                    )}>
                        Preview
                    </span>
                </div>

                {/* Right Actions (Nav + CTA + Mobile Toggle) */}
                <div className="flex items-center gap-8">
                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        {["Why Us?", "Features", "Programs"].map((link) => (
                            <a
                                key={link}
                                href={`#${link.toLowerCase().replace(" ", "-").replace("?", "")}`}
                                className={cn(
                                    "text-base font-medium transition-colors duration-300",
                                    isTransparent
                                        ? "text-white/90 hover:text-white"
                                        : "text-[oklch(0.2475_0.0661_146.79)] hover:text-[oklch(0.2475_0.0661_146.79)]/70"
                                )}
                            >
                                {link}
                            </a>
                        ))}
                    </nav>

                    {/* Desktop CTA */}
                    <Button
                        onClick={scrollToWaitlist}
                        className={cn(
                            "hidden md:inline-flex rounded-full px-6 text-base font-medium transition-all duration-300 active:scale-95",
                            isTransparent
                                ? "bg-white text-[oklch(0.2475_0.0661_146.79)] hover:bg-white/90"
                                : "bg-[oklch(0.2475_0.0661_146.79)] text-white hover:bg-[oklch(0.2475_0.0661_146.79)]/90",
                            "border-none shadow-none h-11"
                        )}
                    >
                        Join Waitlist
                    </Button>

                    {/* Mobile Menu Toggle (2-Line Animated Icon) */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 z-50 relative focus:outline-none"
                        aria-label="Toggle menu"
                    >
                        {/* Top Line */}
                        <motion.span
                            animate={isOpen ? { rotate: 45, y: 4, backgroundColor: "#1C2706" } : { rotate: 0, y: 0, backgroundColor: isTransparent ? "#FFFFFF" : "#1C2706" }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                            className="w-5 h-0.5 block origin-center rounded-full"
                        />
                        {/* Bottom Line */}
                        <motion.span
                            animate={isOpen ? { rotate: -45, y: -4, backgroundColor: "#1C2706" } : { rotate: 0, y: 0, backgroundColor: isTransparent ? "#FFFFFF" : "#1C2706" }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                            className="w-5 h-0.5 block origin-center rounded-full"
                        />
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="md:hidden absolute top-full left-0 w-full bg-white border-b border-[oklch(0.2475_0.0661_146.79)]/5 shadow-lg overflow-hidden"
                    >
                        <nav className="flex flex-col gap-6 px-6 py-6 items-start">
                            {["Why Us?", "Features", "Programs"].map((link, i) => (
                                <motion.a
                                    key={link}
                                    href={`#${link.toLowerCase().replace(" ", "-").replace("?", "")}`}
                                    className="text-base font-medium text-[oklch(0.2475_0.0661_146.79)]"
                                    onClick={() => setIsOpen(false)}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
                                >
                                    {link}
                                </motion.a>
                            ))}
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.6, delay: 0.6 }}
                            >
                                <Button
                                    onClick={() => {
                                        scrollToWaitlist();
                                        setIsOpen(false);
                                    }}
                                    className={cn(
                                        "w-auto rounded-full px-6 py-3 text-base font-medium",
                                        "bg-[oklch(0.2475_0.0661_146.79)] text-white hover:bg-[oklch(0.2475_0.0661_146.79)]/90",
                                        "h-auto"
                                    )}
                                >
                                    Join Waitlist
                                </Button>
                            </motion.div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}
