"use client";

import React, { Suspense, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/lib/context/cart-context";
import {
    CheckCircle2,
    Mail,
    ArrowRight,
    Sparkles,
    ClipboardList,
    Leaf,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FooterVariantTwo } from "@/components/sections";
import { NavbarSticky } from "@/components/navbar-sticky";
import { useUser } from "@/lib/context/user-context";
import { cn } from "@/lib/utils";
import { APP_STORE_BADGE_URL, APP_STORE_URL, PLAY_STORE_BADGE_URL, PLAY_STORE_URL } from "@/lib/constants";
import { isProgramFinderEnabled } from "@/lib/features";

// ─────────────────────────────────────────────────────────────────────────────
// Floating Particles (celebration effect)
// ─────────────────────────────────────────────────────────────────────────────
function CelebrationParticles() {
    const particleValue = (index: number, offset: number, min: number, max: number) => {
        const raw = Math.sin((index + 1) * 12.9898 + offset * 78.233) * 43758.5453;
        const fraction = raw - Math.floor(raw);
        return min + fraction * (max - min);
    };

    const particles = useMemo(
        () =>
            Array.from({ length: 24 }, (_, i) => ({
                id: i,
                x: particleValue(i, 1, 0, 100),
                delay: particleValue(i, 2, 0, 2),
                duration: particleValue(i, 3, 3, 7),
                size: particleValue(i, 4, 3, 8),
                opacity: particleValue(i, 5, 0.08, 0.2),
                drift: particleValue(i, 6, -30, 30),
            })),
        []
    );

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className="absolute rounded-full"
                    style={{
                        left: `${p.x}%`,
                        bottom: "-10px",
                        width: p.size,
                        height: p.size,
                        backgroundColor: `oklch(0.2475 0.0661 146.79)`,
                        opacity: p.opacity,
                    }}
                    animate={{
                        y: [0, -800],
                        x: [0, p.drift],
                        opacity: [p.opacity, 0],
                    }}
                    transition={{
                        duration: p.duration,
                        delay: p.delay,
                        repeat: Infinity,
                        ease: "easeOut",
                    }}
                />
            ))}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// App Store Badges
// ─────────────────────────────────────────────────────────────────────────────
function AppStoreBadge({ platform }: { platform: "ios" | "android" }) {
    const isIOS = platform === "ios";
    const href = isIOS ? APP_STORE_URL : PLAY_STORE_URL;

    return (
        <a 
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="relative transition-transform active:scale-95 inline-block"
        >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={
                    isIOS
                        ? APP_STORE_BADGE_URL
                        : PLAY_STORE_BADGE_URL
                }
                alt={isIOS ? "Download on the App Store" : "Get it on Google Play"}
                className={cn(
                    "w-auto opacity-80 hover:opacity-100 transition-opacity",
                    isIOS ? "h-[40px]" : "h-[60px] translate-x-[-8px] -my-[10px]"
                )}
            />
        </a>
    );
}

function FreeDetoxAppBonusCard() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.57 }}
            className="group rounded-[32px] p-8 md:p-10 bg-white/75 backdrop-blur-md border border-white/60 flex flex-col justify-between shadow-xl shadow-[oklch(0.2475_0.0661_146.79)]/5 relative overflow-hidden"
        >
            <div className="mb-6 flex justify-between items-start">
                <div className="size-12 rounded-full bg-[#06290C]/[0.06] text-[#06290C] flex items-center justify-center border border-[#06290C]/10">
                    <Leaf className="size-6 text-[#3D7A4A] fill-current" />
                </div>
                <div className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                    Free Bonus
                </div>
            </div>

            <div>
                <h3 className="text-[26px] md:text-[30px] font-bold mb-3 text-[oklch(0.2475_0.0661_146.79)] leading-tight font-erode">
                    Your Detox bonus is in the app.
                </h3>
                <p className="text-[14px] md:text-[15px] text-[oklch(0.2475_0.0661_146.79)]/70 font-medium leading-relaxed mb-6">
                    Every program includes the 6-Day Free Detox Program. Open Recovery Compass to start it as an in-app journey alongside your purchased program.
                </p>
                <div className="flex flex-col items-start gap-3">
                    <AppStoreBadge platform="ios" />
                    <AppStoreBadge platform="android" />
                </div>
            </div>
        </motion.div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

function SuccessPageContent() {
    const { clearCart } = useCart();
    const { user, profile, refreshAccountData } = useUser();
    const searchParams = useSearchParams();
    const dietOrderId = searchParams.get("diet_order_id")?.trim() ?? "";
    const dietClaimToken = searchParams.get("token")?.trim() ?? "";
    const successQuery = searchParams.toString();
    const successReturnPath = `/checkout/success${successQuery ? `?${successQuery}` : ""}`;
    const programFinderHref = `/program-finder?returnTo=${encodeURIComponent(successReturnPath)}`;
    const dietPlanHref = dietOrderId && dietClaimToken
        ? `/diet-plan?cart_checkout=true&diet_order_id=${encodeURIComponent(dietOrderId)}&token=${encodeURIComponent(dietClaimToken)}`
        : null;
    const programFinderEnabled = isProgramFinderEnabled();

    const showDietPlanCta = Boolean(dietPlanHref);
    const showProgramFinderCta = programFinderEnabled && Boolean(user && profile && !profile.onboarding_complete);

    // Clear cart on success
    useEffect(() => {
        clearCart();
        void refreshAccountData();
    }, [clearCart, refreshAccountData]);

    return (
        <div className="min-h-screen bg-[oklch(0.9484_0.0251_149.08)] text-[oklch(0.2475_0.0661_146.79)] font-satoshi flex flex-col">
            <NavbarSticky simple />

            {/* ───── Hero Celebration Section ───── */}
            <section className="relative overflow-hidden">
                {/* Subtle radial gradient backdrop */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background:
                            "radial-gradient(ellipse 70% 50% at 50% 0%, oklch(0.2475 0.0661 146.79 / 0.03) 0%, transparent 70%)",
                    }}
                />
                <CelebrationParticles />

                <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-12 pt-16 md:pt-24 pb-8 md:pb-12">
                    <div className="max-w-2xl mx-auto text-center">
                        {/* ── Animated Check ── */}
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{
                                type: "spring",
                                damping: 14,
                                stiffness: 180,
                                delay: 0.1,
                            }}
                            className="relative mb-10 inline-block"
                        >
                            {/* Outer ring pulse */}
                            <motion.div
                                animate={{
                                    scale: [1, 1.4, 1],
                                    opacity: [0.3, 0, 0.3],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                                className="absolute inset-0 rounded-full border-2 border-green-400/30"
                                style={{ margin: "-12px" }}
                            />
                            <div className="size-20 md:size-[88px] rounded-full bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center border-4 border-white shadow-2xl shadow-green-500/10">
                                <motion.div
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ delay: 0.4, duration: 0.6 }}
                                >
                                    <CheckCircle2 className="size-10 md:size-11 text-emerald-500" />
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* ── Headline ── */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                        >
                            <p className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] font-bold text-[oklch(0.2475_0.0661_146.79)]/30 mb-4">
                                Payment Successful
                            </p>
                            <h1 className="font-erode text-4xl md:text-[56px] font-semibold tracking-tight leading-[1.1] mb-5">
                                Welcome to your
                                <br />
                                <span className="italic text-[oklch(0.2475_0.0661_146.79)]/25">
                                    new beginning.
                                </span>
                            </h1>
                            <p className="text-[15px] md:text-[17px] text-[oklch(0.2475_0.0661_146.79)]/50 font-medium leading-relaxed max-w-md mx-auto">
                                You&apos;ve taken the most important step. Here&apos;s
                                everything you need to make the most of it.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ───── "What Happens Next" Journey ───── */}
            <motion.main
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex-1 w-full max-w-[1200px] mx-auto px-6 md:px-12 pb-16 md:pb-24"
            >
                {/* Section Label */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center gap-4 mb-10 max-w-4xl mx-auto"
                >
                    <div className="h-px flex-1 bg-[oklch(0.2475_0.0661_146.79)]/[0.06]" />
                    <p className="text-[10px] uppercase tracking-[0.25em] font-bold text-[oklch(0.2475_0.0661_146.79)]/25 whitespace-nowrap">
                        Your Next Steps
                    </p>
                    <div className="h-px flex-1 bg-[oklch(0.2475_0.0661_146.79)]/[0.06]" />
                </motion.div>

                {/* ── BENTO GRID LAYOUT ── */}
                <div className="max-w-[960px] mx-auto grid md:grid-cols-12 gap-5 md:gap-6 mb-16">
                    
                    {/* LEFT COLUMN */}
                    <div className="md:col-span-7 flex flex-col gap-5 md:gap-6">
                        
                        {/* ── Diet Plan Questionnaire (High Priority) ── */}
                        {showDietPlanCta && dietPlanHref && (
                            <motion.a
                                href={dietPlanHref}
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.55 }}
                                className="group flex-1 rounded-[32px] p-8 md:p-10 bg-[oklch(0.2475_0.0661_146.79)] text-white backdrop-blur-md border border-white/50 flex flex-col justify-between shadow-xl shadow-[oklch(0.2475_0.0661_146.79)]/20 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                                <div className="relative z-10 mb-6 size-12 rounded-full bg-white flex items-center justify-center border border-white/20">
                                    <ClipboardList className="size-6 text-[oklch(0.2475_0.0661_146.79)]" />
                                </div>
                                <div className="relative z-10 mb-8">
                                    <h3 className="text-[28px] md:text-[32px] font-bold mb-3 text-white leading-tight font-erode">
                                        Complete your Diet Profile
                                    </h3>
                                    <p className="text-[15px] md:text-[16px] text-white/70 font-medium leading-relaxed max-w-sm">
                                        You&apos;ve added a Custom Diet Plan to your order. We need a few details to generate your personalized PDF.
                                    </p>
                                </div>
                                <div className="relative z-10">
                                    <span className="inline-flex items-center gap-2.5 text-[14px] font-bold text-[oklch(0.2475_0.0661_146.79)] bg-white px-5 py-2.5 rounded-full hover:bg-white/90 transition-colors">
                                        Start Questionnaire <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </div>
                            </motion.a>
                        )}

                        {/* ── Program Finder completion ── */}
                        {showProgramFinderCta && (
                            <motion.a
                                href={programFinderHref}
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: showDietPlanCta ? 0.58 : 0.55 }}
                                className="group flex-1 rounded-[32px] p-8 md:p-10 bg-white/75 backdrop-blur-md border border-white/60 flex flex-col justify-between shadow-xl shadow-[oklch(0.2475_0.0661_146.79)]/5 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
                            >
                                <div className="mb-6 size-12 rounded-full bg-[oklch(0.2475_0.0661_146.79)]/6 flex items-center justify-center border border-[oklch(0.2475_0.0661_146.79)]/10">
                                    <ClipboardList className="size-6 text-[oklch(0.2475_0.0661_146.79)]" />
                                </div>
                                <div className="mb-8">
                                    <h3 className="text-[28px] md:text-[32px] font-bold mb-3 text-[oklch(0.2475_0.0661_146.79)] leading-tight font-erode">
                                        Complete Program Finder
                                    </h3>
                                    <p className="text-[15px] md:text-[16px] text-[oklch(0.2475_0.0661_146.79)]/62 font-medium leading-relaxed max-w-sm">
                                        Finish your profile so the app can personalize setup before Day 1 starts.
                                    </p>
                                </div>
                                <div>
                                    <span className="inline-flex items-center gap-2.5 text-[14px] font-bold text-white bg-[oklch(0.2475_0.0661_146.79)] px-5 py-2.5 rounded-full shadow-lg shadow-[oklch(0.2475_0.0661_146.79)]/10 transition-colors group-hover:bg-[oklch(0.2475_0.0661_146.79)]/92">
                                        Finish Profile <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </div>
                            </motion.a>
                        )}

                        {/* ── Free Detox App Bonus Card ── */}
                        <FreeDetoxAppBonusCard />

                        {/* ── WhatsApp Community ── */}
                        <motion.a
                            href="https://chat.whatsapp.com/GgW0StdlYGB4FG4EqfgGv0"
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="group flex-1 rounded-[32px] p-8 md:p-10 bg-white/70 backdrop-blur-md border border-white/50 flex flex-col justify-between shadow-xl shadow-[oklch(0.2475_0.0661_146.79)]/5 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
                        >
                            <div className="mb-6 size-12 rounded-full bg-[#25D366]/10 flex items-center justify-center border border-[#25D366]/20">
                                <FaWhatsapp className="size-6 text-[#25D366]" />
                            </div>
                            <div className="mb-8">
                                <h3 className="text-[28px] md:text-[32px] font-bold mb-3 text-[oklch(0.2475_0.0661_146.79)] leading-tight font-erode">
                                    Join the Inner Circle
                                </h3>
                                <p className="text-[15px] md:text-[16px] text-[oklch(0.2475_0.0661_146.79)]/70 font-medium leading-relaxed max-w-sm">
                                    Connect with guides and fellow members walking the same path, in our private WhatsApp community.
                                </p>
                            </div>
                            <div>
                                <span className="inline-flex items-center gap-2.5 text-[14px] font-bold text-[#25D366] bg-[#25D366]/5 px-5 py-2.5 rounded-full ring-1 ring-[#25D366]/20 group-hover:bg-[#25D366]/10 transition-colors">
                                    Join Now <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </div>
                        </motion.a>

                        {/* ── Check Inbox (Only if no diet plan, keep left column balanced) ── */}
                        {!showDietPlanCta && (
                            <motion.div
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.65 }}
                                className="rounded-[32px] p-8 md:p-10 bg-[oklch(0.2475_0.0661_146.79)]/5 border border-[oklch(0.2475_0.0661_146.79)]/10"
                            >
                                <div className="mb-5 size-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                                    <Mail className="size-5 text-[oklch(0.2475_0.0661_146.79)]" />
                                </div>
                                <h4 className="text-[18px] font-bold mb-2 text-[oklch(0.2475_0.0661_146.79)]">Check Your Inbox</h4>
                                <p className="text-[14px] md:text-[15px] text-[oklch(0.2475_0.0661_146.79)]/70 font-medium leading-relaxed">
                                    Your receipt and onboarding guides are on their way to your email.
                                </p>
                            </motion.div>
                        )}
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="md:col-span-5 flex flex-col gap-5 md:gap-6">
                        
                        {/* ── App Store Banner ── */}
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            className="rounded-[32px] p-8 md:p-10 bg-[oklch(0.2475_0.0661_146.79)] text-white overflow-hidden relative shadow-xl shadow-[oklch(0.2475_0.0661_146.79)]/20"
                        >
                            <div className="relative z-10">
                                <div className="mb-6 size-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                                    <Sparkles className="size-5 text-[#E5D7B7]" />
                                </div>
                                <h3 className="text-[22px] font-bold mb-3 leading-tight font-erode">
                                    Download the App
                                </h3>
                                <p className="text-[14px] md:text-[15px] text-white/70 font-medium leading-relaxed mb-6">
                                    Your daily cards, routines, and reflections live natively on your phone.
                                </p>
                                <div className="flex flex-col gap-3 items-start">
                                    <AppStoreBadge platform="ios" />
                                    <AppStoreBadge platform="android" />
                                </div>
                            </div>
                        </motion.div>

                    </div>
                </div>

                {/* ── Divider ── */}
                <div className="max-w-3xl mx-auto mt-14 mb-10">
                    <div className="h-px bg-[oklch(0.2475_0.0661_146.79)]/[0.05]" />
                </div>

                {/* ── Bottom CTA ── */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="flex flex-col items-center gap-6"
                >
                    <Button
                        asChild
                        className={cn(
                            "h-12 rounded-full px-8 font-bold text-[15px] transition-all active:scale-[0.98]",
                            "bg-[oklch(0.2475_0.0661_146.79)] text-white hover:bg-[oklch(0.2475_0.0661_146.79)]/90",
                            "shadow-xl shadow-[oklch(0.2475_0.0661_146.79)]/15"
                        )}
                    >
                        <Link
                            href="/"
                            className="flex items-center justify-center gap-2.5"
                        >
                            Return Home
                            <ArrowRight className="size-4" />
                        </Link>
                    </Button>
                    <p className="text-[12px] text-[oklch(0.2475_0.0661_146.79)]/30 font-medium">
                        Thank you for trusting Recovery Compass.
                    </p>
                </motion.div>
            </motion.main>

            {/* ───── Footer ───── */}
            <FooterVariantTwo />
        </div>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[oklch(0.9484_0.0251_149.08)]" />}>
            <SuccessPageContent />
        </Suspense>
    );
}
