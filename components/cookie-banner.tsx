"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X, Cookie } from "lucide-react";

export function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem("cookie-consent");
        if (!consent) {
            // Delay showing the banner for a smoother entry
            const timer = setTimeout(() => setIsVisible(true), 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem("cookie-consent", "true");
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 20, opacity: 0, scale: 0.98 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 20, opacity: 0, scale: 0.98 }}
                    transition={{
                        type: "spring",
                        damping: 25,
                        stiffness: 120,
                        opacity: { duration: 0.4 }
                    }}
                    className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:w-[420px] z-[100]"
                >
                    <div className="relative overflow-hidden bg-secondary/40 backdrop-blur-2xl border border-secondary/50 rounded-3xl p-7 shadow-[0_20px_50px_rgba(0,0,0,0.1)] group">
                        {/* Decorative subtle gradient */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />

                        <div className="relative flex flex-col gap-6">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex flex-col gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                        <Cookie className="w-6 h-6" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <h3 className="font-erode text-2xl font-semibold text-foreground tracking-tight">
                                            Cookies
                                        </h3>
                                        <p className="text-[15px] text-foreground/70 leading-relaxed font-sans">
                                            We use cookies to improve your experience. Read our{" "}
                                            <Link
                                                href="/privacy"
                                                className="text-primary font-medium border-b border-primary/20 hover:border-primary transition-all"
                                                onClick={() => setIsVisible(false)}
                                            >
                                                Privacy Policy
                                            </Link>
                                            .
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsVisible(false)}
                                    className="p-2 rounded-full hover:bg-primary/5 text-foreground/40 hover:text-foreground/80 transition-all"
                                    aria-label="Close"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleAccept}
                                    className="h-12 px-8 bg-primary text-primary-foreground text-[15px] font-medium rounded-full hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/10"
                                >
                                    Accept all
                                </button>
                                <button
                                    onClick={() => setIsVisible(false)}
                                    className="h-12 px-6 text-[15px] font-medium text-foreground/60 hover:text-foreground hover:bg-secondary/60 rounded-full transition-all"
                                >
                                    Essential only
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
