"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TestimonialMarquee } from "./testimonials/testimonial-marquee";
import type { HomepageTestimonial } from "@/lib/testimonials";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, Variants } from "framer-motion";

interface HeroOmegaProps {
    testimonials?: HomepageTestimonial[];
    onExploreClick?: () => void;
}


const APP_STORE_URL = "https://apps.apple.com/in/app/recovery-compass-wellness/id6761656102";

export function HeroOmega({ testimonials = [], onExploreClick }: HeroOmegaProps) {

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
        <section className="relative flex flex-col justify-start pt-12 pb-0 md:pt-16 md:pb-2 overflow-hidden bg-white text-[oklch(0.2475_0.0661_146.79)]">
            {/* Content Container */}
            <div className="relative z-20 w-full max-w-[1200px] mx-auto px-6 md:px-12 lg:px-24 flex flex-col justify-start pt-0 pb-0">
                <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-y-6 lg:gap-x-12 items-center">

                    {/* Centered Content Block (Mobile First) */}
                    <motion.div
                        className="lg:col-span-10 lg:col-start-2 flex flex-col items-center text-center space-y-5 md:space-y-6"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >

                        {/* Avatar Trust Bar - Centered */}
                        <motion.div variants={itemVariants} className="flex flex-row items-center justify-center gap-3">
                            <p className="text-sm md:text-base font-medium text-[oklch(0.2475_0.0661_146.79)]">
                                Guided support for daily balance
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
                                        whileHover={{ y: -4 }}
                                        transition={{ duration: 0.3, ease: "easeOut" }}
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
                        <div className="max-w-[320px] md:max-w-[600px] lg:max-w-[560px] mx-auto space-y-5 md:space-y-6">
                            {/* Status Pill */}
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[oklch(0.2475_0.0661_146.79)]/5 border border-[oklch(0.2475_0.0661_146.79)]/10">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                                </span>
                                <span className="text-[10px] md:text-xs font-bold text-[oklch(0.2475_0.0661_146.79)]/80 tracking-wide uppercase">
                                    A Behavioral Guidance App <span className="hidden md:inline"> - Open Beta Launching Soon</span>
                                    <span className="md:hidden"> - Open Beta Soon</span>
                                </span>
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-7xl font-erode font-medium tracking-tighter leading-[1.10] text-black">
                                Steady progress, <span className="whitespace-nowrap"><span className="italic text-[oklch(0.2475_0.0661_146.79)]">without</span> pressure.</span>
                            </h1>

                            <p className="text-base md:text-xl text-[oklch(0.2475_0.0661_146.79)]/70 leading-snug font-medium max-w-2xl mx-auto">
                                Recovery Compass is a behavioral guidance app that helps people regain control over smoking, alcohol, sleep, erections, age reversal, and more by teaching them how to respond to change in real time according to their lifestyle.
                            </p>
                        </div>

                        {/* CTAs - Centered & Customized */}
                        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 justify-center items-center w-full pt-2 md:pt-4">
                            {/* App Store Primary CTA */}
                            <a
                                href={APP_STORE_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                id="hero-app-store-cta"
                                className={cn(
                                    "inline-flex items-center gap-2.5 rounded-full px-5 py-2.5 transition-all active:scale-95",
                                    "bg-[oklch(0.2475_0.0661_146.79)] text-white hover:bg-[oklch(0.2475_0.0661_146.79)]/90 border border-transparent",
                                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.2475_0.0661_146.79)] focus-visible:ring-offset-2"
                                )}
                            >
                                {/* Apple Logo */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 814 1000"
                                    className="w-4 h-4 shrink-0 fill-white"
                                    aria-hidden="true"
                                >
                                    <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.5 135.4-317.3 268.5-317.3 71 0 130.1 46.4 175 46.4 42.3 0 109.1-49.1 185.6-49.1 29.8 0 108.2 2.6 168.4 79.3zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" />
                                </svg>
                                <span className="text-sm font-medium">Download our app</span>
                            </a>

                            {/* Explore Programs Secondary */}
                            <Button
                                className={cn(
                                    "rounded-full px-5 py-2.5 text-sm font-medium transition-all active:scale-95",
                                    "bg-white text-[oklch(0.2475_0.0661_146.79)] border border-[oklch(0.2475_0.0661_146.79)] hover:bg-[oklch(0.2475_0.0661_146.79)] hover:text-white h-auto",
                                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                                )}
                                onClick={onExploreClick}
                            >
                                Explore Programs
                            </Button>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Testimonial Strip - Sitting organically below the content container */}
            {testimonials.length > 0 ? (
                <motion.div
                    className="relative z-0 w-full mt-8 md:mt-10 overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 1 }}
                >
                    <TestimonialMarquee testimonials={testimonials} className="py-8" />
                </motion.div>
            ) : null}

        </section >
    );
}
