"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, CheckCircle2, AlertCircle, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";



interface NewsletterFormProps {
    alignment?: "left" | "center" | "right";
    variant?: "default" | "minimal";
    className?: string;
}

export function NewsletterForm({ alignment = "right", variant = "default", className }: NewsletterFormProps) {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus("loading");

        // Mock submission
        setTimeout(() => {
            setStatus("success");
            // Reset after showing success for a while if desired, or keep it.
            // setStatus("idle");
            // setEmail("");
        }, 1500);
    };

    const isCenter = alignment === "center";

    return (
        <div className={cn(
            "w-full max-w-md mx-auto",
            alignment === "right" && "lg:ml-auto",
            alignment === "left" && "lg:mr-auto",
            className
        )}>
            <form
                onSubmit={handleSubmit}
                className="relative"
            >
                {variant === "default" ? (
                    <div className="bg-white p-1.5 rounded-full shadow-2xl flex items-center gap-2 group focus-within:ring-2 focus-within:ring-[var(--accent)] transition-all">
                        <div className="relative flex-grow">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-[var(--primary)]/30 hidden sm:block" />
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-12 bg-transparent border-none text-[var(--primary)] placeholder:text-[var(--primary)]/40 pl-4 sm:pl-14 focus-visible:ring-0 text-base font-medium"
                                required
                                disabled={status === "loading" || status === "success"}
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={status === "loading" || status === "success"}
                            className={cn(
                                "relative overflow-hidden h-12 px-4 sm:px-8 bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 rounded-full font-bold transition-all duration-300 group/btn whitespace-nowrap min-w-[100px]",
                                status === "loading" && "opacity-80 cursor-not-allowed",
                                status === "success" && "bg-green-500 hover:bg-green-600"
                            )}
                        >
                            {status === "loading" ? (
                                <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                            ) : status === "success" ? (
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="h-5 w-5" />
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
                ) : (
                    // Minimal Variant (Footer Style)
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-white/40 font-medium">
                            Enter Your Email
                        </label>
                        <div className="flex items-end gap-4">
                            <input
                                type="email"
                                placeholder="hello@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={status === "loading" || status === "success"}
                                className="flex-1 bg-transparent border-b border-white/20 py-3 text-lg placeholder:text-white/20 text-white focus:outline-none focus:border-white transition-colors disabled:opacity-50"
                            />
                            <Button
                                type="submit"
                                disabled={status === "loading" || status === "success"}
                                className={cn(
                                    "rounded-full bg-white text-[var(--primary)] hover:bg-white/90 font-medium px-8 min-w-[100px]",
                                    status === "loading" && "opacity-80 cursor-not-allowed",
                                    status === "success" && "bg-green-500 text-white hover:bg-green-600"
                                )}
                            >
                                {status === "loading" ? (
                                    <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                                ) : status === "success" ? (
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4" />
                                        <span>Joined</span>
                                    </div>
                                ) : (
                                    "Join"
                                )}
                            </Button>
                        </div>
                    </div>
                )}

                {/* Success Message / Error Message Toast */}
                <div className="absolute top-full left-0 mt-1 pl-1 w-full">
                    <AnimatePresence>
                        {status === "error" && (
                            <motion.div
                                initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                className="flex items-center gap-1.5 text-red-300 text-sm"
                            >
                                <AlertCircle className="w-4 h-4" />
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
            </form>

            {variant === "default" && (
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
            )}
        </div>
    );
}
