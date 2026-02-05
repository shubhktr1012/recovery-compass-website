"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TestimonialMarquee } from "./testimonials/testimonial-marquee";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { motion, Variants } from "framer-motion";

interface HeroOmegaProps {
    onSecondaryClick?: () => void;
}

export function HeroOmega({ onSecondaryClick }: HeroOmegaProps) {
    const scrollToWaitlist = () => {
        document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" });
    };

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut",
            },
        },
    };

    return (
        <section className="relative flex flex-col justify-start pt-12 pb-6 overflow-hidden bg-white text-[oklch(0.2475_0.0661_146.79)]">
            {/* Content Container */}
            <div className="relative z-20 w-full max-w-[1200px] mx-auto px-6 md:px-12 lg:px-24 flex flex-col justify-start pt-4 pb-12">
                <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-y-8 lg:gap-x-12 items-center">

                    {/* Centered Content Block (Mobile First) */}
                    <motion.div
                        className="lg:col-span-10 lg:col-start-2 flex flex-col items-center text-center space-y-6"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >

                        {/* Avatar Trust Bar - Centered */}
                        <motion.div variants={itemVariants} className="flex flex-row items-center justify-center gap-3">
                            <p className="text-base font-medium text-[oklch(0.2475_0.0661_146.79)]">
                                Join 2,140+ beyond the urge
                            </p>
                            <div className="flex items-center">
                                {[
                                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64",
                                    "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=64&h=64",
                                    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&h=64",
                                    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=64&h=64"
                                ].map((src, i) => (
                                    <motion.div
                                        key={i}
                                        className="relative -ml-2 first:ml-0 z-0 hover:z-10"
                                        whileHover={{ scale: 1.2, zIndex: 20 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                    >
                                        <Avatar className="w-7 h-7 border-2 border-[oklch(0.2475_0.0661_146.79)] cursor-pointer">
                                            <AvatarImage src={src} alt="Community member" className="object-cover" />
                                            <AvatarFallback className="bg-[oklch(0.2475_0.0661_146.79)] text-white text-[8px]">M</AvatarFallback>
                                        </Avatar>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Headline - Centered */}
                        <div className="max-w-[320px] md:max-w-[350px] lg:max-w-[520px] mx-auto space-y-6">
                            {/* Status Pill */}
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[oklch(0.2475_0.0661_146.79)]/5 border border-[oklch(0.2475_0.0661_146.79)]/10">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                                </span>
                                <span className="text-[10px] md:text-xs font-bold text-[oklch(0.2475_0.0661_146.79)]/80 tracking-wide uppercase">
                                    Currently In Development — Launching Mid-March
                                </span>
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-7xl font-erode font-semibold tracking-tight leading-[1.05] text-black">
                                A smarter way to <span className="text-[oklch(0.2475_0.0661_146.79)] italic">quit smoking.</span>
                            </h1>

                            {/* Subheadline - Centered */}
                            <p className="text-lg md:text-xl text-[oklch(0.2475_0.0661_146.79)]/70 leading-snug font-medium max-w-2xl mx-auto">
                                The intelligent app designed to navigate nicotine cravings, calm your nervous system, and build a smoke-free life. Stop fighting biology with willpower.
                            </p>
                        </div>

                        {/* CTAs - Centered & Customized */}
                        <motion.div variants={itemVariants} className="flex flex-row gap-3 justify-center w-full pt-4">
                            <Button
                                className={cn(
                                    "rounded-full px-5 py-2.5 text-sm font-medium transition-all active:scale-95",
                                    "bg-[oklch(0.2475_0.0661_146.79)] text-white hover:bg-[oklch(0.2475_0.0661_146.79)]/90 border border-transparent h-auto"
                                )}
                                onClick={scrollToWaitlist}
                            >
                                Join the Waitlist
                            </Button>
                            <Button
                                className={cn(
                                    "rounded-full px-5 py-2.5 text-sm font-medium transition-all active:scale-95",
                                    "bg-white text-[oklch(0.2475_0.0661_146.79)] border border-[oklch(0.2475_0.0661_146.79)] hover:bg-[oklch(0.2475_0.0661_146.79)] hover:text-white h-auto"
                                )}
                                onClick={onSecondaryClick}
                            >
                                Explore Programs
                            </Button>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Testimonial Strip - Sitting organically below the content container */}
            <motion.div
                className="relative z-0 w-full mt-6 overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 1 }}
            >
                <TestimonialMarquee className="py-10" />
            </motion.div>

        </section >
    );
}
