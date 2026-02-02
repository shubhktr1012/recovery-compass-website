"use client";

import * as React from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Compass } from "lucide-react";
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
                    // Styling: Deep Moss Capsule (#1C2706) with subtle transparency
                    "bg-[#1C2706]/95 backdrop-blur-md shadow-lg",
                    // Width constraint - Mobile: full, Desktop: Dynamic
                    "w-full border border-[#F8FAF2]/10",
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
                <div className="flex items-center gap-2 text-[#F8FAF2]">
                    <div className="flex size-8 items-center justify-center rounded-full bg-[#F8FAF2]/10">
                        <Compass className="size-5 text-[#F8FAF2]" strokeWidth={1.5} />
                    </div>
                    <span className="font-sans text-xl font-medium tracking-tighter text-[#FFFFFF] hidden md:inline-block">
                        Recovery Compass
                    </span>
                </div>

                {/* Center: Empty Space (as per Wireframe) */}
                <div className="flex-1" />

                {/* Right: CTA */}
                <div className="flex items-center gap-2">
                    {/* Mobile-only "Commit" text adjustment could go here if needed, 
               but wireframe says "Commit to Quitting" (Pre-Launch). 
               We might shorten for mobile. */}
                    <Button
                        onClick={onCtaClick}
                        className={cn(
                            "rounded-full px-5 text-base font-medium transition-transform active:scale-95",
                            "bg-white text-[#1C2706] hover:bg-white/90",
                            "border-none shadow-none h-10"
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
