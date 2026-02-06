"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavbarStickyProps {
    onCtaClick?: () => void; // Deprecated, but kept for compatibility during refactor
}

export function NavbarSticky({ }: NavbarStickyProps) {
    const [isOpen, setIsOpen] = React.useState(false);

    const scrollToWaitlist = () => {
        document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <motion.header
            className="sticky top-0 z-50 w-full bg-white"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
        >
            <div className="flex items-center justify-between px-6 md:px-12 py-4 max-w-[1200px] mx-auto">

                {/* Brand */}
                <div className="flex items-center gap-2 text-[var(--primary)]">
                    <Image
                        src="/rc-logo-amalfi-blue.svg"
                        alt="Recovery Compass"
                        width={32}
                        height={32}
                        className="size-8"
                    />
                    <span className="font-erode text-xl font-semibold tracking-tighter text-[var(--primary)]">
                        Recovery Compass
                    </span>
                    <span className="ml-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded-full border border-[var(--accent)] text-[var(--accent)]">
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
                                className="text-base font-medium text-[var(--primary)] hover:text-[var(--primary)]/70 transition-colors"
                            >
                                {link}
                            </a>
                        ))}
                    </nav>

                    {/* Desktop CTA */}
                    <Button
                        onClick={scrollToWaitlist}
                        className={cn(
                            "hidden md:inline-flex rounded-full px-6 text-base font-medium transition-all active:scale-95",
                            "bg-white text-primary border-2 border-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--primary)]",
                            "shadow-none h-11"
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
                            animate={isOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                            className="w-5 h-0.5 bg-[var(--primary)] block origin-center rounded-full"
                        />
                        {/* Bottom Line */}
                        <motion.span
                            animate={isOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                            className="w-5 h-0.5 bg-[var(--primary)] block origin-center rounded-full"
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
                        className="md:hidden absolute top-full left-0 w-full bg-white border-b border-[var(--primary)]/5 shadow-lg overflow-hidden"
                    >
                        <nav className="flex flex-col gap-6 px-6 py-6 items-start">
                            {["Why Us?", "Features", "Programs"].map((link, i) => (
                                <motion.a
                                    key={link}
                                    href={`#${link.toLowerCase().replace(" ", "-").replace("?", "")}`}
                                    className="text-base font-medium text-[var(--primary)]"
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
                                        "bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90",
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
