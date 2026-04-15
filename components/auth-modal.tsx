"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { Loader2, AlertCircle, Eye, EyeOff, CheckCircle2, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    defaultTab?: "signin" | "signup";
}

type AuthView = "signin" | "signup" | "forgot";

// ─────────────────────────────────────────────────────────────────────────────
// Animation Variants
// ─────────────────────────────────────────────────────────────────────────────

const panelVariants = {
    hidden: { opacity: 0, y: 8, scale: 0.99 },
    visible: {
        opacity: 1, y: 0, scale: 1,
        transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
    },
    exit: {
        opacity: 0, y: -8, scale: 0.99,
        transition: { duration: 0.2, ease: "easeIn" }
    }
};

const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } }
};

const fadeUp = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }
};

// ─────────────────────────────────────────────────────────────────────────────
// Social Login Button
// ─────────────────────────────────────────────────────────────────────────────

function SocialButton({
    provider,
    onClick,
    disabled
}: {
    provider: "google" | "apple";
    onClick: () => void;
    disabled: boolean;
}) {
    return (
        <motion.button
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={onClick}
            disabled={disabled}
            className={cn(
                "flex-1 flex items-center justify-center gap-2.5 h-12 rounded-full",
                "border border-zinc-200 bg-white text-zinc-700 font-bold text-sm",
                "shadow-sm hover:shadow-md hover:border-zinc-300 transition-all duration-200",
                "disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none"
            )}
        >
            {provider === "google" ? (
                <>
                    <svg className="size-[18px]" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    <span>Google</span>
                </>
            ) : (
                <>
                    <svg className="size-[18px] fill-current" viewBox="0 0 24 24">
                        <path d="M17.05 20.28c-.96.95-2.04 1.9-3.3 1.9-1.23 0-1.63-.75-3.08-.75-1.46 0-1.9.73-3.08.75-1.2.02-2.43-1.07-3.41-2.06C2.2 18.15.65 14.15 2.65 10.66c1-1.74 2.8-2.85 4.75-2.88 1.48-.02 2.88 1.01 3.79 1.01.91 0 2.6-1.25 4.38-1.07.75.03 2.85.3 4.2 2.26-1.1.66-1.85 1.83-1.85 3.19 0 1.63 1.1 2.72 2.15 3.3-.7 2.02-1.95 3.8-2.98 4.81ZM14.96 5.88c-.78.96-1.96 1.63-3.23 1.55-.17-1.25.4-2.5 1.15-3.41.8-.95 2.1-1.63 3.2-1.6.17 1.34-.34 2.5-1.12 3.46Z" />
                    </svg>
                    <span>Apple</span>
                </>
            )}
        </motion.button>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Pill Input – matches the rest of the site
// ─────────────────────────────────────────────────────────────────────────────

function PillInput({
    id,
    type,
    placeholder,
    value,
    onChange,
    disabled,
    label,
    rightSlot
}: {
    id: string;
    type: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled: boolean;
    label: string;
    rightSlot?: React.ReactNode;
}) {
    return (
        <motion.div variants={fadeUp} className="space-y-1.5">
            <label
                htmlFor={id}
                className="text-[10px] font-bold uppercase tracking-[0.18em] text-[oklch(0.2475_0.0661_146.79)]/50 ml-1 block"
            >
                {label}
            </label>
            <div className="relative">
                <Input
                    id={id}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    autoComplete={id}
                    className={cn(
                        "h-12 rounded-full bg-white/90 border border-zinc-200/80 text-zinc-900",
                        "placeholder:text-zinc-400 font-medium px-5 shadow-sm",
                        "focus-visible:ring-2 focus-visible:ring-[oklch(0.2475_0.0661_146.79)]/30",
                        "focus-visible:border-[oklch(0.2475_0.0661_146.79)]/40 focus-visible:bg-white",
                        "transition-all duration-200",
                        rightSlot && "pr-12"
                    )}
                />
                {rightSlot && (
                    <div className="absolute right-4 inset-y-0 flex items-center">
                        {rightSlot}
                    </div>
                )}
            </div>
        </motion.div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Divider
// ─────────────────────────────────────────────────────────────────────────────

function Divider() {
    return (
        <div className="relative my-1">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-zinc-100" />
            </div>
            <div className="relative flex justify-center">
                <span className="bg-[oklch(0.9484_0.0251_149.08)] px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">
                    or continue with email
                </span>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

export function AuthModal({ isOpen, onClose, defaultTab = "signin" }: AuthModalProps) {
    const [view, setView] = useState<AuthView>(defaultTab);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const reset = () => {
        setEmail("");
        setPassword("");
        setError(null);
        setSuccess(null);
        setShowPassword(false);
    };

    const switchView = (v: AuthView) => {
        reset();
        setView(v);
    };

    const handleEmailAuth = async () => {
        if (!email || !password) {
            setError("Please fill in all fields.");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            if (view === "signup") {
                const { data: authData, error: authError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
                });
                if (authError) throw authError;
                if (authData.user) {
                    await supabase.from("profiles").upsert({
                        id: authData.user.id,
                        email: authData.user.email,
                        onboarding_complete: false,
                        updated_at: new Date().toISOString()
                    });
                }
                setSuccess("Account created! Check your email to confirm.");
            } else {
                const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
                if (authError) throw authError;
                onClose();
            }
        } catch (err: any) {
            const msg = err.message || "Something went wrong.";
            setError(
                msg.includes("Invalid login credentials")
                    ? "Incorrect email or password."
                    : msg.includes("already registered")
                    ? "This email already has an account. Sign in instead."
                    : msg
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        if (!email) { setError("Enter your email above."); return; }
        setIsLoading(true);
        setError(null);
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/reset-password`
            });
            if (error) throw error;
            setSuccess("Reset link sent! Check your inbox.");
        } catch (err: any) {
            setError(err.message || "Could not send reset email.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialAuth = async (provider: "google" | "apple") => {
        setIsLoading(true);
        setError(null);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider,
                options: { redirectTo: `${window.location.origin}/auth/callback` }
            });
            if (error) throw error;
        } catch (err: any) {
            setError(`Could not sign in with ${provider}.`);
            setIsLoading(false);
        }
    };

    // ── Subviews ──────────────────────────────────────────────────────────────

    const panelKey = view;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { reset(); onClose(); } }}>
            <DialogContent className={cn(
                "sm:max-w-[400px] p-0 overflow-hidden border-none",
                "bg-[oklch(0.9484_0.0251_149.08)] shadow-2xl shadow-black/10",
                "rounded-[28px]"
            )}>

                {/* ── Tab Bar (Sign In / Create Account) ── */}
                {view !== "forgot" && (
                    <div className="flex gap-1 p-2 mx-6 mt-6 rounded-full bg-white/60 backdrop-blur-sm border border-white/80 shadow-sm">
                        {(["signin", "signup"] as AuthView[]).map((v) => (
                            <button
                                key={v}
                                onClick={() => switchView(v)}
                                className={cn(
                                    "flex-1 h-9 rounded-full text-[13px] font-bold transition-all duration-300",
                                    view === v
                                        ? "bg-[oklch(0.2475_0.0661_146.79)] text-white shadow-md"
                                        : "text-[oklch(0.2475_0.0661_146.79)]/60 hover:text-[oklch(0.2475_0.0661_146.79)]"
                                )}
                            >
                                {v === "signin" ? "Sign In" : "Create Account"}
                            </button>
                        ))}
                    </div>
                )}

                {/* ── Body ── */}
                <div className="px-6 pb-7 pt-5 overflow-hidden relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={panelKey}
                            variants={panelVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >

                            {/* === SIGN IN VIEW === */}
                            {view === "signin" && (
                                <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4">
                                    <motion.div variants={fadeUp} className="mb-1">
                                        <DialogHeader>
                                            <DialogTitle className="font-erode text-2xl font-semibold tracking-tight text-[oklch(0.2475_0.0661_146.79)]">
                                                Welcome back.
                                            </DialogTitle>
                                            <DialogDescription className="text-zinc-500 text-sm mt-0.5">
                                                Sign in to sync your progress.
                                            </DialogDescription>
                                        </DialogHeader>
                                    </motion.div>

                                    <motion.div variants={fadeUp} className="flex gap-3">
                                        <SocialButton provider="google" onClick={() => handleSocialAuth("google")} disabled={isLoading} />
                                        <SocialButton provider="apple" onClick={() => handleSocialAuth("apple")} disabled={isLoading} />
                                    </motion.div>

                                    <Divider />

                                    <PillInput
                                        id="email"
                                        type="email"
                                        label="Email"
                                        placeholder="hello@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={isLoading}
                                    />

                                    <PillInput
                                        id="current-password"
                                        type={showPassword ? "text" : "password"}
                                        label="Password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={isLoading}
                                        rightSlot={
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="text-zinc-400 hover:text-zinc-600 transition-colors"
                                                tabIndex={-1}
                                            >
                                                {showPassword
                                                    ? <EyeOff className="size-4" />
                                                    : <Eye className="size-4" />}
                                            </button>
                                        }
                                    />

                                    <motion.div variants={fadeUp} className="flex justify-end -mt-1">
                                        <button
                                            type="button"
                                            onClick={() => switchView("forgot")}
                                            className="text-xs font-bold text-[oklch(0.2475_0.0661_146.79)]/60 hover:text-[oklch(0.2475_0.0661_146.79)] transition-colors"
                                        >
                                            Forgot password?
                                        </button>
                                    </motion.div>

                                    <AnimatePresence>
                                        {error && <ErrorBanner message={error} />}
                                        {success && <SuccessBanner message={success} />}
                                    </AnimatePresence>

                                    <motion.div variants={fadeUp}>
                                        <PrimaryButton
                                            onClick={handleEmailAuth}
                                            isLoading={isLoading}
                                            label="Sign In"
                                        />
                                    </motion.div>
                                </motion.div>
                            )}

                            {/* === SIGN UP VIEW === */}
                            {view === "signup" && (
                                <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4">
                                    <motion.div variants={fadeUp} className="mb-1">
                                        <DialogHeader>
                                            <DialogTitle className="font-erode text-2xl font-semibold tracking-tight text-[oklch(0.2475_0.0661_146.79)]">
                                                Start your journey.
                                            </DialogTitle>
                                            <DialogDescription className="text-zinc-500 text-sm mt-0.5">
                                                Your programs travel with you, on any device.
                                            </DialogDescription>
                                        </DialogHeader>
                                    </motion.div>

                                    <motion.div variants={fadeUp} className="flex gap-3">
                                        <SocialButton provider="google" onClick={() => handleSocialAuth("google")} disabled={isLoading} />
                                        <SocialButton provider="apple" onClick={() => handleSocialAuth("apple")} disabled={isLoading} />
                                    </motion.div>

                                    <Divider />

                                    <PillInput
                                        id="email"
                                        type="email"
                                        label="Email"
                                        placeholder="hello@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={isLoading}
                                    />

                                    <PillInput
                                        id="new-password"
                                        type={showPassword ? "text" : "password"}
                                        label="Create Password"
                                        placeholder="Min. 8 characters"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={isLoading}
                                        rightSlot={
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="text-zinc-400 hover:text-zinc-600 transition-colors"
                                                tabIndex={-1}
                                            >
                                                {showPassword
                                                    ? <EyeOff className="size-4" />
                                                    : <Eye className="size-4" />}
                                            </button>
                                        }
                                    />

                                    {/* Password strength dots */}
                                    <PasswordStrengthBar password={password} />

                                    <AnimatePresence>
                                        {error && <ErrorBanner message={error} />}
                                        {success && <SuccessBanner message={success} />}
                                    </AnimatePresence>

                                    <motion.div variants={fadeUp}>
                                        <PrimaryButton
                                            onClick={handleEmailAuth}
                                            isLoading={isLoading}
                                            label="Create Account"
                                        />
                                    </motion.div>

                                    <motion.p variants={fadeUp} className="text-[10px] text-zinc-400 text-center px-2 leading-relaxed">
                                        By creating an account you agree to our{" "}
                                        <a href="/terms" className="underline hover:text-zinc-600">Terms</a>
                                        {" "}and{" "}
                                        <a href="/privacy" className="underline hover:text-zinc-600">Privacy Policy</a>.
                                    </motion.p>
                                </motion.div>
                            )}

                            {/* === FORGOT PASSWORD VIEW === */}
                            {view === "forgot" && (
                                <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4">
                                    <motion.div variants={fadeUp}>
                                        <button
                                            onClick={() => switchView("signin")}
                                            className="flex items-center gap-1.5 text-xs font-bold text-[oklch(0.2475_0.0661_146.79)]/60 hover:text-[oklch(0.2475_0.0661_146.79)] transition-colors mb-3"
                                        >
                                            <ArrowLeft className="size-3.5" /> Back to Sign In
                                        </button>
                                        <DialogHeader>
                                            <DialogTitle className="font-erode text-2xl font-semibold tracking-tight text-[oklch(0.2475_0.0661_146.79)]">
                                                Forgot password?
                                            </DialogTitle>
                                            <DialogDescription className="text-zinc-500 text-sm mt-0.5">
                                                We'll send a reset link to your email.
                                            </DialogDescription>
                                        </DialogHeader>
                                    </motion.div>

                                    <PillInput
                                        id="reset-email"
                                        type="email"
                                        label="Email"
                                        placeholder="hello@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={isLoading}
                                    />

                                    <AnimatePresence>
                                        {error && <ErrorBanner message={error} />}
                                        {success && <SuccessBanner message={success} />}
                                    </AnimatePresence>

                                    <motion.div variants={fadeUp}>
                                        <PrimaryButton
                                            onClick={handleForgotPassword}
                                            isLoading={isLoading}
                                            label="Send Reset Link"
                                        />
                                    </motion.div>
                                </motion.div>
                            )}

                        </motion.div>
                    </AnimatePresence>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function PrimaryButton({ onClick, isLoading, label }: { onClick: () => void; isLoading: boolean; label: string }) {
    return (
        <motion.button
            whileHover={{ scale: 1.015, y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={onClick}
            disabled={isLoading}
            className={cn(
                "w-full h-12 rounded-full font-bold text-sm text-white",
                "bg-[oklch(0.2475_0.0661_146.79)] hover:bg-[oklch(0.2475_0.0661_146.79)]/90",
                "shadow-lg shadow-[oklch(0.2475_0.0661_146.79)]/20 hover:shadow-xl hover:shadow-[oklch(0.2475_0.0661_146.79)]/25",
                "transition-all duration-200",
                "disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none",
                "flex items-center justify-center"
            )}
        >
            {isLoading ? <Loader2 className="size-5 animate-spin" /> : label}
        </motion.button>
    );
}

function ErrorBanner({ message }: { message: string }) {
    return (
        <motion.div
            key="error"
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 4 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
        >
            <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-xs font-bold">
                <AlertCircle className="size-4 shrink-0" />
                <span>{message}</span>
            </div>
        </motion.div>
    );
}

function SuccessBanner({ message }: { message: string }) {
    return (
        <motion.div
            key="success"
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 4 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
        >
            <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-green-50 border border-green-100 text-green-700 text-xs font-bold">
                <CheckCircle2 className="size-4 shrink-0" />
                <span>{message}</span>
            </div>
        </motion.div>
    );
}

function PasswordStrengthBar({ password }: { password: string }) {
    if (!password) return null;

    const score = [
        password.length >= 8,
        /[A-Z]/.test(password),
        /[0-9]/.test(password),
        /[^A-Za-z0-9]/.test(password),
    ].filter(Boolean).length;

    const colors = ["bg-red-400", "bg-orange-400", "bg-amber-400", "bg-green-500"];
    const labels = ["Too short", "Weak", "Fair", "Strong"];

    return (
        <motion.div
            variants={fadeUp}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="space-y-1.5 -mt-1"
        >
            <div className="flex gap-1.5">
                {[0, 1, 2, 3].map((i) => (
                    <motion.div
                        key={i}
                        className="h-1 flex-1 rounded-full bg-zinc-100 overflow-hidden"
                        initial={false}
                    >
                        <motion.div
                            className={cn("h-full rounded-full", i < score ? colors[score - 1] : "bg-transparent")}
                            initial={{ width: 0 }}
                            animate={{ width: i < score ? "100%" : "0%" }}
                            transition={{ duration: 0.3, delay: i * 0.05 }}
                        />
                    </motion.div>
                ))}
            </div>
            <p className={cn("text-[10px] font-bold ml-0.5", score === 4 ? "text-green-600" : score >= 2 ? "text-amber-600" : "text-red-500")}>
                {labels[score - 1] ?? "Too short"}
            </p>
        </motion.div>
    );
}
