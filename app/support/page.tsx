"use client";

import { FooterVariantTwo } from "@/components/sections/footer-2";
import { NavbarSticky } from "@/components/navbar-sticky";
import { FAQSection } from "@/components/sections/faq";
import { motion } from "framer-motion";
import { Mail, Clock, ShieldCheck } from "lucide-react";

export default function SupportPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-primary/20">
            <NavbarSticky />

            <main className="flex-1 w-full pt-16 pb-24 overflow-hidden relative">
                {/* Background Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-primary/20 blur-[120px] rounded-[100%] pointer-events-none opacity-50" />

                <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10">

                    {/* Hero Section */}
                    <div className="max-w-3xl mx-auto text-center mb-20 md:mb-28">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="text-4xl md:text-5xl lg:text-6xl font-erode font-medium tracking-tight text-foreground mb-6 text-balance"
                        >
                            How can we support your <span className="text-primary italic">journey?</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto"
                        >
                            Whether you&apos;re facing technical bumps, billing questions, or just need guidance finding your footing, our team is ready to help you navigate it.
                        </motion.p>
                    </div>

                    {/* Contact Card Set */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="max-w-3xl mx-auto w-full"
                    >
                        <a
                            href="mailto:info@recoverycompass.co"
                            className="group block relative overflow-hidden rounded-[2rem] bg-secondary/20 border border-border/50 p-8 md:p-12 hover:bg-secondary/40 transition-colors duration-500 will-change-transform"
                        >
                            {/* Hover Gradient Effect */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-12">
                                <div className="flex-shrink-0 size-20 md:size-24 rounded-[1.5rem] bg-background border border-border/50 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-500 shadow-xl shadow-black/5">
                                    <Mail className="size-10" strokeWidth={1.5} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-3xl font-erode font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                                        Drop us a line
                                    </h3>
                                    <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                                        Our dedicated support team aims to reply within 24 hours. We treat every message with care and confidentiality.
                                    </p>
                                    <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-border/40">
                                        <div className="flex items-center gap-2 text-sm font-medium text-foreground/80">
                                            <Clock className="size-4 text-primary" />
                                            <span>24 hr Target Response</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm font-medium text-foreground/80">
                                            <ShieldCheck className="size-4 text-primary" />
                                            <span>Private & Secure</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Animated Arrow */}
                            <div className="absolute top-12 right-12 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 hidden md:flex items-center justify-center size-12 rounded-full bg-primary text-primary-foreground">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </a>
                    </motion.div>
                </div>
            </main>

            {/* Reused FAQ Section for self-serve help */}
            {/* The FAQ section was designed for the light background section of the homepage, so we wrap it here too */}
            <div className="bg-[#F8FAF2] rounded-t-[3rem] md:rounded-t-[4rem] relative z-20 overflow-hidden">
                <FAQSection />
            </div>

            <FooterVariantTwo />
        </div>
    );
}
