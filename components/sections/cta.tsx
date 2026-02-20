"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { DefaultNewsletterForm } from "@/components/newsletter-form";

export function CTASection() {
    return (
        <section id="waitlist" className="py-16 md:py-24 px-6 md:px-12 max-w-[1400px] mx-auto scroll-mt-24">
            <div className="relative w-full min-h-[450px] md:min-h-[520px] rounded-3xl overflow-hidden flex flex-col justify-center shadow-[0_30px_40px_-10px_rgba(0,0,0,0.6)]">
                {/* Background Image - Absolute Fill */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/cta-bg.png"
                        alt="Waitlist Background"
                        fill
                        className="object-cover pointer-events-none select-none"
                        priority
                    />
                    {/* Subtle Overlay for Readability */}
                    <div className="absolute inset-0 bg-black/10 lg:bg-gradient-to-r lg:from-black/20 lg:via-transparent lg:to-transparent" />
                </div>

                {/* Content Overlay */}
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 p-8 md:p-16 lg:px-20 items-center">

                    {/* Left Column: Text (Span 7) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="lg:col-span-7 flex flex-col items-center text-center lg:items-start lg:text-left space-y-8"
                    >
                        <div className="flex">
                            <Badge
                                variant="secondary"
                                className="rounded-full px-5 py-2 text-xs font-semibold tracking-widest border-none bg-white text-[oklch(0.2475_0.0661_146.79)]"
                            >
                                WAITLIST
                            </Badge>
                        </div>

                        <div className="space-y-6">
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-erode font-medium tracking-tighter text-white leading-[1.10] drop-shadow-md">
                                Ready to find your <br />
                                <span className="font-medium text-white/90">True North?</span>
                            </h2>
                            <p className="text-lg md:text-xl text-white font-satoshi max-w-xl leading-relaxed font-normal drop-shadow-sm">
                                We&apos;re building a science-led path to recovery that respects your biology. Join the waitlist to be first in line when we launch.
                            </p>
                        </div>
                    </motion.div>


                    {/* Right Column: Input Part (Span 5) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="lg:col-span-5 w-full max-w-md mx-auto lg:ml-auto"
                    >
                        <DefaultNewsletterForm />
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
