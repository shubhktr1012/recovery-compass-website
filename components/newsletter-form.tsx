"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, CheckCircle2, AlertCircle, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// Shared Hook - Encapsulates form state and submission logic
// ─────────────────────────────────────────────────────────────────────────────

type FormStatus = "idle" | "loading" | "success" | "error";

function useNewsletterForm() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<FormStatus>("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus("loading");

        // Mock submission
        setTimeout(() => {
            setStatus("success");
        }, 1500);
    };

    const isDisabled = status === "loading" || status === "success";

    return { email, setEmail, status, handleSubmit, isDisabled };
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared Components - Used by both variants
// ─────────────────────────────────────────────────────────────────────────────

function StatusMessages({ status }: { status: FormStatus }) {
    return (
        <div className="absolute top-full left-0 mt-1 pl-1 w-full">
            <AnimatePresence>
                {status === "error" && (
                    <motion.div
                        initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="flex items-center gap-1.5 text-red-300 text-sm"
                    >
                        <AlertCircle className="w-4 h-4" aria-hidden="true" />
                        <span>Something went wrong. Please try again.</span>
                    </motion.div>
                )}
                {status === "success" && (
                    <motion.div
                        initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="flex items-center gap-1.5 text-green-300 text-sm"
                    >
                        <span>You're on the list! We'll be in touch.</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// DefaultNewsletterForm - Hero/CTA pill-style form
// ─────────────────────────────────────────────────────────────────────────────

interface DefaultNewsletterFormProps {
    alignment?: "left" | "center" | "right";
    className?: string;
}

export function DefaultNewsletterForm({ alignment = "right", className }: DefaultNewsletterFormProps) {
    const { email, setEmail, status, handleSubmit, isDisabled } = useNewsletterForm();
    const isCenter = alignment === "center";

    return (
        <div className={cn(
            "w-full max-w-md mx-auto",
            alignment === "right" && "lg:ml-auto",
            alignment === "left" && "lg:mr-auto",
            className
        )}>
            <form onSubmit={handleSubmit} className="relative">
                <div className="bg-white p-1.5 rounded-full shadow-2xl flex items-center gap-2 group focus-within:ring-2 focus-within:ring-white/20 transition-all">
                    <div className="relative flex-grow">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-[oklch(0.2475_0.0661_146.79)]/30 hidden sm:block" aria-hidden="true" />
                        <Input
                            type="email"
                            name="email"
                            autoComplete="email"
                            aria-label="Email address"
                            placeholder="Enter your email…"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="h-12 bg-transparent border-none text-[oklch(0.2475_0.0661_146.79)] placeholder:text-[oklch(0.2475_0.0661_146.79)]/40 pl-4 sm:pl-14 focus-visible:ring-0 text-base font-medium"
                            required
                            disabled={isDisabled}
                        />
                    </div>
                    <Button
                        type="submit"
                        disabled={isDisabled}
                        className={cn(
                            "relative overflow-hidden h-12 px-4 sm:px-8 bg-[oklch(0.2475_0.0661_146.79)] text-white hover:bg-[oklch(0.2475_0.0661_146.79)]/90 rounded-full font-bold transition-all duration-300 group/btn whitespace-nowrap min-w-[100px]",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.2475_0.0661_146.79)] focus-visible:ring-offset-2",
                            status === "loading" && "opacity-80 cursor-not-allowed",
                            status === "success" && "bg-green-500 hover:bg-green-600"
                        )}
                    >
                        {status === "loading" ? (
                            <Loader2 className="h-5 w-5 animate-spin mx-auto" aria-hidden="true" />
                        ) : status === "success" ? (
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                                <span className="hidden sm:inline">Joined</span>
                            </div>
                        ) : (
                            <>
                                <span className="relative z-10 hidden sm:inline">Join Waitlist</span>
                                <span className="relative z-10 sm:hidden">Join</span>
                            </>
                        )}

                        {/* Shimmer Effect - Only show when idle */}
                        {status === "idle" && (
                            <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]" />
                        )}
                    </Button>
                </div>

                <StatusMessages status={status} />
            </form>

            <div className={cn(
                "mt-8 flex flex-col items-center gap-4 px-4 sm:px-0",
                alignment === "right" && "lg:items-start xl:items-start",
                alignment === "left" && "lg:items-start",
                alignment === "center" && "lg:items-center"
            )}>
                <p className={cn(
                    "text-sm text-white font-satoshi flex items-center gap-2 font-medium drop-shadow-sm justify-center",
                    !isCenter && "lg:justify-start"
                )}>
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    Limited spots for beta access
                </p>
                <div className={cn("h-px w-24 bg-white/20 hidden", !isCenter && "lg:block", isCenter && "lg:hidden")} />
                <p className={cn(
                    "text-[10px] uppercase tracking-[0.2em] text-white/50 font-bold drop-shadow-sm text-center",
                    !isCenter && "lg:text-left"
                )}>
                    Protected by Compass Security
                </p>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// MinimalNewsletterForm - Footer underline-style form
// ─────────────────────────────────────────────────────────────────────────────

interface MinimalNewsletterFormProps {
    alignment?: "left" | "center" | "right";
    className?: string;
}

export function MinimalNewsletterForm({ alignment = "left", className }: MinimalNewsletterFormProps) {
    const { email, setEmail, status, handleSubmit, isDisabled } = useNewsletterForm();

    return (
        <div className={cn(
            "w-full max-w-md mx-auto",
            alignment === "right" && "lg:ml-auto",
            alignment === "left" && "lg:mr-auto",
            className
        )}>
            <form onSubmit={handleSubmit} className="relative">
                <div className="space-y-2">
                    <label htmlFor="email-minimal" className="text-xs uppercase tracking-widest text-white/40 font-medium">
                        Enter Your Email
                    </label>
                    <div className="flex items-end gap-4">
                        <input
                            id="email-minimal"
                            type="email"
                            name="email"
                            autoComplete="email"
                            placeholder="hello@example.com…"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isDisabled}
                            className="flex-1 bg-transparent border-b border-white/20 py-3 text-lg placeholder:text-white/20 text-white focus:outline-none focus:border-white transition-colors disabled:opacity-50"
                        />
                        <Button
                            type="submit"
                            disabled={isDisabled}
                            className={cn(
                                "rounded-full bg-white text-[oklch(0.2475_0.0661_146.79)] hover:bg-white/90 font-medium px-8 min-w-[100px]",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[oklch(0.2475_0.0661_146.79)]",
                                status === "loading" && "opacity-80 cursor-not-allowed",
                                status === "success" && "bg-green-500 text-white hover:bg-green-600"
                            )}
                        >
                            {status === "loading" ? (
                                <Loader2 className="h-5 w-5 animate-spin mx-auto" aria-hidden="true" />
                            ) : status === "success" ? (
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                                    <span>Joined</span>
                                </div>
                            ) : (
                                "Join"
                            )}
                        </Button>
                    </div>
                </div>

                <StatusMessages status={status} />
            </form>
        </div>
    );
}

