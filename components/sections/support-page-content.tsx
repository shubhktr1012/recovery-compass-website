"use client";

import { motion } from "framer-motion";
import { Mail, Clock, ShieldCheck } from "lucide-react";
import { FAQSection } from "@/components/sections/faq";

export function SupportPageContent() {
    return (
        <>
            <main className="flex-1 w-full pt-16 pb-24 overflow-hidden relative">
                {/* Background Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-primary/20 blur-[120px] rounded-[100%] pointer-events-none opacity-50" />

                <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10">

                    {/* Hero Section */}
                    <div className="max-w-3xl mx-auto text-center mb-16 md:mb-20">
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
                            className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-6"
                        >
                            Whether you&apos;re facing technical bumps, billing questions, or just need guidance finding your footing, our team is ready to help you navigate it.
                        </motion.p>
                        
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            className="text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto"
                        >
                            At Recovery Compass, we believe that true progress requires a reliable support system. We know that taking the first step towards behavioral change is challenging enough without worrying about technical glitches or confusing account settings. That&apos;s why our support team is dedicated to providing you with clear, timely, and compassionate assistance whenever you need it. We treat every inquiry with the utmost privacy and care, ensuring you can focus on what truly matters: your recovery and growth.
                        </motion.p>
                    </div>

                    {/* Dedicated Contact Us Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="max-w-4xl mx-auto w-full mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-erode font-medium text-center mb-10 text-foreground">Contact Us</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Contact Methods */}
                            <div className="bg-secondary/10 border border-border/50 rounded-[2rem] p-8">
                                <h3 className="text-2xl font-erode font-semibold mb-4 text-foreground">Get in Touch</h3>
                                <p className="text-muted-foreground mb-6 leading-relaxed">
                                    The fastest way to reach our support team is via email. We monitor our inbox closely and strive to reply to all inquiries as quickly as possible.
                                </p>
                                <a
                                    href="mailto:support@recoverycompass.co"
                                    className="group inline-flex items-center gap-4 bg-primary text-primary-foreground px-6 py-4 rounded-full hover:bg-primary/90 transition-colors duration-300"
                                >
                                    <Mail className="size-5" />
                                    <span className="font-medium text-lg">support@recoverycompass.co</span>
                                </a>
                            </div>

                            {/* What to include */}
                            <div className="bg-secondary/10 border border-border/50 rounded-[2rem] p-8">
                                <h3 className="text-2xl font-erode font-semibold mb-4 text-foreground">How to Help Us Help You</h3>
                                <p className="text-muted-foreground mb-4 leading-relaxed">
                                    To help us resolve your issue swiftly, please include the following details in your email:
                                </p>
                                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                                    <li>The email address associated with your account.</li>
                                    <li>A brief description of the issue or question.</li>
                                    <li>Any relevant screenshots or error messages if applicable.</li>
                                    <li>Device type (iOS, Android, Web) if reporting a technical bug.</li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-8 bg-secondary/20 border border-border/50 rounded-[2rem] p-8 flex flex-col md:flex-row items-center gap-6 justify-center text-center md:text-left">
                            <div className="flex items-center gap-4 text-foreground/80">
                                <div className="p-3 bg-primary/10 rounded-full text-primary">
                                    <Clock className="size-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg text-foreground mb-1">Response Time</h3>
                                    <p className="text-sm text-muted-foreground">We aim to respond to all inquiries within 24 hours.</p>
                                </div>
                            </div>
                            <div className="hidden md:block w-px h-12 bg-border/50 mx-4" />
                            <div className="flex items-center gap-4 text-foreground/80">
                                <div className="p-3 bg-primary/10 rounded-full text-primary">
                                    <ShieldCheck className="size-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg text-foreground mb-1">Privacy First</h3>
                                    <p className="text-sm text-muted-foreground">Your communications are kept strictly confidential.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* Reused FAQ Section for self-serve help */}
            <div className="bg-[#F8FAF2] rounded-t-[3rem] md:rounded-t-[4rem] relative z-20 overflow-hidden">
                <FAQSection />
            </div>
        </>
    );
}
