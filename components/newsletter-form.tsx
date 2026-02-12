"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// Shared Hook - Encapsulates form state and submission logic
// ─────────────────────────────────────────────────────────────────────────────

type FormStatus = "idle" | "loading" | "success" | "error";

interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    countryCode: string;
}

const COUNTRY_CODES = [
    { code: "IN", dial: "+91", flag: "🇮🇳", label: "India (+91)" },
    { code: "US", dial: "+1", flag: "🇺🇸", label: "USA (+1)" },
    { code: "GB", dial: "+44", flag: "🇬🇧", label: "UK (+44)" },
    { code: "CA", dial: "+1", flag: "🇨🇦", label: "Canada (+1)" },
    { code: "AU", dial: "+61", flag: "🇦🇺", label: "Australia (+61)" },
    { code: "DE", dial: "+49", flag: "🇩🇪", label: "Germany (+49)" },
    { code: "FR", dial: "+33", flag: "🇫🇷", label: "France (+33)" },
    { code: "JP", dial: "+81", flag: "🇯🇵", label: "Japan (+81)" },
    { code: "NZ", dial: "+64", flag: "🇳🇿", label: "NZ (+64)" },
];

function useNewsletterForm() {
    const [formData, setFormData] = useState<FormData>({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        countryCode: "+91"
    });
    const [status, setStatus] = useState<FormStatus>("idle");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.email || !formData.firstName) return;

        setStatus("loading");

        try {
            const response = await fetch("/api/waitlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const data = await response.json();
                console.error("Submission failed:", data.error);
                setStatus("error");
                return;
            }

            setStatus("success");
            // Optional: Reset form or keep it filled
            setFormData({ firstName: "", lastName: "", email: "", phone: "", countryCode: "+91" });
        } catch (error) {
            console.error("Submission error:", error);
            setStatus("error");
        }
    };

    const isDisabled = status === "loading" || status === "success";

    return { formData, handleChange, status, handleSubmit, isDisabled };
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared Components
// ─────────────────────────────────────────────────────────────────────────────

function StatusMessages({ status }: { status: FormStatus }) {
    return (
        <div className="w-full text-center">
            <AnimatePresence mode="wait">
                {status === "error" && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: "auto", marginTop: 8 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="flex items-center justify-center gap-1.5 text-red-400 text-sm font-medium">
                            <AlertCircle className="w-4 h-4" aria-hidden="true" />
                            <span>Something went wrong. Please try again.</span>
                        </div>
                    </motion.div>
                )}
                {status === "success" && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: "auto", marginTop: 8 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="flex items-center justify-center gap-1.5 text-green-400 text-sm font-medium">
                            <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                            <span>You're on the list! We'll be in touch.</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// DefaultNewsletterForm - Enhanced Multi-field Form
// ─────────────────────────────────────────────────────────────────────────────

interface DefaultNewsletterFormProps {
    alignment?: "left" | "center" | "right";
    className?: string;
}

export function DefaultNewsletterForm({ alignment = "right", className }: DefaultNewsletterFormProps) {
    const { formData, handleChange, status, handleSubmit, isDisabled } = useNewsletterForm();

    // High contrast inputs with "Pill" aesthetic
    // Using bg-white/90 for slight transparency but high readability
    const inputClasses = "h-12 rounded-full bg-white/90 border-0 text-zinc-900 placeholder:text-zinc-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:bg-white transition-all font-medium px-6 shadow-md";

    // Select classes needs appearance-none to look good
    const selectClasses = cn(inputClasses, "appearance-none pr-8 cursor-pointer");

    return (
        <div className={cn(
            "w-full max-w-md mx-auto",
            alignment === "right" && "lg:ml-auto",
            alignment === "left" && "lg:mr-auto",
            className
        )}>
            <form onSubmit={handleSubmit} className="relative space-y-4">

                {/* Name Row */}
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={inputClasses}
                        required
                        disabled={isDisabled}
                        aria-label="First Name"
                        autoComplete="given-name"
                    />
                    <Input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={inputClasses}
                        required
                        disabled={isDisabled}
                        aria-label="Last Name"
                        autoComplete="family-name"
                    />
                </div>

                {/* Email */}
                <Input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    className={inputClasses}
                    required
                    disabled={isDisabled}
                    aria-label="Email Address"
                    autoComplete="email"
                />

                {/* Phone Row */}
                <div className="flex gap-3">
                    <div className="relative w-36 shrink-0">
                        <select
                            name="countryCode"
                            value={formData.countryCode}
                            onChange={handleChange}
                            className={cn(selectClasses, "w-full text-base")}
                            disabled={isDisabled}
                            aria-label="Country Code"
                        >
                            {COUNTRY_CODES.map((country) => (
                                <option key={country.code} value={country.dial}>
                                    {country.flag} {country.dial}
                                </option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-zinc-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down w-4 h-4"><path d="m6 9 6 6 6-6" /></svg>
                        </div>
                    </div>
                    <Input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleChange}
                        className={cn(inputClasses, "flex-1")}
                        required
                        disabled={isDisabled}
                        aria-label="Phone Number"
                        autoComplete="tel"
                    />
                </div>

                {/* Submit Button */}
                <Button
                    type="submit"
                    disabled={isDisabled}
                    className={cn(
                        "w-full h-12 rounded-full bg-[oklch(0.2475_0.0661_146.79)] text-white hover:bg-[oklch(0.2475_0.0661_146.79)]/90 font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5",
                        "focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
                        status === "loading" && "opacity-80 cursor-not-allowed",
                        status === "success" && "bg-green-500 text-white hover:bg-green-600"
                    )}
                >
                    {status === "loading" ? (
                        <Loader2 className="h-5 w-5 animate-spin mx-auto" aria-hidden="true" />
                    ) : status === "success" ? (
                        <div className="flex items-center justify-center gap-2">
                            <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                            <span>Joined Waitlist</span>
                        </div>
                    ) : (
                        "Join Waitlist"
                    )}
                </Button>

                <StatusMessages status={status} />
            </form>

            <div className="mt-4 flex flex-col items-center gap-2">
                <p className="text-xs text-white/60 font-medium flex items-center gap-1.5 px-4 py-1 rounded-full bg-black/20 backdrop-blur-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
                    Secure & Confidential. Unsubscribe anytime.
                </p>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// MinimalNewsletterForm - Footer "Join Waitlist" Button (Scrolls to CTA)
// ─────────────────────────────────────────────────────────────────────────────

interface MinimalNewsletterFormProps {
    alignment?: "left" | "center" | "right";
    className?: string; // Kept for compatibility
}

export function MinimalNewsletterForm({ alignment = "left", className }: MinimalNewsletterFormProps) {
    const scrollToWaitlist = () => {
        const element = document.getElementById('waitlist');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className={cn(
            "w-full max-w-md",
            alignment === "right" && "lg:ml-auto",
            alignment === "left" && "lg:mr-auto",
            className
        )}>
            <Button
                onClick={scrollToWaitlist}
                className="bg-white text-[oklch(0.2475_0.0661_146.79)] hover:bg-white/90 rounded-full px-8 h-12 font-medium transition-all hover:scale-105 active:scale-95 group"
            >
                Join the Movement
            </Button>
        </div>
    );
}

